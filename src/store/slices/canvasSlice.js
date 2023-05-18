import { createSlice } from "@reduxjs/toolkit";
import { CANVAS_MODES } from "../../consts/canvas.consts";
import { DEFAULT_IMAGE } from "../../consts/image.consts";

const canvasSliceInitialState = {
  canvasMode: CANVAS_MODES.dragMode,
  img: DEFAULT_IMAGE,
  lines: [],
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
    addLine: (state, action) => {
      state.lines.push(action.payload);
    },
    editLine: (state, action) => {
      const actionIndex = action.payload.index;
      return {
        ...state,
        lines: state.lines.map((line, i) =>
          i === actionIndex ? action.payload.line : line
        ),
      };
    },
    deleteLine: (state, action) => {
      state.lines.splice(action.payload, 1);
    },
  },
});

export const { switchCanvasMode, setImg, addLine, editLine, deleteLine } =
  canvasSlice.actions;

export default canvasSlice.reducer;
