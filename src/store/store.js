import { configureStore } from "@reduxjs/toolkit";
import marksReducer from "./slices/marksSlice";
import canvasReducer from "./slices/canvasSlice";

export default configureStore({
  reducer: {
    marks: marksReducer,
    canvas: canvasReducer,
  },
});
