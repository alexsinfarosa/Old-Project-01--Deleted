import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import { AppConsumer } from "./AppContext";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// import DatePicker from "material-ui-pickers/DatePicker";
import { InlineDatePicker } from "material-ui-pickers/DatePicker";
import isWithinInterval from "date-fns/isWithinInterval";
const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 8,
    height: theme.spacing.unit * 8
  }
});

class FieldIrrigationDate extends Component {
  state = {
    irrigationDate: new Date(),
    isOutOfSeason: false
  };
  handleIrrigationDate = irrigationDate => {
    const year = new Date(irrigationDate).getFullYear();
    console.log(year);
    const startSeason = `03-01-${year}`;
    const endSeason = `10-31-${year}`;
    const isInSeason = isWithinInterval(new Date(irrigationDate), {
      start: new Date(startSeason),
      end: new Date(endSeason)
    });
    if (isInSeason) {
      this.setState({ irrigationDate });
    } else {
      this.setState({ isOutOfSeason: true });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          const { handleIndex, landingIdx } = context;
          return (
            <Grid
              item
              xs={12}
              container
              direction="column"
              // justify="center"
              alignItems="center"
              style={{ padding: 32, background: "#fff" }}
            >
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <ArrowBackIcon
                    style={{ paddingBottom: 2 }}
                    onClick={() => handleIndex(landingIdx - 1, "landingIdx")}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" gutterBottom>
                    Create a field - step 2/2
                  </Typography>
                </Grid>
                <Grid />
              </Grid>

              <Grid item style={{ marginTop: 64 }}>
                <Typography variant="h6" gutterBottom>
                  When is your last irrigation?
                </Typography>
              </Grid>

              <InlineDatePicker
                onlyCalendar
                style={{ width: "100%", marginTop: 32 }}
                value={this.state.irrigationDate}
                onChange={date => {
                  this.handleIrrigationDate(date);
                  context.handleIrrigationDate(date);
                }}
                format="MMMM do, yyyy"
                disableFuture
              />

              {this.state.isOutOfSeason ? (
                <div>
                  <Typography
                    variant="caption"
                    align="center"
                    style={{ marginTop: 16 }}
                  >
                    Date provided is out of season!
                  </Typography>
                  <Typography
                    variant="caption"
                    align="center"
                    style={{ marginTop: 16 }}
                  >
                    Season data is available from March 1st. through October
                    31st.
                  </Typography>
                </div>
              ) : (
                <Button
                  fullWidth={false}
                  size="large"
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  onClick={() => {
                    context.addField();
                    context.navigateToMain(1);
                  }}
                >
                  Start
                </Button>
              )}
            </Grid>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(FieldIrrigationDate));
