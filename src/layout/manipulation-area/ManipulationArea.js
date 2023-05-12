import { RiZoomInLine } from "react-icons/ri";
import { RiZoomOutLine } from "react-icons/ri";
import { MdOutlineLoop } from "react-icons/md"; //MdCached
import { FaVectorSquare } from "react-icons/fa";
import { TbArrowRightSquare } from "react-icons/tb"; //BsBoundingBoxCircles BsBoundingBox
import { useSelector, useDispatch } from "react-redux";
import { CANVAS_MODES } from "../../consts/canvas.consts";
import { switchCanvasMode } from "../../store/slices/canvasSlice";
import "./ManipulationArea.css";

function ManipulationArea() {
  const { canvasMode } = useSelector((state) => state.canvas);
  const dispatch = useDispatch();

  const onAddMarkClick = () => {
    const newCanvasMode =
      canvasMode === CANVAS_MODES.markMode
        ? CANVAS_MODES.dragMode
        : CANVAS_MODES.markMode;
    dispatch(switchCanvasMode(newCanvasMode));
  };

  const isAddingMark = canvasMode === CANVAS_MODES.markMode;
  return (
    <div className="zoom-container">
      <div>
        <button type="button" className="button-info">
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
      <div>
        <button type="button" className="button-info">
          <TbArrowRightSquare title="Draw lines" />
        </button>
      </div>
      <div>
        <button
          type="button"
          className={`button-info square-icon${
            isAddingMark ? " button-info-selected" : ""
          }`}
          onClick={onAddMarkClick}
        >
          <FaVectorSquare title="Draw rectangles" />
        </button>
      </div>
    </div>
  );
}
export default ManipulationArea;
