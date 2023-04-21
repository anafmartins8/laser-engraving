import Tabs from "./Tabs";
import Info from "./Info";
import TeachingMarks from "./TeachingMarks";
import TrainMark from "./TrainMark";

function Mark() {
  return (
    <div className="work-container2">
      <Tabs>
        <div label="Teaching Marks">
          <TeachingMarks />
        </div>
        <div label="Train OCR">
          <div className="two-components">
            <TrainMark />
            <Info />
          </div>
        </div>
        <div label="Test OCR">
          <div className="component-title">Recognized characters</div>
          <div className="component-content">
            ? 5 Z 25 Vaftem @ntinental ! P0lti Eamtg
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default Mark;
