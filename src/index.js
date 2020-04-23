import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

import { Provider } from "react-redux";
import store from "./redux/store";
import Loading from "./pages/Loading";

const isDev = false;
const minLoading = isDev ? 0 : 3000; //mili-seconds
const App = React.lazy(() => {
  return Promise.all([
    import("./components/App"),
    new Promise(resolve => setTimeout(resolve, minLoading))
  ]).then(([imp]) => imp);
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <React.Suspense fallback={<Loading />}>
        <App />
      </React.Suspense>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
