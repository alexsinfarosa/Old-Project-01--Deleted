import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import { AppConsumer } from "./AppContext";

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
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import hideVirtualKeyboard from "hide-virtual-keyboard";
import { geolocated } from "react-geolocated";

import { GOOGLEPLACES_API_KEY } from "./utils/api";
Geocode.setApiKey(GOOGLEPLACES_API_KEY);
// Enable or disable logs. Its optional.
// Geocode.enableDebug();

const styles = theme => ({
  list: {
    width: "100%"
    // maxWidth: 360,
    // backgroundColor: theme.palette.background.paper
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
    latitude: null,
    longitude: null,
    errorMessage: "",
    isGeocoding: false
  };

  handleFieldLocationChange = address => {
    this.setState({
      address,
      latitude: null,
      longitude: null,
      errorMessage: ""
    });
  };

  handleSelectAddress = address => {
    // console.log(address);
    this.setState({ isGeocoding: true, address });
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) =>
        this.setState({ latitude: lat, longitude: lng, isGeocoding: false })
      )
      .catch(error => {
        this.setState({ isGeocoding: false });
        console.error("Error", error);
      });
    hideVirtualKeyboard();
  };

  handleCloseClick = () => {
    this.setState({
      address: "",
      latitude: null,
      longitude: null,
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
        latitude: coords.latitude,
        longitude: coords.longitude
      });
    }
  };

  // Get address from latidude & longitude
  latLngToAddress = () => {
    const { latitude, longitude } = this.props.coords;
    this.setState({
      isGeocoding: true,
      latitude,
      longitude
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
    const {
      address,
      errorMessage,
      latitude,
      longitude,
      isGeocoding
    } = this.state;

    const {
      classes,
      isGeolocationAvailable,
      coords,
      isGeolocationEnabled
    } = this.props;

    return (
      <AppConsumer>
        {context => {
          const {
            navigateToMain,
            handleField,
            handleIndex,
            fields,
            landingIdx
          } = context;

          return (
            <Grid
              item
              xs={12}
              container
              direction="column"
              // justify="center"
              alignItems="center"
              style={{ padding: 32 }}
            >
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <ArrowBackIcon
                    style={{ paddingBottom: 2 }}
                    onClick={() => {
                      handleField({
                        address: "",
                        latitude: null,
                        longitude: null
                      });
                      fields.length > 0
                        ? navigateToMain(2)
                        : handleIndex(landingIdx - 1, "landingIdx");
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography component="h1" variant="h5" gutterBottom>
                    Field Location
                  </Typography>
                </Grid>
                <Grid />
              </Grid>

              <PlacesAutocomplete
                onChange={this.handleFieldLocationChange}
                value={address}
                onSelect={this.handleSelectAddress}
                onError={this.handleError}
                shouldFetchSuggestions={address.length > 2}
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
                                        suggestion.formattedSuggestion
                                          .secondaryText
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

              {(latitude && longitude) || isGeocoding ? (
                <Button
                  fullWidth={false}
                  size="large"
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  onClick={() => {
                    handleIndex(context.landingIdx + 1, "landingIdx");
                    handleField({ address, latitude, longitude });
                  }}
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
          );
        }}
      </AppConsumer>
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
