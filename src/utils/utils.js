import format from "date-fns/format";
import axios from "axios";

import { PROXYIRRIGATION } from "./api";

const protocol = window.location.protocol;
const formattedDate = date => format(date, "yyyy-MM-d");

export const getPcpn = (sdate, lat, lon) => {
  const params = {
    loc: [lon, lat],
    sdate: `${new Date(sdate).getFullYear()}-03-01`,
    edate: formattedDate(new Date()),
    grid: "3",
    elems: "pcpn"
  };

  const url = `${protocol}//data.rcc-acis.org/GridData`;
  return axios
    .post(url, params)
    .then(res => res.data.data)
    .catch(err =>
      console.log("Failed to fetch precipitation data from GRID 3", err)
    );
};

export const getPET = (sdate, lat, lon) => {
  const year = new Date(sdate).getFullYear();
  // the first date is 03/01
  const url = `${PROXYIRRIGATION}?lat=${lat}&lon=${lon}&year=${year}`;
  return axios
    .get(url)
    .then(res => {
      const results = res.data.dates_pet.map((date, i) => {
        const d = date.split("/");
        return {
          date: `${year}-${d[0]}-${d[1]}`,
          et: res.data.pet[i]
        };
      });
      console.log(results);
      return results;
    })
    .catch(err => {
      console.log("Failed to fetch PET data", err);
    });
};

export const getPcpnANDPET = async (sdate, lat, lon) => {
  const pcpn = await getPcpn(sdate, lat, lon);
  const pet = await getPET(sdate, lat, lon);
  const results = pet.map((obj, i) => ({
    ...obj,
    pcpn: pcpn[i][1]
  }));
  console.log(results);
  return results;
};

export const calcDeficit = (sdate, lat, lon) => {
  const results = getPcpnANDPET(sdate, lat, lon);
  return results;
};
