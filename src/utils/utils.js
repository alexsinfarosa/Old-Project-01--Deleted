import format from "date-fns/format";
import axios from "axios";

const protocol = window.location.protocol;
const formattedDate = date => format(date, "yyyy-MM-d");

export const getPcpn = (sdate, lat, lon) => {
  const params = {
    loc: [lon, lat],
    sdate: formattedDate(sdate),
    edate: formattedDate(new Date()),
    grid: "3",
    elems: "pcpn"
  };

  const url = `${protocol}//data.rcc-acis.org/GridData`;
  return axios
    .post(url, params)
    .then(res => {
      console.log(res.data);
      return res.data;
    })
    .catch(err => {
      console.log("Failed to fetch precipitation data from GRID 3", err);
    });
};
