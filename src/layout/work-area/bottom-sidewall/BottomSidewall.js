import Switch from "../../../components/common/switch/Switch";
import { useState } from "react";
import { BsInfoLg } from "react-icons/bs";
import Info from "../../../components/common/info/Info";
import TrainSidewall from "./train-sidewall/TrainSidewall";
import Tabs from "../../../components/common/tabs/Tabs";
import "./BottomSidewall.css";
import { useSelector, useDispatch } from "react-redux";
import { TbArrowRightSquare } from "react-icons/tb";
import { BsFillTrashFill } from "react-icons/bs";
import { deleteLine } from "../../../store/slices/canvasSlice";

function BottomSidewall() {
  const [isToogled, setIsToggled] = useState(false);
  const { lines } = useSelector((state) => state.canvas);
  const dispatch = useDispatch();

  const onDeleteLine = (lineId) => {
    dispatch(deleteLine(lineId));
  };

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
          <div className="bottom-component">
            <table>
              <thead>
                <tr>
                  <th className="centered">Line Number</th>
                  <th className="centered">Y Canvas</th>
                  <th className="centered"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index}>
                    <td className="centered">{index + 1}</td>
                    <td className="centered">{`(${line.y})`}</td>
                    <td className="centered">
                      {" "}
                      <BsFillTrashFill onClick={() => onDeleteLine(index)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="icon-title">
              <BsInfoLg />
            </div>
            <div className="component-content">
              Select the region of interest in the image above. Use the{" "}
              <TbArrowRightSquare /> button and draw boundary lines for the
              region of interest.
            </div>
          </div>
        </div>
        <div label="Train OCR">
          <div className="two-components">
            <TrainSidewall />
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

export default BottomSidewall;
