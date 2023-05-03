import Tabs from "../../../components/common/tabs/Tabs";
import Info from "../../../components/common/info/Info";
import TrainMark from "./teaching-marks/TrainMark";
import TeachingMarks from "./teaching-marks/TeachingMarks";
import { FaVectorSquare } from "react-icons/fa";

function Mark() {
  return (
    <div className="work-container2">
      <Tabs>
        <div label="Teaching Marks">
          <TeachingMarks />
          <div>
            In the image above select the marks to teach. Use the button{" "}
            <FaVectorSquare /> and draw a rectangle that encloses each mark, up
            to 5 marks.
          </div>
        </div>
        <div label="Train OCR">
          <div className="two-components">
            <TrainMark />
            <Info />
          </div>
        </div>
        <div label="Test OCR">
          <div className="bottom-component">
            <div className="component-title">Recognized characters</div>
            <div className="component-content">
              ? 5 Z 25 Vaftem @ntinental ! P0lti Eamtg
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default Mark;
