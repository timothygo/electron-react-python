import React from "react";
import styles from "./App.module.scss";
import { HashRouter, Route, Switch } from "react-router-dom";
import routes from "../../pages/routes";

import TitleBar from "../TitleBar";
import TitleBarIcon from "../../resources/icon.png";

const App = () => {
  return (
    <div className={styles["container"]}>
      <TitleBar title="Electron React Python" icon={TitleBarIcon} />
      <div className={styles["main"]}>
        <HashRouter>
          <Switch>
            {routes.map(({ path, exact, component }) => (
              <Route
                key={path}
                path={path}
                exact={exact}
                component={component}
              />
            ))}
          </Switch>
        </HashRouter>
      </div>
    </div>
  );
};

export default App;
