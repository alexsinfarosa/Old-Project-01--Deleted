import React, { Component } from "react";
import { AppConsumer } from "./AppContext";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import Grid from "@material-ui/core/Grid";
import HomeIcon from "@material-ui/icons/Home";
import ListIcon from "@material-ui/icons/ListOutlined";
import CloudIcon from "@material-ui/icons/CloudOutlined";

import format from "date-fns/format";

const styles = theme => ({
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

class Field extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          console.log("Field");
          const { handleIndex, mainIdx, fields, field } = context;

          const fieldInView = field ? field : fields[0];

          return (
            <Grid container>
              <Grid
                item
                xs={12}
                container
                justify="center"
                alignItems="center"
                className={classes.padding}
              >
                <Grid item xs={4} style={{ textAlign: "center" }}>
                  <CloudIcon
                    className={classes.iconNotOnFocus}
                    onClick={() => handleIndex(mainIdx - 1, "mainIdx")}
                  />
                </Grid>
                <Grid item xs={4} style={{ textAlign: "center" }}>
                  <HomeIcon className={classes.iconOnFocus} />
                </Grid>
                <Grid item xs={4} style={{ textAlign: "center" }}>
                  <ListIcon
                    className={classes.iconNotOnFocus}
                    onClick={() => handleIndex(mainIdx + 1, "mainIdx")}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} container justify="center">
                <p>{fieldInView.address}</p>
                <p>{format(fieldInView.irrigationDate, "MMMM do, YYYY")}</p>
              </Grid>
            </Grid>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(Field));
