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
  YAxis,
  Area,
  BarChart
} from "recharts";

const styles = theme => ({
  root: {}
});

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
          return (
            <>
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
            </>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(BarChart3Days));
