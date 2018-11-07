import React, { Component } from "react";
import { AppConsumer } from "../AppContext";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Typography from "@material-ui/core/Typography";

// import format from "date-fns/format";
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
          const { dataModel, todayIdx } = context;
          const upToToday = dataModel.slice(0, todayIdx + 1);
          const days = upToToday.length;
          // console.log(upToToday, days);

          const startIdx = days > 30 ? days - 30 : 0;

          const results = upToToday.slice(startIdx, days).map(obj => {
            let p = { ...obj };
            p.deficit = obj.deficit === 0 ? 0.0000001 : obj.deficit;
            return p;
          });

          console.log(results);
          return (
            <>
              {results.length >= 3 && (
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
                    water deficit in the last {days > 30 ? 30 : days} days
                  </Typography>

                  <ComposedChart
                    width={window.innerWidth}
                    height={150}
                    data={results}
                    margin={{ top: 16, right: -2, left: -2, bottom: 0 }}
                  >
                    {results && (
                      <Bar dataKey="deficit">
                        {results.map((entry, index) => {
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
              )}
            </>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(BarChart3Days));
