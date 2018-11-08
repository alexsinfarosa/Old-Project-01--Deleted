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

import format from "date-fns/format";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      mainIdx: 1,
      landingIdx: 0,
      isLanding: false,
      displayDeficitScreen: false,
      deficitAdjustment: [],
      today: "",
      todayIdx: 0,

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
  setDeficitAdjustment = d => {
    const deficitAdjustment = [...this.state.deficitAdjustment];
    deficitAdjustment.push(d);
    this.setState({ deficitAdjustment }, () => {
      this.resetWaterDeficit();
      this.setDisplayDeficitScreen(false);
    });
  };

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

    const todayIdx = dataModel.findIndex(obj => obj.date === this.state.today);
    const id = Date.now();

    const field = {
      id,
      fieldName: this.state.fieldName,
      soilCapacity: this.state.soilCapacity,
      cropType: this.state.cropType,
      address: this.state.address,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      irrigationDate: this.state.irrigationDate,
      forecastData: this.state.forecastData,
      dataModel: dataModel,
      deficitAdjustment: []
    };

    const fields = [field, ...this.state.fields];
    this.setState({ id, todayIdx, dataModel, fields, isLoading: false });
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
    const dataModel = [...this.state.dataModel];
    console.log(dataModel);
    const pcpns = dataModel.map(d => d.pcp);
    const pets = dataModel.map(d => d.pet);

    const recalculateDeficit = runWaterDeficitModel(
      pcpns,
      pets,
      0,
      this.state.soilCapacity,
      this.state.deficitAdjustment,
      this.state.todayIdx
    );

    const results = recalculateDeficit.deficitDaily.map((val, i) => {
      let p = {};
      p.date = dataModel[i].date;
      p.deficit = +val.toFixed(2);
      p.pet = pets[i];
      p.pcp = pcpns[i];
      return p;
    });

    this.setState({ dataModel: results });

    const fields = [...this.state.fields];
    const idx = fields.findIndex(field => field.id === this.state.id);

    const id = Date.now();
    const irrigationDate = new Date(id);

    fields[idx].id = id;
    fields[idx].irrigationDate = irrigationDate;
    fields[idx].dataModel = results;
    fields[idx].deficitAdjustment = this.state.deficitAdjustment;

    this.setState({
      id,
      irrigationDate,
      fields
    });

    this.writeToLocalstorage(fields);
  };

  selectField = id => {
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
      dataModel: field.dataModel,
      deficitAdjustment: field.deficitAdjustment
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
    console.log("reloadPETForecastData");
    this.setState({ isLoading: true });
    const dataModel = await getPET(
      this.state.irrigationDate,
      this.state.latitude,
      this.state.longitude,
      this.state.soilCapacity,
      0
    );

    const copyFields = [...this.state.fields];
    const idx = this.state.fields.findIndex(
      field => field.id === this.state.id
    );

    const id = Date.now();
    copyFields[idx].id = id;
    copyFields[idx].dataModel = dataModel;
    await this.fetchForecastData(this.state.latitude, this.state.longitude);
    copyFields[idx].forecastData = this.state.forecastData;

    this.setState({ id, dataModel });
    this.writeToLocalstorage(copyFields);
    this.setState({ isLoading: false });
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
    console.log("readFromLocalStorage");
    const localStorageRef = localStorage.getItem("nrcc-irrigation-tool");
    // console.log(localStorageRef);
    if (localStorageRef) {
      console.log("setting values from localstorage");
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
        dataModel: params[0].dataModel,
        deficitAdjustment: params[0].deficitAdjustment
      };
      this.setState({ fields: params, ...field });
    }
  };

  deleteFromLocalstorage = () => {
    localStorage.removeItem("nrcc-irrigation-tool");
  };

  // LIFE CYLCES--------------------------------------------------------------
  async componentDidMount() {
    try {
      const today = format(new Date("07/07/2018"), "MM/dd/YYYY");
      this.setState({ today, isLoading: true });
      await this.readFromLocalstorage();
      if (this.state.fields.length !== 0) {
        // set up initial variables into state
        const todayIdx = this.state.dataModel.findIndex(
          obj => obj.date === today
        );

        this.setState({ todayIdx });

        // Reloading data if more than 3 hours
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
