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

import isAfter from "date-fns/isAfter";

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 8,
    height: theme.spacing.unit * 8
  }
});

class FieldIrrigationDate extends Component {
  state = {
    irrigationDate: new Date()
  };

  handleIrrigationDate = irrigationDate => this.setState({ irrigationDate });

  componentDidMount() {
    const year = new Date().getFullYear();
    const endSeason = `10-31-${year}`;

    const today = new Date();
    const isAfterToday = isAfter(new Date(today), new Date(endSeason));
    // console.log({ isAfterToday });
    if (isAfterToday) {
      // this.setState({ irrigationDate: new Date(endSeason) });
      this.setState({ irrigationDate: new Date("07/07/2018") });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          const { handleIndex, landingIdx } = context;
          const year = new Date(this.state.irrigationDate).getFullYear();
          const startSeason = `${year}-03-01`;
          const endSeason = `${year}-11-01`;

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
                minDate={new Date(startSeason)}
                maxDate={new Date(endSeason)}
                value={this.state.irrigationDate}
                onChange={date => {
                  this.handleIrrigationDate(date);
                  context.handleIrrigationDate(date);
                }}
                format="MMMM do, yyyy"
                disableFuture
              />

              <Button
                fullWidth={false}
                size="large"
                variant="outlined"
                color="secondary"
                className={classes.button}
                onClick={() => {
                  this.handleIrrigationDate(this.state.irrigationDate);
                  context.handleIrrigationDate(this.state.irrigationDate);
                  context.addField();
                  context.navigateToMain(1);
                }}
              >
                Start
              </Button>
            </Grid>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(FieldIrrigationDate));
