import React, { useState } from "react";

const ZoomImage = ({ src, alt }) => {
  const [scale, setScale] = useState(1);
  const [panning, setPanning] = useState(false);
  const [pointX, setPointX] = useState(0);
  const [pointY, setPointY] = useState(0);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  function setTransform() {
    const zoom = document.getElementById("zoom");
    zoom.style.transform =
      "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
    console.log(pointX, pointY, "scale", scale);
  }

  const handleMouseDown = (e) => {
    e.preventDefault();
    setStart({ x: e.clientX - pointX, y: e.clientY - pointY });
    setPanning(true);
    setDragging(true);
    console.log(
      "clique_ecra_x",
      e.clientX,
      "clique_ecra_y",
      e.clientY,
      "imagem_começa_x",
      pointX,
      "imagem_começa_y",
      pointY
    );
  };

  const handleMouseUp = (e) => {
    setPanning(false);
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (!panning) {
      return;
    }
    setPointX(e.clientX - start.x);
    setPointY(e.clientY - start.y);
    console.log("x", e.clientX, "y", e.clientY);
    setTransform();
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoom = document.getElementById("zoom");
    const xs = (e.clientX - pointX) / scale;
    const ys = (e.clientY - pointY) / scale;
    const delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
    delta > 0 ? setScale(scale * 1.2) : setScale(scale / 1.2);
    setPointX(e.clientX - xs * scale);
    setPointY(e.clientY - ys * scale);
    console.log(e.clientX, e.clientY);
    setTransform();
  };

  return (
    <div
      id="zoom"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
    >
      <img src={src} alt={alt} />
    </div>
  );
};

export default ZoomImage;
