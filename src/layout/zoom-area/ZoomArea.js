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
          <MdOutlineLoop />
        </button>
      </div>
      <div>
        <button type="button" className="button-info">
          <RiZoomInLine />
        </button>
      </div>
      <div>
        <button type="button" className="button-info">
          <RiZoomOutLine />
        </button>
      </div>
      <div>
        <button type="button" className="button-info">
          <TbArrowRightSquare />
        </button>
      </div>
      <div>
        <button type="button" className="button-info square-icon">
          <FaVectorSquare />
        </button>
      </div>
    </div>
  );
}

export default ZoomArea;
