import React, { Component } from "react";
import { AppConsumer } from "./AppContext";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Slider from "@material-ui/lab/Slider";

import { determineColor } from "./utils/utils";

const styles = theme => ({
  padding: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  slider: {
    padding: "22px 0px"
  },
  thumb: {
    width: 20,
    height: 20
  }
});

class AdjustDeficit extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;

    return (
      <AppConsumer>
        {context => {
          const {
            dataModel,
            setDisplayDeficitScreen,
            setDeficitAdjustment,
            today
          } = context;

          const todayIdx = dataModel.findIndex(obj => obj.date === today);
          const todayDeficit = dataModel[todayIdx].deficit;

          return (
            <Grid container style={{ background: "#fff" }}>
              <Grid
                container
                justify="space-between"
                alignItems="center"
                style={{ padding: 32 }}
              >
                <Grid item>
                  <ArrowBackIcon
                    style={{ paddingBottom: 2 }}
                    onClick={() => setDisplayDeficitScreen(false)}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" gutterBottom>
                    Adjust Water Deficit
                  </Typography>
                </Grid>

                <Grid />
              </Grid>

              <Grid
                item
                xs={12}
                container
                justify="center"
                alignItems="center"
                className={classes.padding}
              >
                <Grid item xs={10}>
                  <Typography
                    variant="button"
                    gutterBottom
                    align="center"
                    style={{
                      width: "70%",
                      margin: "0 auto",
                      marginBottom: 64,
                      borderBottom: `5px solid ${determineColor(
                        todayDeficit + this.state.value
                      )}`,
                      borderRadius: 8
                    }}
                  >
                    {`Current Water Deficit: ${(
                      todayDeficit + this.state.value
                    ).toFixed(2)}`}
                  </Typography>
                </Grid>

                <Grid item xs={10}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ marginBottom: 32 }}
                  >
                    How much water did you irrigate?
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={10}
                  container
                  justify="center"
                  alignItems="center"
                >
                  <Typography
                    variant="h4"
                    gutterBottom
                    style={{
                      marginBottom: 32,
                      border: "1px solid #eee",
                      padding: 8,
                      borderRadius: 10
                    }}
                  >
                    {this.state.value.toFixed(2)}{" "}
                    <span style={{ fontSize: 14 }}>unit</span>
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={8}
                  container
                  justify="center"
                  alignItems="center"
                >
                  <Slider
                    classes={{
                      container: classes.slider,
                      thumb: classes.thumb
                    }}
                    value={this.state.value}
                    max={2}
                    step={0.01}
                    aria-labelledby="label"
                    onChange={this.handleChange}
                  />
                </Grid>
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
                  style={{ height: 70, borderRadius: 0 }}
                  onClick={() => {
                    setDeficitAdjustment(this.state.value);
                  }}
                >
                  Update!
                </Button>
              </Grid>
            </Grid>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(AdjustDeficit));
