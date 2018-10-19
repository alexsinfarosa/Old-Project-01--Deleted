import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import { AppConsumer } from "./AppContext";

import Grid from "@material-ui/core/Grid";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import CloudIcon from "@material-ui/icons/Cloud";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import format from "date-fns/format";

import { weatherIcons } from "./utils/weatherIcons";

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
  },
  top: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "pink"
  },
  middle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "teal"
  },
  bottom: {
    flex: 6,
    // backgroundColor: "tomato",
    alignItems: "stretch",
    marginBottom: 32
  },
  secondary: {
    color: "#3f51b5"
  }
});

class Forecast extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          console.log("Forecast");
          const { handleIndex, mainIdx, forecastData, field } = context;

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
                <Grid item xs={4} style={{ textAlign: "center" }} />
                <Grid item xs={4} style={{ textAlign: "center" }}>
                  <CloudIcon className={classes.iconOnFocus} />
                </Grid>
                <Grid item xs={4} style={{ textAlign: "center" }}>
                  <HomeIcon
                    className={classes.iconNotOnFocus}
                    onClick={() => handleIndex(mainIdx + 1, "mainIdx")}
                  />
                </Grid>
              </Grid>

              {forecastData && (
                <Grid container justify="center" style={{ marginTop: 16 }}>
                  <Grid item xs={12}>
                    <Typography variant="h6" align="center" gutterBottom>
                      {field.address}
                    </Typography>
                  </Grid>

                  <Grid container justify="center" style={{ marginTop: 16 }}>
                    <Grid container justify="center">
                      <Grid item>
                        <img
                          src={weatherIcons[forecastData.daily.data[0].icon]}
                          alt="daily icon"
                          style={{ width: 40, height: 40, marginRight: 8 }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="h4" align="center">
                          {Math.round(forecastData.currently.temperature, 1)}˚
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography variant="caption" align="center">
                        {forecastData.currently.summary}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    style={{ marginTop: 16, paddingLeft: 16, paddingRight: 16 }}
                  >
                    <Grid item>
                      <Typography variant="button">NEXT 7 DAYS</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="caption">
                        {forecastData.daily.summary}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <List style={{ width: "100%" }}>
                      {forecastData.daily.data.map(day => {
                        console.log(day);
                        return (
                          <ListItem
                            key={day.time}
                            style={{
                              height: 64,
                              display: "flex",

                              // justifyContent: "space-between",
                              // alignItems: "center",
                              background: "pink"
                            }}
                          >
                            <ListItemText
                              style={{
                                textAlign: "center",
                                background: "teal"
                              }}
                              classes={{ secondary: classes.secondary }}
                              primary={format(
                                new Date(day.time) * 1000,
                                "EEE"
                              ).toUpperCase()}
                              secondary={`${Math.round(
                                day.precipProbability * 100
                              )}%`}
                            />

                            <ListItemText
                              style={{
                                textAlign: "center",
                                background: "tomato"
                              }}
                            >
                              <img
                                src={weatherIcons[day.icon]}
                                alt={day.summary}
                                style={{
                                  width: 40,
                                  height: 40
                                  // marginRight: 8,
                                }}
                              />
                            </ListItemText>

                            <ListItemText
                              style={{ textAlign: "center" }}
                              classes={{ secondary: classes.secondary }}
                              primary={`${Math.round(day.temperatureLow, 1)}˚`}
                            />

                            <ListItemText
                              style={{ textAlign: "center" }}
                              classes={{ secondary: classes.secondary }}
                              primary={`${Math.round(day.temperatureHigh, 1)}˚`}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                </Grid>
              )}
            </Grid>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(Forecast));
