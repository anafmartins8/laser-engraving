import { createSlice } from "@reduxjs/toolkit";

const marksSliceInitialState = {
  marks: [],
};

export const marksSlice = createSlice({
  name: "marks",
  initialState: marksSliceInitialState,
  reducers: {
    addMark: (state, action) => {
      state.marks.push(action.payload);
    },
    deleteMark: (state, action) => {
      state.marks.splice(action.payload, 1);
    },
    resetMarks: (state) => {
      state = marksSliceInitialState;
    },
  },
});

export const { addMark, deleteMark } = marksSlice.actions;

export default marksSlice.reducer;
