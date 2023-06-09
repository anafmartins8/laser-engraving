import React from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { deleteMark } from "../../../../store/slices/marksSlice";

function TeachingMarks() {
  const { marks } = useSelector((state) => state.marks);
  const dispatch = useDispatch();

  const onDeleteMark = (markId) => {
    dispatch(deleteMark(markId));
  };

  return (
    <React.Fragment>
      <div className="teaching-marks-container">
        <table>
          <thead>
            <tr>
              <th className="centered">Mark Number</th>
              <th className="centered">
                Mark Point <i>(x, y)</i>
              </th>
              <th className="centered">
                Window <i>(w, h)</i>
              </th>
              <th className="centered"></th>
            </tr>
          </thead>
          <tbody>
            {marks.map((mark, index) => (
              <tr key={index}>
                <td className="centered">{index + 1}</td>
                <td className="centered">{`(${mark.xImage}, ${mark.yImage})`}</td>
                <td className="centered">{`(${mark.wImage}, ${mark.hImage})`}</td>
                <td className="centered">
                  {" "}
                  <BsFillTrashFill onClick={() => onDeleteMark(index)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

export default TeachingMarks;
