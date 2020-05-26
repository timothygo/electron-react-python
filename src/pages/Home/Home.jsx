import React, { useEffect } from "react";
import styles from "./Home.module.scss";

import { useDispatch } from "react-redux";
import useCounterState from "../../redux/selectors/useCounterState";

const ipcRenderer = window.ipcRenderer;

const Home = () => {
  const dispatch = useDispatch();
  const counterState = useCounterState();

  useEffect(() => {
    //listen to ipcRenderer Reply
    let helloReply = (event, res) => {
      console.log(res.response);
    };
    ipcRenderer.on("hello-reply", helloReply);
    return () => {
      ipcRenderer.removeListener("hello-reply", helloReply);
    };
  });

  return (
    <div>
      <h1>Counter: {counterState.count}</h1>
      <div>
        <button onClick={() => dispatch(counterState.actions.increment())}>
          Increment
        </button>
        <button onClick={() => dispatch(counterState.actions.decrement())}>
          Decrement
        </button>
        <button
          onClick={() => dispatch(counterState.actions.delayedIncrement())}
        >
          Delayed Increment
        </button>
        <button onClick={() => ipcRenderer.send("pythonFunc", [])}>
          Python Function
        </button>
        <button onClick={() => ipcRenderer.send("normalFunc", [])}>
          Electron
        </button>
      </div>
    </div>
  );
};

export default Home;
