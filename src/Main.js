import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";

import Forecast from "./Forecast";
import Field from "./Field";
import FieldList from "./FieldList";

class Main extends Component {
  render() {
    return (
      <SwipeableViews
        enableMouseEvents
        index={1}
        onChangeIndex={(idx, idxLatest, meta) =>
          console.log(idx, idxLatest, meta)
        }
      >
        <Forecast />
        <Field />
        <FieldList />
      </SwipeableViews>
    );
  }
}

export default Main;
