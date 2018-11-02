import React, { Component } from "react";
import { AppConsumer } from "./AppContext";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import Grid from "@material-ui/core/Grid";
import HomeIcon from "@material-ui/icons/Home";
import ListIcon from "@material-ui/icons/ListOutlined";
import CloudIcon from "@material-ui/icons/CloudOutlined";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import BarChart3Days from "./components/BarChart";
import TopGraph from "./components/TopGraph";

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
          // console.log("Field");
          const { handleIndex, mainIdx, fieldName } = context;
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

              <Grid
                item
                xs={12}
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ marginBottom: 16, marginTop: 16 }}
                >
                  {fieldName}
                </Typography>

                <TopGraph />
                <BarChart3Days />
              </Grid>

              <Grid
                item
                xs={12}
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  textAlign: "center"
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ height: 70 }}
                  // size="large"
                >
                  I watered!
                </Button>
              </Grid>
            </Grid>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(Field));
