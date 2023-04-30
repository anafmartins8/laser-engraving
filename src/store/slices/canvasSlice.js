import { createSlice } from "@reduxjs/toolkit";
import { CANVAS_MODES } from "../../consts/canvas.consts";

const canvasSliceInitialState = {
  canvasMode: CANVAS_MODES.dragMode,
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState: canvasSliceInitialState,
  reducers: {
    switchCanvasMode: (state, action) => {
      state.canvasMode = action.payload;
    },
  },
});

export const { switchCanvasMode } = canvasSlice.actions;

export default canvasSlice.reducer;
