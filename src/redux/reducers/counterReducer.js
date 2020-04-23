import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  count: 0
};

const delayedIncrement = createAsyncThunk(
  "counter/delayedIncrement",
  async (arg, thunkAPI) => {
    return await new Promise(resolve =>
      setTimeout(() => resolve("async works"), 2000)
    );
  }
);

const reducers = {
  increment: (state, action) => {
    state.count++;
  },
  decrement: {
    reducer: (state, action) => {
      state.count--;
    },
    prepare: payload => {
      return { payload };
    }
  }
};

const counterReducer = createSlice({
  name: "counter",
  initialState: initialState,
  reducers: reducers,
  extraReducers: {
    [delayedIncrement.pending]: (state, action) => {
      console.log("pending");
    },
    [delayedIncrement.fulfilled]: (state, action) => {
      state.count++;
      console.log("fulfilled");
      console.log(action.payload);
    }
  }
});

export { delayedIncrement };
export const { increment, decrement } = counterReducer.actions;
export default counterReducer.reducer;
