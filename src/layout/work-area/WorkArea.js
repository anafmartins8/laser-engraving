import Tabs from "../../components/common/tabs/Tabs";
import BottomSidewall from "./bottom-sidewall/BottomSidewall";
import Mark from "./mark/Mark";

function WorkArea() {
  return (
    <div className="work-container">
      <Tabs>
        <div label="Bottom Sidewall">
          <BottomSidewall />
        </div>
        <div label="Mark">
          <Mark />
        </div>
      </Tabs>
    </div>
  );
}

export default WorkArea;

// https://www.digitalocean.com/community/tutorials/react-tabs-component
