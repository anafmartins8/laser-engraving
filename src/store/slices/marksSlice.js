import { createSlice } from "@reduxjs/toolkit";

const marksSliceInitialState = {
  marks: [],
  isMarking: false,
};

export const marksSlice = createSlice({
  name: "marks",
  initialState: marksSliceInitialState,
  reducers: {
    addMark: (state, action) => {
      state.marks.push(action.payload);
    },
    editMark: (state, action) => {
      const actionIndex = action.payload.index;
      return {
        ...state,
        marks: state.marks.map((mark, i) =>
          i === actionIndex ? action.payload.mark : mark
        ),
      };
    },
    deleteMark: (state, action) => {
      state.marks.splice(action.payload, 1);
    },
    resetMarks: () => marksSliceInitialState,
    toggleIsMarking: (state) => {
      state.isMarking = !state.isMarking;
    },
  },
});

export const { addMark, editMark, deleteMark, resetMarks, toggleIsMarking } =
  marksSlice.actions;

export default marksSlice.reducer;
