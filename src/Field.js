import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import Grid from "@material-ui/core/Grid";

import Navigation from "./components/Navigation";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    width: "100%",
    margin: 0,
    padding: 0,
    background: "#fff"
  }
});

class Field extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.root}>
        <Navigation />
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <p>Field</p>
        </Grid>
      </Grid>
    );
  }
}

export default withRoot(withStyles(styles)(Field));
