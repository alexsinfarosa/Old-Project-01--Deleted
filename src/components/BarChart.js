import React, { Component } from "react";
import { AppConsumer } from "../AppContext";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Typography from "@material-ui/core/Typography";

import format from "date-fns/format";
import { ComposedChart, Bar, Cell } from "recharts";
import { determineColor } from "../utils/utils";

const styles = theme => ({
  root: {}
});

class BarChart3Days extends Component {
  render() {
    // const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          const { dataModel } = context;
          // const irriDate = format(new Date(irrigationDate), "MM/dd/YYYY");
          // const irrigationDayIdx = dataModel.findIndex(
          //   obj => obj.date === irriDate
          // );

          const today = format(new Date("09/16/2018"), "MM/dd/YYYY");
          const todayIdx = dataModel.findIndex(obj => obj.date === today);
          console.log(todayIdx - 29, todayIdx + 1);
          const temp = dataModel.slice(0, todayIdx + 1);
          console.log(temp);
          const data = temp.slice(-30).map(obj => {
            let p = { ...obj };
            p.deficit = obj.deficit === 0 ? 0.0000001 : obj.deficit;
            return p;
          });

          console.log(data);
          return (
            <>
              <Typography
                variant="button"
                style={{
                  color: "#9E9E9E",
                  fontWeight: "bold",
                  marginTop: 32,
                  marginBottom: 16
                }}
              >
                water deficit in the last 30 days
                {/*<span style={{ color: "#242038", fontWeight: "normal" }}>
                  {data[0] && format(new Date(data[0].date), "MMM d, YYYY")}
              </span>*/}
              </Typography>

              <ComposedChart
                width={window.innerWidth}
                height={150}
                data={data}
                margin={{ top: 16, right: -2, left: -2, bottom: 0 }}
              >
                {data && (
                  <Bar dataKey="deficit">
                    {data.map((entry, index) => {
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
                )}
              </ComposedChart>
            </>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(BarChart3Days));
