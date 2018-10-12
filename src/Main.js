import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";

import Forecast from "./Forecast";
import Field from "./Field";
import FieldList from "./FieldList";

class Main extends Component {
  state = {
    index: 1
  };

  handleIndex = index => {
    this.setState({ index });
  };

  render() {
    return (
      <SwipeableViews
        enableMouseEvents
        index={this.state.index}
        onChangeIndex={idx => this.handleIndex(idx)}
      >
        <Forecast index={this.state.index} handleIndex={this.handleIndex} />
        <Field index={this.state.index} handleIndex={this.handleIndex} />
        <FieldList
          index={this.state.index}
          handleIndex={this.handleIndex}
          navigateToLanding={this.props.navigateToLanding}
        />
      </SwipeableViews>
    );
  }
}

export default Main;
