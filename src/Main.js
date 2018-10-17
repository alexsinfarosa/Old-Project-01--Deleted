import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";
import Zoom from "@material-ui/core/Zoom";

import { AppConsumer } from "./AppContext";

import Forecast from "./Forecast";
import Field from "./Field";
import FieldList from "./FieldList";

class Main extends Component {
  render() {
    return (
      <AppConsumer>
        {context => {
          const { handleIndex, isLanding, mainIdx } = context;
          return (
            <Zoom in={!isLanding}>
              <SwipeableViews
                enableMouseEvents
                index={mainIdx}
                onChangeIndex={idx => handleIndex(idx, "mainIdx")}
              >
                <Forecast />
                <Field />
                <FieldList />
              </SwipeableViews>
            </Zoom>
          );
        }}
      </AppConsumer>
    );
  }
}

export default Main;
