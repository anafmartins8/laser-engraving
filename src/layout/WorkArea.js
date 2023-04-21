import Tabs from "./Tabs";
import BottomSidewall from "./BottomSidewall";
import Mark from "./Mark";

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
