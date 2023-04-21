import cx from "classnames";

const Switch = ({ rounded = false, isToogled, onToggle }) => {
  const sliderCX = cx("slider", {
    rounded: rounded,
  });

  return (
    <label className="switch">
      <input type="checkbox" checked={isToogled} onChange={onToggle} />
      <span className={sliderCX} />
    </label>
  );
};

export default Switch;
