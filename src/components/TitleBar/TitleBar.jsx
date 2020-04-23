import React, { useState, useEffect } from "react";
import styles from "./TitleBar.module.scss";

const remote = window.require("electron").remote;
const win = remote.getCurrentWindow();

const TitleBar = ({ height = 30, title, icon, dropShadow = false }) => {
  const [isMaximized, setMaximized] = useState(win.isMaximized());

  useEffect(() => {
    document.getElementById("min-button").addEventListener("click", event => {
      win.minimize();
    });

    document.getElementById("close-button").addEventListener("click", event => {
      win.close();
    });

    if (win.resizable) {
      document.getElementById("max-button").addEventListener("click", event => {
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      });
    }

    win.on("maximize", () => setMaximized(true));
    win.on("unmaximize", () => setMaximized(false));

    return () => {
      win.removeAllListeners();
    };
  }, []);

  return (
    <div
      style={{
        height: height,
        boxShadow: dropShadow ? "0 0 6px 4px rgba(0,0,0,0.2)" : "none"
      }}
      className={styles["titlebar"]}
    >
      <div
        className={`${styles["drag-region"]} ${
          !isMaximized ? styles["drag-region--unmaximized"] : ""
        }`}
      >
        <div className={styles["icon-title"]}>
          <img style={{ height: height * 0.65 }} src={icon} />
          <span>{title}</span>
        </div>
        <div className={styles["window-controls"]}>
          <div
            id="min-button"
            className={`${styles["window-control-button"]} ${styles["min-button"]}`}
          />
          {win.resizable && (
            <div
              id="max-button"
              className={`${styles["window-control-button"]} ${
                isMaximized ? styles["restore-button"] : styles["max-button"]
              }`}
            />
          )}
          <div
            id="close-button"
            className={`${styles["window-control-button"]} ${styles["close-button"]}`}
          />
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
