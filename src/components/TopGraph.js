import React, { Component } from "react";
import { AppConsumer } from "../AppContext";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const medium = {
  wiltingpoint: 2.0,
  prewiltingpoint: 2.225,
  stressthreshold: 2.8,
  fieldcapacity: 3.5,
  saturation: 5.5
};

const levels = [
  {
    name: "No Deficit",
    color: "#2E933C",
    treshold: medium.saturation - medium.fieldcapacity
  },
  {
    name: "Deficit, No Stress",
    color: "#F9DC5C",
    treshold: medium.stressthreshold - medium.fieldcapacity
  },
  {
    name: "Deficit, Stress",
    color: "#FC9E4F",
    treshold: medium.prewiltingpoint - medium.fieldcapacity
  },
  {
    name: "Severe Stress",
    color: "#BA2D0B",
    treshold: medium.wiltingpoint - medium.fieldcapacity
  }
];

const styles = theme => ({
  root: {}
});

class TopGraph extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          const { dataModel } = context;
          return (
            <Grid container>
              {levels.map(block => (
                <Grid
                  key={block.name}
                  item
                  xs={12}
                  style={{
                    width: "100%",
                    height: 80,
                    background: block.color
                  }}
                >
                  <Typography variant="button" style={{ color: "#242038" }}>
                    {block.name}
                  </Typography>
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
