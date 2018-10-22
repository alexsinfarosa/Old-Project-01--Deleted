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
                  <Typography component="h1" variant="h5" gutterBottom>
                    Irrigation Date
                  </Typography>
                </Grid>
                <Grid />
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
                Create Field
              </Button>
            </Grid>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(FieldIrrigationDate));
