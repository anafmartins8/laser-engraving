import React from "react";
import { BsFillTrashFill } from "react-icons/bs";

function TeachingMarks() {
  return (
    <React.Fragment>
      <div className="teaching-components">
        <div className="left-component">
          <div className="table-title">Window</div>
          <div className="table-content">
            <p>Width</p>
            <hr />
            <p>Height</p>
          </div>
        </div>
        <div className="right-component">
          <table>
            <thead>
              <tr>
                <th className="centered">Point Number</th>
                <th className="centered">Window</th>
                <th className="centered">Mark Point</th>
                <th className="centered"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="centered">1</td>
                <td className="centered">(350, 40)</td>
                <td className="centered">(227.6, 98.9)</td>
                <td className="centered">
                  {" "}
                  <BsFillTrashFill />
                </td>
              </tr>
              <tr>
                <td className="centered">2</td>
                <td className="centered"></td>
                <td className="centered"></td>
                <td className="centered"></td>
              </tr>
              <tr>
                <td className="centered">3</td>
                <td className="centered"></td>
                <td className="centered"></td>
                <td className="centered"></td>
              </tr>
              <tr>
                <td className="centered">4</td>
                <td className="centered"></td>
                <td className="centered"></td>
                <td className="centered"></td>
              </tr>
              <tr>
                <td className="centered">5</td>
                <td className="centered"></td>
                <td className="centered"></td>
                <td className="centered"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
}

export default TeachingMarks;
