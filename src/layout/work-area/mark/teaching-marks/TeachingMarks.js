import React from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { CANVAS_MODES } from "../../../../consts/canvas.consts";
import { switchCanvasMode } from "../../../../store/slices/canvasSlice";
import { deleteMark } from "../../../../store/slices/marksSlice";
import "./TeachingMarks.css";

function TeachingMarks() {
  const { marks } = useSelector((state) => state.marks);
  const { canvasMode } = useSelector((state) => state.canvas);
  const dispatch = useDispatch();

  const onDeleteMark = (markId) => {
    dispatch(deleteMark(markId));
  };

  const onAddMarkClick = () => {
    const newCanvasMode =
      canvasMode === CANVAS_MODES.markMode
        ? CANVAS_MODES.dragMode
        : CANVAS_MODES.markMode;
    dispatch(switchCanvasMode(newCanvasMode));
  };

  const isAddingMark = canvasMode === CANVAS_MODES.markMode;

  return (
    <React.Fragment>
      <div className="teaching-marks-container">
        <div className="left-component">
          <button
            title="Add Mark"
            className={`add-mark-button${
              isAddingMark ? " add-mark-button-selected" : ""
            }`}
            onClick={onAddMarkClick}
          >
            {isAddingMark ? "Adding Mark" : "Add Mark"}
          </button>
        </div>
        <div className="right-component">
          <table>
            <thead>
              <tr>
                <th className="centered">Point Number</th>
                <th className="centered">Window</th>
                <th className="centered">Mark Point</th>
                <th className="centered"></th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark, index) => (
                <tr>
                  <td className="centered">{index + 1}</td>
                  <td className="centered">(wX, wY)</td>
                  <td className="centered">{`(${mark.x}, ${mark.y})`}</td>
                  <td className="centered">
                    {" "}
                    <BsFillTrashFill onClick={() => onDeleteMark(index)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
}

export default TeachingMarks;
