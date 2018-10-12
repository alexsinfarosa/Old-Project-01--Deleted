import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    width: "100%",
    margin: 0,
    padding: 0,
    background: "#fff"
  },
  button: {
    marginTop: theme.spacing.unit * 8
  }
});

class FieldLocation extends Component {
  render() {
    const { classes, landingIdx, handleIndex } = this.props;
    return (
      <div className={classes.root}>
        <Grid
          item
          xs={12}
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ height: "100%" }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Location
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            onClick={() => handleIndex(landingIdx + 1, "landingIdx")}
          >
            set Irrigation Date
          </Button>
        </Grid>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(FieldLocation));
