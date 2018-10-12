import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import Grid from "@material-ui/core/Grid";
import Zoom from "@material-ui/core/Zoom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import SwipeableViews from "react-swipeable-views";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    width: "100%",
    margin: 0,
    padding: 0,
    background: "#fff"
  },
  padding: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 8
  },
  firstLetter: {
    color: theme.palette.error.main
  }
});

class Landing extends Component {
  render() {
    const { classes, isCreateNewField } = this.props;
    return (
      <div className={classes.root}>
        <Zoom in={isCreateNewField}>
          <SwipeableViews
            enableMouseEvents
            index={0}
            // onChangeIndex={idx => this.handleIndex(idx)}
          >
            <Grid
              item
              xs={12}
              container
              justify="center"
              alignItems="center"
              style={{ background: "pink", height: "100%" }}
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
                alculator
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                className={classes.button}
                onClick={this.props.navigateToMain}
              >
                Create Field
              </Button>
            </Grid>

            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ height: "100%", background: "orange" }}
            >
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Typography component="h1" variant="h5" gutterBottom>
                  Location
                </Typography>
              </Grid>
            </Grid>

            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ height: "100%" }}
            >
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Typography component="h1" variant="h5" gutterBottom>
                  Irrigation Date
                </Typography>
              </Grid>
            </Grid>
          </SwipeableViews>
        </Zoom>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(Landing));
