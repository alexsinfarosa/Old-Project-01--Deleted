import React, { Component } from "react";

import { AppProvider } from "./AppContext";

import Main from "./Main";
import Landing from "./Landing";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainIdx: 2,
      landingIdx: 0,
      isLanding: false,
      irrigationDate: new Date(),
      field: {},
      fields: [],
      handleIrrigationDate: this.handleIrrigationDate,
      handleField: this.handleField,
      addField: this.addField,
      handleIndex: this.handleIndex,
      navigateToMain: this.navigateToMain,
      navigateToLanding: this.navigateToLanding
    };
  }

  // NAVIGATION-------------------------------------------------------------
  navigateToMain = () => this.setState({ isLanding: false, landingIdx: 0 });
  navigateToLanding = () => this.setState({ isLanding: true, mainIdx: 1 });

  // HANDLING EVENTs--------------------------------------------------------
  handleIndex = (idx, comp) => this.setState({ [comp]: idx });
  handleField = field => this.setState({ field });
  handleIrrigationDate = irrigationDate => this.setState({ irrigationDate });

  // CRUD OPERATIONS--------------------------------------------------------
  addField = () => {
    const field = {
      ...this.state.field,
      irrigationDate: this.state.irrigationDate
    };
    const fields = [field, ...this.state.fields];
    this.setState({ fields, field: {}, irrigationDate: new Date() });
    this.writeToLocalstorage(fields);
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
      this.setState({ fields: params });
    }
  };

  // LIFE CYLCES--------------------------------------------------------------
  componentDidMount() {
    this.readFromLocalstorage();
  }

  render() {
    const { landingIdx, isLanding } = this.state;
    return (
      <AppProvider value={this.state}>
        {isLanding ? (
          <Landing
            landingIdx={landingIdx}
            isLanding={isLanding}
            handleIndex={this.handleIndex}
            navigateToMain={this.navigateToMain}
          />
        ) : (
          <Main />
        )}
      </AppProvider>
    );
  }
}

export default App;
