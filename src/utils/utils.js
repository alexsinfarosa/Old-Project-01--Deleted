import axios from "axios";

import { PROXYIRRIGATION } from "./api";

// soildata:
// soil moisture and drainage characteristics for different levels of soil water capacity
// const modeldata = {
//   cropinfo: {
//     grass: {
//       Lini: 0,
//       Ldev: 0,
//       Lmid: 240,
//       Llate: 0,
//       Kcini: 1.0,
//       Kcmid: 1.0,
//       Kcend: 1.0
//     }
//   },
//   soildata: {
//     soilmoistureoptions: {
//       low: {
//         wiltingpoint: 1.0,
//         prewiltingpoint: 1.15,
//         stressthreshold: 1.5,
//         fieldcapacity: 2.0,
//         saturation: 5.0
//       },
//       medium: {
//         wiltingpoint: 2.0,
//         prewiltingpoint: 2.225,
//         stressthreshold: 2.8,
//         fieldcapacity: 3.5,
//         saturation: 5.5
//       },
//       high: {
//         wiltingpoint: 3.0,
//         prewiltingpoint: 3.3,
//         stressthreshold: 4.0,
//         fieldcapacity: 5.0,
//         saturation: 6.5
//       }
//     },
//     soildrainageoptions: {
//       low: { daysToDrainToFcFromSat: 0.125 },
//       medium: { daysToDrainToFcFromSat: 1.0 },
//       high: { daysToDrainToFcFromSat: 2.0 }
//     }
//   }
// };

// const getPotentialDailyDrainage = soilcap => {
//   // -----------------------------------------------------------------------------------------
//   // Calculate potential daily drainage of soil
//   //
//   // soilcap : soil water capacity : string ('high', 'medium', 'low')
//   // -----------------------------------------------------------------------------------------
//   return (
//     (modeldata.soildata.soilmoistureoptions[soilcap].saturation -
//       modeldata.soildata.soilmoistureoptions[soilcap].fieldcapacity) /
//     modeldata.soildata.soildrainageoptions[soilcap].daysToDrainToFcFromSat
//   );
// };

// const getTawForPlant = soilcap => {
//   // -----------------------------------------------------------------------------------------
//   // Calculate total available water (TAW) for plant, defined here as:
//   // soil moisture at field capacity minus soil moisture at wilting point
//   //
//   // soilcap : soil water capacity : string ('high', 'medium', 'low')
//   // -----------------------------------------------------------------------------------------
//   return (
//     modeldata.soildata.soilmoistureoptions[soilcap].fieldcapacity -
//     modeldata.soildata.soilmoistureoptions[soilcap].wiltingpoint
//   );
// };

// const getWaterStressCoeff = (Dr, TAW) => {
//   // -----------------------------------------------------------------------------------------
//   // Calculate coefficient for adjusting ET when accounting for decreased ET during water stress conditions.
//   // Refer to FAO-56 eq 84, pg 169
//   // Dr  : the antecedent water deficit (in)
//   // TAW : total available (in) water for the plant (soil moisture at field capacity minus soil moisture at wilting point).
//   // p   : at what fraction between field capacity and wilting point do we start applying this water stress factor.
//   // Ks  : water stress coefficient
//   // -----------------------------------------------------------------------------------------
//   let Ks = null;
//   const p = 0.5;
//   Dr = -1 * Dr;
//   Ks = Dr <= p * TAW ? 1 : (TAW - Dr) / ((1 - p) * TAW);
//   Ks = Math.max(Ks, 0);
//   return Ks;
// };

export const getPET = (sdate, lat, lon) => {
  console.log("getPET CALLED!!!!!");

  const year = new Date(sdate).getFullYear().toString();
  const latitude = lat.toFixed(4);
  const longitude = lon.toFixed(4);

  // console.log(year, latitude, longitude);

  // the first date is 03/01
  const url = `${PROXYIRRIGATION}?lat=${latitude}&lon=${longitude}&year=${year}`;
  console.log(url);
  return axios
    .get(url)
    .then(res => {
      console.log(`BrianCALL`, res);
      // const results = {
      //   dates: [...res.data.dates_pet, ...res.data.dates_pet_fcst],
      //   pets: [...res.data.pet, ...res.data.dates_pet_fcst],
      //   pcpns: [...res.data.precip, ...res.data.precip_fcst],
      //   deficits: []
      // };
      // console.log(results);
      return res;
    })
    .catch(err => {
      console.log("Failed to fetch PET data", err);
    });
};
