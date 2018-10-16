import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

import Geocode from "react-geocode";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from "@material-ui/icons/Clear";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import hideVirtualKeyboard from "hide-virtual-keyboard";
import { geolocated } from "react-geolocated";

import { GOOGLEPLACES_API_KEY } from "./utils/api";
Geocode.setApiKey(GOOGLEPLACES_API_KEY);
// Enable or disable logs. Its optional.
// Geocode.enableDebug();

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
  list: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  button: {
    marginTop: theme.spacing.unit * 8,
    height: theme.spacing.unit * 8
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

class FieldLocation extends Component {
  state = {
    address: "",
    lat: null,
    lng: null,
    errorMessage: "",
    isGeocoding: false
  };

  handleChange = address => {
    this.setState({
      address,
      lat: null,
      lng: null,
      errorMessage: ""
    });
  };

  handleSelect = address => {
    // console.log(address);
    this.setState({ isGeocoding: true, address });
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => this.setState({ lat, lng, isGeocoding: false }))
      .catch(error => {
        this.setState({ isGeocoding: false });
        console.error("Error", error);
      });
    hideVirtualKeyboard();
  };

  handleCloseClick = () => {
    this.setState({
      address: "",
      lat: null,
      lng: null,
      errorMessage: "",
      isGeocoding: false
    });
  };

  handleError = (status, clearSuggestions) => {
    // console.log("Error from Google Maps API", status);
    this.setState({ errorMessage: status }, () => {
      clearSuggestions();
    });
  };

  // Get latitude and longitude
  currentLocation = () => {
    const { coords } = this.props;
    if (coords) {
      this.setState({
        lat: coords.latitude,
        lng: coords.longitude
      });
    }
  };

  // Get address from latidude & longitude
  latLngToAddress = () => {
    const { latitude, longitude } = this.props.coords;
    this.setState({
      isGeocoding: true,
      lat: latitude,
      lng: longitude
    });
    Geocode.fromLatLng(`${latitude}`, `${longitude}`).then(
      response => {
        const address = response.results[0].formatted_address;
        this.setState({ isGeocoding: false, address });
      },
      error => {
        this.setState({ isGeocoding: false });
        console.error(error);
      }
    );
  };

  render() {
    const { address, errorMessage, lat, lng, isGeocoding } = this.state;
    const {
      classes,
      landingIdx,
      handleIndex,
      isGeolocationAvailable,
      coords,
      isGeolocationEnabled
    } = this.props;

    return (
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
          <Typography component="h1" variant="h5" gutterBottom>
            Field Location
          </Typography>

          <PlacesAutocomplete
            onChange={this.handleChange}
            value={address}
            onSelect={this.handleSelect}
            onError={this.handleError}
            shouldFetchSuggestions={address.length > 3}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => {
              return (
                <div style={{ width: "100%" }}>
                  <TextField
                    {...getInputProps({
                      id: "outlined-select-address-native",
                      label: "Search",
                      fullWidth: true,
                      SelectProps: {
                        native: true
                      },
                      InputProps: {
                        endAdornment: (
                          <InputAdornment variant="outlined" position="end">
                            <IconButton
                              aria-label="Clear address field"
                              onClick={this.handleCloseClick}
                            >
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      },
                      disabled: false,
                      error: errorMessage ? true : false,
                      helperText: errorMessage ? "Invalid Address" : "",
                      margin: "normal"

                      // variant: "outlined" // BUG...
                    })}
                  />

                  <div className={classes.list}>
                    {suggestions.length > 0 && (
                      <List component="nav">
                        {suggestions.map((suggestion, i) => {
                          return (
                            <div key={i}>
                              <ListItem
                                style={{ paddingLeft: 0 }}
                                button
                                {...getSuggestionItemProps(suggestion)}
                              >
                                <ListItemText
                                  primary={
                                    suggestion.formattedSuggestion.mainText
                                  }
                                  secondary={
                                    suggestion.formattedSuggestion.secondaryText
                                  }
                                />
                              </ListItem>
                              <Divider />
                            </div>
                          );
                        })}
                      </List>
                    )}
                  </div>
                </div>
              );
            }}
          </PlacesAutocomplete>

          {!isGeolocationAvailable &&
            !isGeolocationEnabled && (
              <Typography variant="caption" align="center">
                Geolocation is not supported!
              </Typography>
            )}

          {(lat && lng) || isGeocoding ? (
            <Button
              fullWidth={false}
              size="large"
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={() => handleIndex(landingIdx + 1, "landingIdx")}
            >
              Irrigation Date
            </Button>
          ) : (
            isGeolocationAvailable &&
            isGeolocationEnabled &&
            !address && (
              <Button
                fullWidth={false}
                size="large"
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={this.latLngToAddress}
                disabled={coords ? false : true}
              >
                {coords ? `Current Location` : `Loading...`}
              </Button>
            )
          )}
        </Grid>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(
    geolocated({
      positionOptions: { enableHighAccuracy: false },
      userDecisionTimeout: 5000,
      suppressLocationOnMount: false
    })(FieldLocation)
  )
);
