import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import { AppConsumer } from "./AppContext";

import Grid from "@material-ui/core/Grid";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import ListIcon from "@material-ui/icons/List";
import Add from "@material-ui/icons/PlaylistAdd";

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

class FieldList extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          console.log("FieldList");
          const { handleIndex, mainIdx, navigateToLanding } = context;
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
                  <HomeIcon
                    className={classes.iconNotOnFocus}
                    onClick={() => handleIndex(mainIdx - 1, "mainIdx")}
                  />
                </Grid>
                <Grid item xs={4} style={{ textAlign: "center" }}>
                  <ListIcon className={classes.iconOnFocus} />
                </Grid>
                <Grid item xs={4} style={{ textAlign: "center" }}>
                  <Add
                    className={classes.iconNotOnFocus}
                    onClick={navigateToLanding}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <p>Field List</p>
              </Grid>
            </Grid>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(FieldList));
