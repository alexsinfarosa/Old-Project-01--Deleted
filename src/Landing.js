import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import { AppConsumer } from "./AppContext";

import Grid from "@material-ui/core/Grid";
import Zoom from "@material-ui/core/Zoom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import SwipeableViews from "react-swipeable-views";

import FieldLocation from "./FieldLocation";
import FieldIrrigationDate from "./FieldIrrigationDate";

const styles = theme => ({
  padding: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 8,
    height: theme.spacing.unit * 8
  },
  firstLetter: {
    color: theme.palette.error.main
  }
});

class Landing extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          const { handleIndex, landingIdx } = context;
          return (
            <Zoom in={true}>
              <SwipeableViews
                disabled
                // enableMouseEvents
                index={landingIdx}
                onChangeIndex={idx => handleIndex(idx, "landingIdx")}
                containerStyle={{ height: window.innerHeight }}
                slideStyle={{ height: "100%", background: "#fff" }}
              >
                <Grid
                  item
                  xs={12}
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  style={{ height: "100%", background: "#fff" }}
                >
                  <Typography component="h1" variant="h5" gutterBottom>
                    Welcome To CSF
                  </Typography>
                  <Typography component="h1" variant="h5" gutterBottom>
                    <span className={classes.firstLetter}>W</span>
                    ater <span className={classes.firstLetter}>D</span>
                    eficit
                  </Typography>
                  <Typography component="h1" variant="h5" gutterBottom>
                    <span className={classes.firstLetter}>C</span>
                    alculator!
                  </Typography>
                  <Button
                    size="large"
                    variant="outlined"
                    color="secondary"
                    className={classes.button}
                    onClick={() => handleIndex(1, "landingIdx")}
                  >
                    Start creating a field
                  </Button>
                </Grid>

                <FieldLocation />
                <FieldIrrigationDate
                  landingIdx={landingIdx}
                  navigateToMain={this.props.navigateToMain}
                />
              </SwipeableViews>
            </Zoom>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(Landing));
