import { useState } from "react";

function TrainMark() {
  const [character, setCharacter] = useState("");

  return (
    <div className="left-component">
      <div className="component-title">Character font training</div>
      <div className="component-content">
        <div className="two-components2">
          <div className="left-component2">IMG</div>
          <div className="right-component2">
            <form>
              <label>
                <p>Select the character for the image:</p>
                <input
                  type="text"
                  value={character}
                  onChange={(e) => setCharacter(e.target.value)}
                />
              </label>
              <div className="buttons-form">
                <button className="primary-button" type="send-mark">
                  Send
                </button>
                <button className="secundary-button" type="train-mark">
                  Train
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainMark;
