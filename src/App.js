import React, { Component } from "react";
import { AppProvider } from "./AppContext";

import Main from "./Main";
import Landing from "./Landing";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainIdx: 1,
      landingIdx: 0,
      isLanding: false,
      irrigationDate: new Date(),
      field: null,
      fields: [],
      handleIrrigationDate: this.handleIrrigationDate,
      handleField: this.handleField,
      addField: this.addField,
      selectField: this.selectField,
      deleteField: this.deleteField,
      handleIndex: this.handleIndex,
      navigateToMain: this.navigateToMain,
      navigateToLanding: this.navigateToLanding
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
    const { fields, isLanding } = this.state;
    return (
      <AppProvider value={this.state}>
        {fields.length === 0 || isLanding ? <Landing /> : <Main />}
      </AppProvider>
    );
  }
}

export default App;
