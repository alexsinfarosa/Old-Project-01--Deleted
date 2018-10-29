import React, { Component } from "react";
import { AppConsumer } from "../AppContext";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import format from "date-fns/format";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  Tooltip,
  YAxis,
  LabelList,
  CartesianGrid
} from "recharts";

const styles = theme => ({
  root: {}
});

const data = [
  { date: "Mon 29", pet: 0.01, pcpn: 0.39, deficit: 0.016 },
  { date: "Tue 30", pet: 0.01, pcpn: 0.19, deficit: 0.0076 },
  { date: "Wed 31", pet: 0.01, pcpn: 0, deficit: -0.01 }
];

class BarChart3Days extends Component {
  render() {
    // const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          const { dataModel } = context;
          const future3Days = dataModel.slice(-3).map(obj => {
            let p = { ...obj };
            p.date = format(new Date(obj.date), "EEE d");
            p.pet = +obj.pet.toPrecision(2);
            p.pcpn = +obj.pcpn.toPrecision(2);
            p.deficit = +obj.deficit.toPrecision(2);
            return p;
          });

          console.log(future3Days);
          return (
            <ComposedChart
              width={window.innerWidth}
              height={400}
              data={data}
              margin={{ top: 32, right: 0, left: 0, bottom: 32 }}
            >
              <XAxis
                dataKey="date"
                orientation="bottom"
                axisLine={false}
                tickLine={false}
              />

              {/** <Bar dataKey="deficit" fill="#8884d8">
                <LabelList dataKey="pet" position="top" />
              </Bar> */}

              <Line
                type="monotone"
                dataKey="deficit"
                stroke="#8884d8"
                label={<CustomizedLabel />}
              />
            </ComposedChart>
          );
        }}
      </AppConsumer>
    );
  }
}

const CustomizedLabel = props => {
  const { x, y, stroke, value } = props;
  return (
    <text x={x} y={y} dy={-14} fill={stroke} fontSize={14} textAnchor="middle">
      {value}
    </text>
  );
};

export default withRoot(withStyles(styles)(BarChart3Days));
