import { RiZoomInLine } from "react-icons/ri";
import { RiZoomOutLine } from "react-icons/ri";
import { MdOutlineLoop } from "react-icons/md"; //MdCached
import { FaVectorSquare } from "react-icons/fa";
import { TbArrowRightSquare } from "react-icons/tb"; //BsBoundingBoxCircles BsBoundingBox

function ZoomArea() {
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
        <button type="button" className="button-info square-icon">
          <FaVectorSquare title="Draw rectangles" />
        </button>
      </div>
    </div>
  );
}

export default ZoomArea;
