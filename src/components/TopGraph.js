import React, { Component } from "react";
import { AppConsumer } from "../AppContext";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import format from "date-fns/format";
import { determineColor } from "../utils/utils";

const levels = [
  {
    id: 0,
    name: "No Deficit",
    color: "#2E933C"
  },
  {
    id: 1,
    name: "Deficit, No Stress",
    color: "#F9DC5C"
  },
  {
    id: 2,
    name: "Deficit, Stress",
    color: "#FC9E4F"
  },
  {
    id: 3,
    name: "Severe Stress",
    color: "#BA2D0B"
  }
];

const styles = theme => ({
  root: {},
  rowHeader: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  rowLevel: {
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center"
  }
});

class TopGraph extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          const { dataModel, irrigationDate } = context;
          const irriDate = format(new Date(irrigationDate), "MM/dd/YYYY");
          const irrigationDayIdx = dataModel.findIndex(
            obj => obj.date === irriDate
          );
          const data = dataModel.slice(irrigationDayIdx, irrigationDayIdx + 3);

          const results = data.map(obj => {
            let p = { ...obj };
            p.level = determineColor(obj.deficit);

            return p;
          });
          console.log(results);
          return (
            <Grid container>
              <Grid item container className={classes.rowHeader}>
                {results.map(obj => (
                  <Grid
                    key={obj.date}
                    item
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <Typography variant="button">
                      {format(new Date(obj.date), "EEE d")}
                      <span style={{ fontSize: 10, marginLeft: 4 }}>8am</span>
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              {levels.map(level => (
                <Grid
                  key={level.id}
                  item
                  container
                  className={classes.rowLevel}
                  style={{ background: level.color }}
                >
                  {results.map(obj => (
                    <Grid
                      key={obj.date}
                      item
                      style={{ flex: 1, textAlign: "center" }}
                    >
                      {obj.level === level.id ? obj.date : null}
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(TopGraph));
