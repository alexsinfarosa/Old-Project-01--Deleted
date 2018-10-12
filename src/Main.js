import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";
import Zoom from "@material-ui/core/Zoom";

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
    const { isLanding } = this.props;
    return (
      <Zoom in={!isLanding}>
        <SwipeableViews
          enableMouseEvents
          index={this.state.index}
          onChangeIndex={idx => this.props.handleIndex(idx, "mainIdx")}
        >
          <Forecast index={this.state.index} handleIndex={this.handleIndex} />
          <Field index={this.state.index} handleIndex={this.handleIndex} />
          <FieldList
            index={this.state.index}
            handleIndex={this.handleIndex}
            navigateToLanding={this.props.navigateToLanding}
          />
        </SwipeableViews>
      </Zoom>
    );
  }
}

export default Main;
