import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import * as counterActions from "../reducers/counterReducer";

const useCounterState = () => {
  const count = useSelector(state => state.counter.count);
  return { count, actions: counterActions };
};

export default useCounterState;
