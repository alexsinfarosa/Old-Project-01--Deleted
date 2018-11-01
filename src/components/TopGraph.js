import React, { Component } from "react";
import { AppConsumer } from "../AppContext";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import format from "date-fns/format";

const medium = {
  wiltingpoint: 2.0,
  prewiltingpoint: 2.225,
  stressthreshold: 2.8,
  fieldcapacity: 3.5,
  saturation: 5.5
};

const levels = [
  {
    id: 0,
    name: "No Deficit",
    color: "#2E933C",
    treshold: medium.saturation - medium.fieldcapacity
  },
  {
    id: 1,
    name: "Deficit, No Stress",
    color: "#F9DC5C",
    treshold: medium.stressthreshold - medium.fieldcapacity
  },
  {
    id: 2,
    name: "Deficit, Stress",
    color: "#FC9E4F",
    treshold: medium.prewiltingpoint - medium.fieldcapacity
  },
  {
    id: 3,
    name: "Severe Stress",
    color: "#BA2D0B",
    treshold: medium.wiltingpoint - medium.fieldcapacity
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

const determineLevel = deficit => {
  if (deficit > medium.stressthreshold - medium.fieldcapacity) {
    return 0;
  }
  if (
    deficit > medium.prewiltingpoint - medium.fieldcapacity &&
    deficit <= medium.stressthreshold - medium.fieldcapacity
  ) {
    return 1;
  }

  if (
    deficit > medium.wiltingpoint - medium.fieldcapacity &&
    deficit <= medium.prewiltingpoint - medium.fieldcapacity
  ) {
    return 2;
  }

  if (deficit < medium.wiltingpoint - medium.fieldcapacity) {
    return 3;
  }
};

class TopGraph extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          const { dataModel } = context;
          const today = format(new Date(), "MM/dd/YYYY");
          const todayIdx = dataModel.findIndex(obj => obj.date === today);
          let todayPlus2;
          todayIdx === -1
            ? (todayPlus2 = dataModel.slice(-3))
            : (todayPlus2 = dataModel.slice(todayIdx, todayIdx + 3));

          const results = todayPlus2.map(obj => {
            let p = { ...obj };
            p.level = determineLevel(obj.deficit);

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
