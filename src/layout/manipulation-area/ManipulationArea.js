import { RiZoomInLine } from "react-icons/ri";
import { RiZoomOutLine } from "react-icons/ri";
import { MdOutlineLoop } from "react-icons/md"; //MdCached
import { FaVectorSquare } from "react-icons/fa";
import { TbArrowRightSquare } from "react-icons/tb"; //BsBoundingBoxCircles BsBoundingBox
import { useSelector, useDispatch } from "react-redux";
import { CANVAS_MODES } from "../../consts/canvas.consts";
import { resetCanvas, switchCanvasMode } from "../../store/slices/canvasSlice";
import "./ManipulationArea.css";
import { toggleIsMarking } from "../../store/slices/marksSlice";
import { resetMarks } from "../../store/slices/marksSlice";

function ManipulationArea() {
  const { canvasMode } = useSelector((state) => state.canvas);
  const { isMarking } = useSelector((state) => state.marks);
  const dispatch = useDispatch();

  const onAddMarkClick = () => {
    dispatch(toggleIsMarking());
  };

  const handleResetStore = () => {
    dispatch(resetCanvas());
    dispatch(resetMarks());
  };

  const isInLineMode = canvasMode === CANVAS_MODES.roiMode;

  return (
    <div className="zoom-container">
      <div>
        <button
          type="button"
          className="button-info"
          onClick={handleResetStore}
        >
          <MdOutlineLoop title="Image reset" />
        </button>
      </div>
      <div>
        <button type="button" className="button-info">
          <RiZoomInLine title="Zoom in" />
        </button>
      </div>
      <div>
        <button type="button" className="button-info">
          <RiZoomOutLine title="Zoom out" />
        </button>
      </div>
      {isInLineMode && (
        <div>
          <button
            type="button"
            className={`button-info square-icon${
              isInLineMode ? " button-info-selected" : ""
            }`}
          >
            <TbArrowRightSquare title="Draw lines" />
          </button>
        </div>
      )}
      {!isInLineMode && (
        <div>
          <button
            type="button"
            className={`button-info square-icon${
              isMarking ? " button-info-selected" : ""
            }`}
            onClick={onAddMarkClick}
          >
            <FaVectorSquare title="Draw rectangles" />
          </button>
        </div>
      )}
    </div>
  );
}
export default ManipulationArea;
