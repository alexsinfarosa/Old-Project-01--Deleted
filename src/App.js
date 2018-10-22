import React, { Component } from "react";
import { AppProvider } from "./AppContext";

import axios from "axios";
import { WEATHER_API_KEY } from "./utils/api";

import CircularProgress from "@material-ui/core/CircularProgress";

import Main from "./Main";
import Landing from "./Landing";

import differenceInHours from "date-fns/differenceInHours";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      mainIdx: 1,
      landingIdx: 0,
      isLanding: false,

      id: null,
      fieldName: "",
      address: "",
      latitude: null,
      longitude: null,
      irrigationDate: new Date(),

      fields: [],

      handleIrrigationDate: this.handleIrrigationDate,
      handleField: this.handleField,
      addField: this.addField,
      selectField: this.selectField,
      deleteField: this.deleteField,
      handleIndex: this.handleIndex,
      navigateToMain: this.navigateToMain,
      navigateToLanding: this.navigateToLanding,
      forecastData: [],
      fetchForecastData: this.fetchForecastData
    };
  }

  // NAVIGATION-------------------------------------------------------------
  navigateToMain = mainIdx => this.setState({ mainIdx, isLanding: false });
  navigateToLanding = () =>
    this.setState({ mainIdx: 1, isLanding: true, landingIdx: 1 });

  // HANDLING EVENTs--------------------------------------------------------
  handleIndex = (idx, comp) => this.setState({ [comp]: idx });
  handleField = ({ ...field }) => this.setState({ ...field });
  handleIrrigationDate = irrigationDate => this.setState({ irrigationDate });

  // CRUD OPERATIONS--------------------------------------------------------
  addField = async () => {
    await this.fetchForecastData(this.state.latitude, this.state.longitude);
    const field = {
      id: Date.now(),
      fieldName: this.state.fieldName,
      address: this.state.address,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      irrigationDate: this.state.irrigationDate,
      forecastData: this.state.forecastData
    };
    const fields = [field, ...this.state.fields];
    this.setState({ fields });
    this.writeToLocalstorage(fields);
  };

  deleteField = id => {
    const copyFields = [...this.state.fields];
    const fields = copyFields.filter(field => field.id !== id);

    this.setState({
      fields,
      isLanding: fields.length === 0 ? true : false,
      landingIdx: 0
    });

    fields.length === 0
      ? this.deleteFromLocalstorage()
      : this.writeToLocalstorage(fields);
  };

  selectField = id => {
    const field = this.state.fields.find(field => field.id === id);
    this.setState({
      id: field.id,
      fieldName: field.fieldName,
      address: field.address,
      latitude: field.latitude,
      longitude: field.longitude,
      irrigationDate: field.irrigationDate,
      forecastData: field.forecastData
    });

    const countHrs = differenceInHours(new Date(), new Date(field.id));
    if (countHrs > 1) {
      this.fetchForecastData(field.latitude, field.longitude);
      const idx = this.state.fields.findIndex(field => field.id === id);
      const copyFields = [...this.state.fields];
      copyFields[idx].forecastData = this.state.forecastData;
      this.writeToLocalstorage(copyFields);
    }
  };

  fetchForecastData = (latitude, longitude) => {
    console.log("fetchForecastData called");
    this.setState({ isLoading: true });
    const url = `/${WEATHER_API_KEY}/${latitude},${longitude}?exclude=flags,minutely,alerts,hourly`;
    return axios
      .get(url)
      .then(res => {
        // console.log(res.data);
        const { currently, daily, latitude, longitude } = res.data;
        const forecastData = {
          currently,
          daily,
          latitude,
          longitude
        };
        this.setState({ forecastData, isLoading: false });
      })
      .catch(err => {
        console.log("Failed to load forecast weather data", err);
        this.setState({ isLoading: false });
      });
  };

  // LOCALSTORAGE------------------------------------------------------------
  writeToLocalstorage = fields => {
    console.log("writeToLocalstorage");
    localStorage.setItem("nrcc-irrigation-tool", JSON.stringify(fields));
  };

  readFromLocalstorage = () => {
    const localStorageRef = localStorage.getItem("nrcc-irrigation-tool");
    // console.log(localStorageRef);
    if (localStorageRef) {
      const params = JSON.parse(localStorageRef);
      const field = {
        id: params[0].id,
        fieldName: params[0].fieldName,
        address: params[0].address,
        latitude: params[0].latitude,
        longitude: params[0].longitude,
        irrigationDate: new Date(params[0].irrigationDate),
        forecastData: params[0].forecastData
      };

      this.setState({ fields: params, ...field });
    }
  };

  deleteFromLocalstorage = () => {
    localStorage.removeItem("nrcc-irrigation-tool");
  };

  // LIFE CYLCES--------------------------------------------------------------
  async componentDidMount() {
    this.setState({ isLoading: true });
    try {
      await this.readFromLocalstorage();

      if (this.state.fields.length !== 0) {
        const countHrs = differenceInHours(new Date(), new Date(this.state.id));
        if (countHrs > 1) {
          this.fetchForecastData(this.state.latitude, this.state.longitude);
          const idx = this.state.fields.findIndex(
            field => field.id === this.state.id
          );
          const copyFields = [...this.state.fields];
          copyFields[idx].forecastData = this.state.forecastData;
          this.writeToLocalstorage(copyFields);
        }
      }
      this.setState({ isLoading: false });
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { fields, isLanding } = this.state;
    return (
      <AppProvider value={this.state}>
        {this.state.isLoading ? (
          <div
            style={{
              height: window.innerHeight,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <CircularProgress />
          </div>
        ) : fields.length === 0 || isLanding ? (
          <Landing />
        ) : (
          <Main />
        )}
      </AppProvider>
    );
  }
}

export default App;
