import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";

import counterReducer from "./reducers/counterReducer";

const store = configureStore({
  reducer: {
    counter: counterReducer
  },
  middleware: [createLogger(), ...getDefaultMiddleware()]
});

export default store;
