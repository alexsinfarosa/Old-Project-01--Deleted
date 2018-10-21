import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";

import { AppConsumer } from "./AppContext";

import Forecast from "./Forecast";
import Field from "./Field";
import FieldList from "./FieldList";

class Main extends Component {
  render() {
    return (
      <AppConsumer>
        {context => {
          const { handleIndex, mainIdx } = context;
          return (
            <SwipeableViews
              index={mainIdx}
              onChangeIndex={idx => handleIndex(idx, "mainIdx")}
              containerStyle={{ height: window.innerHeight }}
              slideStyle={{ height: "100%", background: "#fff" }}
            >
              <Forecast />
              <Field />
              <FieldList />
            </SwipeableViews>
          );
        }}
      </AppConsumer>
    );
  }
}

export default Main;
