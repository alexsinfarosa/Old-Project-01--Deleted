import React, { Component } from "react";
import { AppProvider } from "./AppContext";

import axios from "axios";
import { WEATHER_API_KEY } from "./utils/api";

import Main from "./Main";
import Landing from "./Landing";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainIdx: 0,
      landingIdx: 0,
      isLanding: false,
      irrigationDate: new Date(),
      fields: [],
      field: null,
      handleIrrigationDate: this.handleIrrigationDate,
      handleField: this.handleField,
      addField: this.addField,
      selectField: this.selectField,
      deleteField: this.deleteField,
      handleIndex: this.handleIndex,
      navigateToMain: this.navigateToMain,
      navigateToLanding: this.navigateToLanding,
      forecastData: null,
      fetchForecastData: this.fetchForecastData
    };
  }

  // NAVIGATION-------------------------------------------------------------
  navigateToMain = mainIdx =>
    this.setState({ landingIdx: 1, mainIdx, isLanding: false });
  navigateToLanding = () =>
    this.setState({ mainIdx: 1, isLanding: true, landingIdx: 1 });

  // HANDLING EVENTs--------------------------------------------------------
  handleIndex = (idx, comp) => this.setState({ [comp]: idx });
  handleField = field => this.setState({ field });
  handleIrrigationDate = irrigationDate => this.setState({ irrigationDate });

  // CRUD OPERATIONS--------------------------------------------------------
  addField = () => {
    const field = {
      ...this.state.field,
      irrigationDate: this.state.irrigationDate,
      id: Date.now()
    };
    const fields = [field, ...this.state.fields];
    this.setState({ fields, field: null, irrigationDate: new Date() });
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
    this.writeToLocalstorage(fields);
  };

  selectField = id => {
    const field = this.state.fields.find(field => field.id === id);
    this.setState({ field });
  };

  fetchForecastData = () => {
    const url = `https://api.darksky.net/forecast/${WEATHER_API_KEY}/42.4439614,-76.5018807?exclude=flags,minutely,alerts,hourly`;
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
        this.setState({ forecastData });
      })
      .catch(err => {
        console.log("Failed to load forecast weather data", err);
      });
  };

  // LOCALSTORAGE------------------------------------------------------------
  writeToLocalstorage = fields => {
    localStorage.setItem("nrcc-irrigation-tool", JSON.stringify(fields));
  };

  readFromLocalstorage = () => {
    const localStorageRef = localStorage.getItem("nrcc-irrigation-tool");
    // console.log(localStorageRef);
    if (localStorageRef) {
      const params = JSON.parse(localStorageRef);
      this.setState({ fields: params, field: params[0] });
    }
  };

  // LIFE CYLCES--------------------------------------------------------------
  componentDidMount() {
    this.readFromLocalstorage();
    this.fetchForecastData();
  }

  render() {
    const { fields, isLanding } = this.state;
    return (
      <AppProvider value={this.state}>
        {fields.length === 0 || isLanding ? <Landing /> : <Main />}
      </AppProvider>
    );
  }
}

export default App;
