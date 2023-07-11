import { RiZoomInLine } from "react-icons/ri";
import { RiZoomOutLine } from "react-icons/ri";
import { MdOutlineLoop } from "react-icons/md"; //MdCached
import { FaVectorSquare } from "react-icons/fa";
import { TbArrowRightSquare } from "react-icons/tb"; //BsBoundingBoxCircles BsBoundingBox
import { useSelector, useDispatch } from "react-redux";
import { CANVAS_MODES } from "../../consts/canvas.consts";
import {
  setImg,
  resetCanvas,
  switchCanvasMode,
  editLine,
} from "../../store/slices/canvasSlice";
import "./ManipulationArea.css";
import {
  toggleIsMarking,
  resetMarks,
  editMark,
} from "../../store/slices/marksSlice";

function ManipulationArea() {
  const { canvasMode, img, lines } = useSelector((state) => state.canvas);
  const { marks, isMarking } = useSelector((state) => state.marks);
  const dispatch = useDispatch();

  const onAddMarkClick = () => {
    dispatch(toggleIsMarking());
  };

  const handleResetStore = () => {
    dispatch(resetCanvas());
    dispatch(resetMarks());
  };

  const handleZoomIn = () => {
    const { tox, toy, tow, toh, wi, zoom, wcontainer, hcontainer } = img;
    if (tow * (zoom + 1) > 4 * wi) return;

    dispatch(
      setImg({
        ...img,
        tox: tox - zoom * (wcontainer / 2 - tox),
        toy: toy - zoom * (hcontainer / 2 - toy),
        tow: tow * (zoom + 1),
        toh: toh * (zoom + 1),
        scale: (tow * (zoom + 1)) / wi,
      })
    );

    console.log(lines);

    lines.forEach((line, i) => {
      dispatch(
        editLine({
          index: i,
          line: {
            ...line,
            y: line.y - zoom * (hcontainer / 2 - line.y),
          },
        })
      );
    });

    marks.forEach((mark, i) => {
      dispatch(
        editMark({
          index: i,
          mark: {
            ...mark,
            x: mark.x - zoom * (wcontainer / 2 - mark.x),
            y: mark.y - zoom * (hcontainer / 2 - mark.y),
            w: mark.w * (zoom + 1),
            h: mark.h * (zoom + 1),
          },
        })
      );
    });
  };

  const handleZoomOut = () => {
    const { tox, toy, tow, toh, wi, zoom, wcontainer, hcontainer } = img;
    if (tow / (zoom + 1) < wi) return;

    dispatch(
      setImg({
        ...img,
        tox: tox + (zoom / (zoom + 1)) * (wcontainer / 2 - tox),
        toy: toy + (zoom / (zoom + 1)) * (hcontainer / 2 - toy),
        tow: tow / (zoom + 1),
        toh: toh / (zoom + 1),
        scale: tow / (zoom + 1) / wi,
      })
    );

    lines.forEach((line, i) => {
      dispatch(
        editLine({
          index: i,
          line: {
            ...line,
            y: line.y + (zoom / (zoom + 1)) * (hcontainer / 2 - line.y),
          },
        })
      );
    });

    marks.forEach((mark, i) => {
      dispatch(
        editMark({
          index: i,
          mark: {
            ...mark,
            x: mark.x + (zoom / (zoom + 1)) * (wcontainer / 2 - mark.x),
            y: mark.y + (zoom / (zoom + 1)) * (hcontainer / 2 - mark.y),
            w: mark.w / (zoom + 1),
            h: mark.h / (zoom + 1),
          },
        })
      );
    });
  };

  const isInLineMode = canvasMode === CANVAS_MODES.roiMode;
  const MAX_LINES = 2;
  const MAX_MARKS = 5;

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
        <button type="button" className="button-info" onClick={handleZoomIn}>
          <RiZoomInLine title="Zoom in" />
        </button>
      </div>
      <div>
        <button type="button" className="button-info" onClick={handleZoomOut}>
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
            disabled={lines.length === MAX_LINES}
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
            disabled={marks.length === MAX_MARKS}
          >
            <FaVectorSquare title="Draw rectangles" />
          </button>
        </div>
      )}
    </div>
  );
}
export default ManipulationArea;
