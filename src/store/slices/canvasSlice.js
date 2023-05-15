import { createSlice } from "@reduxjs/toolkit";
import { CANVAS_MODES } from "../../consts/canvas.consts";
import { DEFAULT_IMAGE } from "../../consts/image.consts";

const canvasSliceInitialState = {
  canvasMode: CANVAS_MODES.dragMode,
  img: DEFAULT_IMAGE,
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState: canvasSliceInitialState,
  reducers: {
    switchCanvasMode: (state, action) => {
      state.canvasMode = action.payload;
    },
    setImg: (state, action) => {
      return {
        ...state,
        img: action.payload,
      };
    },
  },
});

export const { switchCanvasMode, setImg } = canvasSlice.actions;

export default canvasSlice.reducer;
