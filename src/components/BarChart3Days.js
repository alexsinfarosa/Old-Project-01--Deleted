import React, { Component } from "react";
import { AppConsumer } from "../AppContext";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Typography from "@material-ui/core/Typography";

import format from "date-fns/format";
import {
  ComposedChart,
  Line,
  Bar,
  Cell,
  XAxis,
  Tooltip,
  YAxis,
  LabelList,
  CartesianGrid,
  Text
} from "recharts";

const styles = theme => ({
  root: {}
});

const data = [
  { date: "Tue 30 8am", pet: 0.01, pcpn: 0.2, deficit: 0.007 },
  { date: "Wed 31 8am", pet: 0.01, pcpn: 0, deficit: -0.01 },
  { date: "Thu 1 8am", pet: 0.01, pcpn: 0.2, deficit: 0.008 }
];

const determineColor = val => {
  if (val > 0) {
    return "#2E933C ";
  }
  if (val <= 0 && val >= -0.02) {
    return "#F9DC5C";
  }
  if (val < -0.02 && val >= -0.08) {
    return "#FC9E4F";
  }
  if (val < -0.08) {
    return "#BA2D0B";
  }
};

class BarChart3Days extends Component {
  render() {
    // const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          const { dataModel } = context;
          console.log(dataModel.slice(-30));
          const future3Days = dataModel.slice(-3).map(obj => {
            let p = { ...obj };
            p.date = `${format(new Date(obj.date), "EEE d")} 8am`;
            p.pet = +obj.pet.toPrecision(1);
            p.pcpn = +obj.pcpn.toPrecision(1);
            p.deficit = +obj.deficit.toPrecision(1);
            return p;
          });

          console.log(future3Days);
          return (
            <div>
              <ComposedChart
                width={window.innerWidth}
                height={300}
                data={data}
                margin={{
                  top: 32,
                  right: 0,
                  left: 0,
                  bottom: 32
                }}
              >
                <XAxis
                  tickSize={48}
                  dataKey="date"
                  orientation="top"
                  axisLine={false}
                  tickLine={false}
                />

                {/* <Bar dataKey="deficit" fill="#8884d8">
            <LabelList dataKey="pet" position="top" />
          </Bar> */}

                <Line
                  type="monotone"
                  dataKey="deficit"
                  stroke="#242038"
                  label={<CustomizedLabel />}
                />
              </ComposedChart>

              <Typography
                variant="button"
                gutterBottom
                style={{
                  marginLeft: 32,
                  color: "#9E9E9E",
                  fontWeight: "bold",
                  marginTop: 16
                }}
              >
                Since Last Irrigate:{" "}
                <span style={{ color: "#242038" }}>
                  {format(new Date(dataModel.slice(30)[0].date), "EEE d, YYYY")}
                </span>
              </Typography>
              <ComposedChart
                width={window.innerWidth}
                height={250}
                data={dataModel.slice(-30)}
                margin={{ top: 32, right: 32, left: 32, bottom: 32 }}
              >
                <Bar dataKey="deficit">
                  {dataModel.slice(-30).map((entry, index) => {
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={determineColor(entry.deficit)}
                        stroke={determineColor(entry.deficit)}
                        // strokeWidth={index === 2 ? 4 : 1}
                      />
                    );
                  })}
                </Bar>
              </ComposedChart>
            </div>
          );
        }}
      </AppConsumer>
    );
  }
}

const CustomizedLabel = props => {
  const { x, y, stroke, value, index } = props;
  console.log(props);
  const radius = index === 0 ? 25 : 10;
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={determineColor(value)}
        stroke={determineColor(value)}
      />
      <text x={x} y={y} dy={+4} fill="white" fontSize={14} textAnchor="middle">
        {index === 0 ? value : null}
      </text>
    </g>
  );
};

export default withRoot(withStyles(styles)(BarChart3Days));
