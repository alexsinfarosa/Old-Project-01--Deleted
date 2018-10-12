import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import Grid from "@material-ui/core/Grid";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import CloudIcon from "@material-ui/icons/Cloud";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    width: "100%",
    margin: 0,
    padding: 0,
    background: "#fff"
  },
  iconOnFocus: {
    color: theme.palette.primary.main,
    fontSize: 40,
    marginTop: theme.spacing.unit
  },
  iconNotOnFocus: {
    color: theme.palette.grey["500"],
    fontSize: 32
  },
  padding: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  }
});

class Forecast extends Component {
  render() {
    const { classes, handleIndex } = this.props;
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid
            item
            xs={12}
            container
            justify="center"
            alignItems="center"
            className={classes.padding}
          >
            <Grid item xs={4} style={{ textAlign: "center" }} />
            <Grid item xs={4} style={{ textAlign: "center" }}>
              <CloudIcon className={classes.iconOnFocus} />
            </Grid>
            <Grid item xs={4} style={{ textAlign: "center" }}>
              <HomeIcon
                className={classes.iconNotOnFocus}
                onClick={() => handleIndex(1)}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <p>Field</p>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(Forecast));
