import { createSlice } from "@reduxjs/toolkit";
import { CANVAS_MODES } from "../../consts/canvas.consts";

const canvasSliceInitialState = {
  canvasMode: CANVAS_MODES.dragMode,
  lines: [],
  img: {},
  scale: 0.0,
  offsetY: 0.0,
  offsetX: 0.0,
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
  },
});

export const { switchCanvasMode, addLine, editLine, setImg } =
  canvasSlice.actions;

export default canvasSlice.reducer;
