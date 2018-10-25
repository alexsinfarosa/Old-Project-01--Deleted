import axios from "axios";

import { PROXYIRRIGATION } from "./api";

// soildata:
// soil moisture and drainage characteristics for different levels of soil water capacity
const modeldata = {
  cropinfo: {
    grass: {
      Lini: 0,
      Ldev: 0,
      Lmid: 240,
      Llate: 0,
      Kcini: 1.0,
      Kcmid: 1.0,
      Kcend: 1.0
    }
  },
  soildata: {
    soilmoistureoptions: {
      low: {
        wiltingpoint: 1.0,
        prewiltingpoint: 1.15,
        stressthreshold: 1.5,
        fieldcapacity: 2.0,
        saturation: 5.0
      },
      medium: {
        wiltingpoint: 2.0,
        prewiltingpoint: 2.225,
        stressthreshold: 2.8,
        fieldcapacity: 3.5,
        saturation: 5.5
      },
      high: {
        wiltingpoint: 3.0,
        prewiltingpoint: 3.3,
        stressthreshold: 4.0,
        fieldcapacity: 5.0,
        saturation: 6.5
      }
    },
    soildrainageoptions: {
      low: { daysToDrainToFcFromSat: 0.125 },
      medium: { daysToDrainToFcFromSat: 1.0 },
      high: { daysToDrainToFcFromSat: 2.0 }
    }
  }
};

const getPotentialDailyDrainage = soilcap => {
  // -----------------------------------------------------------------------------------------
  // Calculate potential daily drainage of soil
  //
  // soilcap : soil water capacity : string ('high', 'medium', 'low')
  // -----------------------------------------------------------------------------------------
  return (
    (modeldata.soildata.soilmoistureoptions[soilcap].saturation -
      modeldata.soildata.soilmoistureoptions[soilcap].fieldcapacity) /
    modeldata.soildata.soildrainageoptions[soilcap].daysToDrainToFcFromSat
  );
};

const getTawForPlant = soilcap => {
  // -----------------------------------------------------------------------------------------
  // Calculate total available water (TAW) for plant, defined here as:
  // soil moisture at field capacity minus soil moisture at wilting point
  //
  // soilcap : soil water capacity : string ('high', 'medium', 'low')
  // -----------------------------------------------------------------------------------------
  return (
    modeldata.soildata.soilmoistureoptions[soilcap].fieldcapacity -
    modeldata.soildata.soilmoistureoptions[soilcap].wiltingpoint
  );
};

const getWaterStressCoeff = (Dr, TAW) => {
  // -----------------------------------------------------------------------------------------
  // Calculate coefficient for adjusting ET when accounting for decreased ET during water stress conditions.
  // Refer to FAO-56 eq 84, pg 169
  // Dr  : the antecedent water deficit (in)
  // TAW : total available (in) water for the plant (soil moisture at field capacity minus soil moisture at wilting point).
  // p   : at what fraction between field capacity and wilting point do we start applying this water stress factor.
  // Ks  : water stress coefficient
  // -----------------------------------------------------------------------------------------
  let Ks = null;
  const p = 0.5;
  Dr = -1 * Dr;
  Ks = Dr <= p * TAW ? 1 : (TAW - Dr) / ((1 - p) * TAW);
  Ks = Math.max(Ks, 0);
  return Ks;
};

export const getPET = (sdate, lat, lon) => {
  const year = new Date(sdate).getFullYear().toString();
  const latitude = lat.toFixed(4);
  const longitude = lon.toFixed(4);
  // the first date is 03/01
  const url = `${PROXYIRRIGATION}?lat=${latitude}&lon=${longitude}&year=${year}`;
  return axios
    .get(url)
    .then(res => {
      // console.log(`BrianCALL`, res);

      const results = {
        dates: [...res.data.dates_pet, ...res.data.dates_pet_fcst],
        pets: [...res.data.pet, ...res.data.pet_fcst],
        pcpns: [...res.data.precip, ...res.data.precip_fcst]
      };

      let resT = [];
      results.dates.forEach((date, i) => {
        let p = {};
        p["date"] = `${date}/${year}`;
        p["pet"] = results.pets[i];
        p["pcpn"] = results.pcpns[i];
        p["deficit"] = i === 0 ? 0 : null;
        resT.push(p);
      });

      // console.log(resT);
      return resT;
    })
    .catch(err => {
      console.log("Failed to fetch PET data", err);
    });
};

export const calculateDeficit = async (sdate, lat, lon, soilCapacity) => {
  const data = await getPET(sdate, lat, lon);
  // console.log(data);

  const TAW = getTawForPlant(soilCapacity);
  let Kc = 1;
  let hourlyDrainage;
  let tempDeficit;
  // // Calculate daily drainage rate that occurs when soil water content is between saturation and field capacity
  const dailyPotentialDrainageRate = getPotentialDailyDrainage(soilCapacity);

  const results = data.map((obj, i) => {
    // console.log(obj);
    const Ks =
      i === 0
        ? getWaterStressCoeff(obj.deficit, TAW)
        : getWaterStressCoeff(data[i - 1].deficit, TAW);

    const totalDailyPET = -1 * obj.pet * Kc * Ks;
    const hourlyPET = (-1 * totalDailyPET) / 24;
    const hourlyPrecip = obj.pcpn / 24;
    const hourlyPotentialDrainage = dailyPotentialDrainageRate / 24;

    for (let hr = 1; hr <= 24; hr++) {
      if (obj.deficit > 0) {
        hourlyDrainage = Math.min(obj.deficit, hourlyPotentialDrainage);
      } else {
        hourlyDrainage = 0;
      }

      tempDeficit = Math.min(
        obj.deficit + hourlyPrecip - hourlyPET - hourlyDrainage,
        modeldata.soildata.soilmoistureoptions[soilCapacity].saturation -
          modeldata.soildata.soilmoistureoptions[soilCapacity].fieldcapacity
      );

      obj.deficit = Math.max(
        tempDeficit,
        -1 *
          (modeldata.soildata.soilmoistureoptions[soilCapacity].fieldcapacity -
            modeldata.soildata.soilmoistureoptions[soilCapacity].wiltingpoint)
      );
    }
    // console.log(obj);
    return obj;
  });

  console.log(results);
  return results;
};
