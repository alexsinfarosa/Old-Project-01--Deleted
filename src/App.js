import React, { Component } from "react";
import Main from "./Main";
import Landing from "./Landing";

class App extends Component {
  state = {
    mainIdx: 1,
    landingIdx: 0,
    fields: [],
    isLanding: false
  };

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
    );
  }
}

export default App;
