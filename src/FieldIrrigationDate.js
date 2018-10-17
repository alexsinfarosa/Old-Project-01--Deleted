import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import { AppConsumer } from "./AppContext";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// import DatePicker from "material-ui-pickers/DatePicker";
import { InlineDatePicker } from "material-ui-pickers/DatePicker";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: window.innerHeight,
    margin: 0,
    background: "#fff",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4
  },
  button: {
    marginTop: theme.spacing.unit * 8,
    height: theme.spacing.unit * 8
  }
});

class FieldIrrigationDate extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => (
          <div className={classes.root}>
            <Grid
              item
              xs={12}
              container
              direction="column"
              // justify="center"
              alignItems="center"
              style={{ paddingTop: 32 }}
            >
              <Typography
                component="h1"
                variant="h5"
                gutterBottom
                style={{ paddingBottom: 32 }}
              >
                Irrigation Date
              </Typography>

              <InlineDatePicker
                onlyCalendar
                style={{ width: "100%" }}
                value={context.irrigationDate}
                onChange={date => context.handleIrrigationDate(date)}
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
                  context.navigateToMain();
                  context.addField();
                }}
              >
                Create Field
              </Button>
            </Grid>
          </div>
        )}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(FieldIrrigationDate));
