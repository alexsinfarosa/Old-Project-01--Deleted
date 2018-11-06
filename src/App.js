import React, { Component } from "react";
import { AppProvider } from "./AppContext";

import axios from "axios";
import { PROXYDARKSKY } from "./utils/api";

import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";

import Main from "./Main";
import Landing from "./Landing";

import differenceInHours from "date-fns/differenceInHours";
import { getPET, runWaterDeficitModel } from "./utils/utils";
import AdjustDeficit from "./AdjustDeficit";

// import format from "date-fns/format";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      mainIdx: 1,
      landingIdx: 0,
      isLanding: false,
      displayDeficitScreen: false,
      deficitAdjustment: null,
      today: "07/07/2018", // Testing...

      id: null,
      soilCapacity: "medium",
      cropType: "grass",
      fieldName: "",
      address: "",
      latitude: null,
      longitude: null,
      irrigationDate: new Date(),
      dataModel: [],
      forecastData: null,
      fields: [],

      handleIrrigationDate: this.handleIrrigationDate,
      handleField: this.handleField,
      addField: this.addField,
      selectField: this.selectField,
      deleteField: this.deleteField,
      handleIndex: this.handleIndex,
      navigateToMain: this.navigateToMain,
      navigateToLanding: this.navigateToLanding,
      fetchForecastData: this.fetchForecastData,
      setDisplayDeficitScreen: this.setDisplayDeficitScreen,
      resetWaterDeficit: this.resetWaterDeficit,
      setDeficitAdjustment: this.setDeficitAdjustment
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
  setDisplayDeficitScreen = d => this.setState({ displayDeficitScreen: d });
  setDeficitAdjustment = d =>
    this.setState({ deficitAdjustment: d }, () => {
      this.resetWaterDeficit();
      this.setDisplayDeficitScreen(false);
    });

  // CRUD OPERATIONS--------------------------------------------------------
  addField = async () => {
    this.setState({ isLoading: true });
    // await this.fetchForecastData(this.state.latitude, this.state.longitude);
    const dataModel = await getPET(
      this.state.irrigationDate,
      this.state.latitude,
      this.state.longitude,
      this.state.soilCapacity,
      0
    );
    const field = {
      id: Date.now(),
      fieldName: this.state.address.split(",")[0],
      soilCapacity: this.state.soilCapacity,
      cropType: this.state.cropType,
      address: this.state.address,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      irrigationDate: this.state.irrigationDate,
      forecastData: this.state.forecastData,
      dataModel: dataModel
    };
    const fields = [field, ...this.state.fields];
    this.setState({ dataModel, fields, isLoading: false });
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

  resetWaterDeficit = () => {
    const irrigationDate = this.state.today;
    const copyFields = [...this.state.fields];
    const field = copyFields.find(field => field.id === this.state.id);
    field.irrigationDate = irrigationDate;

    const dataModel = [...this.state.dataModel];
    const irrigationDateIdx = dataModel.findIndex(
      obj => obj.date === irrigationDate
    );
    // console.log(irrigationDateIdx);
    // console.log(dataModel.slice(irrigationDateIdx));

    const data = dataModel.slice(irrigationDateIdx);
    const pcpns = data.map(d => d.pcp);
    const pets = data.map(d => d.pet);
    pets[0] += this.state.deficitAdjustment;

    // console.log(pets);

    const temp = runWaterDeficitModel(pcpns, pets, 0, this.state.soilCapacity);
    const results = temp.deficitDaily.map((val, i) => {
      let p = {};
      p.date = data[i].date;
      p.deficit = +val.toFixed(2);
      p.pet = pets[i];
      p.pcp = pcpns[i];
      return p;
    });

    // console.log(results);
    this.setState({ irrigationDate, dataModel: results });
  };

  selectField = id => {
    this.setState({ isLoading: true });
    const field = this.state.fields.find(field => field.id === id);
    this.setState({
      id: field.id,
      fieldName: field.fieldName,
      soilCapacity: field.soilCapacity,
      cropType: field.cropType,
      address: field.address,
      latitude: field.latitude,
      longitude: field.longitude,
      irrigationDate: new Date(field.irrigationDate),
      forecastData: field.forecastData,
      dataModel: field.dataModel
    });
    // console.log(field);
    const countHrs = differenceInHours(new Date(), new Date(field.id));

    if (countHrs > 3) {
      console.log("more than 3 hours...");
      this.reloadPETAndForecastData();
    }
    this.setState({ isLoading: false });
  };

  reloadPETAndForecastData = async () => {
    const dataModel = await getPET(
      this.state.irrigationDate,
      this.state.latitude,
      this.state.longitude,
      this.state.soilCapacity,
      0
    );

    const forecastData = await this.fetchForecastData(
      this.state.latitude,
      this.state.longitude
    );

    const idx = this.state.fields.findIndex(
      field => field.id === this.state.id
    );

    const id = Date.now();
    this.setState({ dataModel, forecastData, id });

    const copyFields = [...this.state.fields];

    copyFields[idx].id = id;
    copyFields[idx].dataModel = dataModel;
    copyFields[idx].forecastData = forecastData;

    this.writeToLocalstorage(copyFields);
  };

  fetchForecastData = (latitude, longitude) => {
    console.log("fetchForecastData called");
    // this.setState({ isLoading: true });
    const url = `${PROXYDARKSKY}/${latitude},${longitude}?exclude=flags,minutely,alerts,hourly`;
    return axios
      .get(url)
      .then(res => {
        // console.log(res.data);
        const { currently, daily } = res.data;
        const forecastData = { currently, daily };
        this.setState({ forecastData });
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
      // console.log(params);
      const field = {
        id: params[0].id,
        fieldName: params[0].fieldName,
        soilCapacity: params[0].soilCapacity,
        cropType: params[0].cropType,
        address: params[0].address,
        latitude: params[0].latitude,
        longitude: params[0].longitude,
        irrigationDate: new Date(params[0].irrigationDate),
        forecastData: params[0].forecastData,
        dataModel: params[0].dataModel
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
        if (countHrs > 3) {
          console.log("DidMount - more than 3 hours...");
          this.reloadPETAndForecastData();
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
            <CircularProgress style={{ color: "#843EA4" }} />
          </div>
        ) : fields.length === 0 || isLanding ? (
          <Landing />
        ) : this.state.displayDeficitScreen ? (
          <Fade in={this.state.displayDeficitScreen}>
            <AdjustDeficit dataModel={this.state.dataModel} />
          </Fade>
        ) : (
          <Main />
        )}
      </AppProvider>
    );
  }
}

export default App;
