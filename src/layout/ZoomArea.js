import { RiZoomInLine } from "react-icons/ri";
import { RiZoomOutLine } from "react-icons/ri";

function ZoomArea() {
  return (
    <div className="zoom-container">
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
    </div>
  );
}

export default ZoomArea;
