import React, { Component } from "react";

import { AppProvider } from "./AppContext";

import Main from "./Main";
import Landing from "./Landing";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainIdx: 1,
      landingIdx: 2,
      fields: [],
      isLanding: true,
      handleIndex: this.handleIndex,
      navigateToMain: this.navigateToMain,
      navigateToLanding: this.navigateToLanding,
      getFields: this.getFields
    };
  }

  handleIndex = (idx, comp) => {
    this.setState({ [comp]: idx });
  };

  navigateToMain = () => {
    this.setState({ isLanding: false, landingIdx: 0 });
  };

  navigateToLanding = () => {
    this.setState({ isLanding: true, mainIdx: 1 });
  };

  render() {
    const { mainIdx, landingIdx, isLanding } = this.state;
    return (
      <AppProvider value={this.state}>
        <div style={{ background: "#fff" }}>
          {!isLanding && (
            <Main
              mainIdx={mainIdx}
              isLanding={isLanding}
              handleIndex={this.handleIndex}
              navigateToLanding={this.navigateToLanding}
            />
          )}
          {isLanding && (
            <Landing
              landingIdx={landingIdx}
              isLanding={isLanding}
              handleIndex={this.handleIndex}
              navigateToMain={this.navigateToMain}
            />
          )}
        </div>
      </AppProvider>
    );
  }
}

export default App;
