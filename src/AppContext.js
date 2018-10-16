import React from "react";

const AppContext = React.createContext({
  mainIdx: 1,
  landingIdx: 2,
  fields: [],
  isLanding: true,
  handleFields() {}
});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;
