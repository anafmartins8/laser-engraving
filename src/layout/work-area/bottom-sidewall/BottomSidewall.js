import Switch from "../../../components/common/switch/Switch";
import { useState } from "react";
import Info from "../../../components/common/info/Info";
import TrainSidewall from "./train-sidewall/TrainSidewall";
import Tabs from "../../../components/common/tabs/Tabs";

function BottomSidewall() {
  const [isToogled, setIsToggled] = useState(false);

  return (
    <div className="work-container2">
      <div className="filled-toogle">
        <span>Filled</span>
        <Switch
          rounded={true}
          isToogled={isToogled}
          onToggle={() => setIsToggled(!isToogled)}
        />
      </div>
      <Tabs>
        <div label="Select ROI">
          <div className="component-title">Recognized characters</div>
          <div className="component-content">
            ? 5 Z 25 Vaftem @ntinental ! P0lti Eamtg
          </div>
        </div>
        <div label="Train OCR">
          <div className="two-components">
            <TrainSidewall />
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

export default BottomSidewall;
