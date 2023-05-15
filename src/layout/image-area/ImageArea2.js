import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImg } from "../../store/slices/canvasSlice";
import p5 from "p5";

function ImageArea2() {
  const myDivRef = useRef(null);
  const imgRef = useRef(null);
  const { img } = useSelector((state) => state.canvas);
  const dispatch = useDispatch();
  const canvasRef = useRef(null);

  const sketch = useCallback(
    (p5) => {
      let wcontainer, hcontainer;
      let canvas;

      p5.setup = () => {
        wcontainer = myDivRef.current.offsetWidth - 4;
        hcontainer = myDivRef.current.offsetHeight - 4;
        canvas = p5.createCanvas(wcontainer, hcontainer);
        canvas.parent(canvasRef.current);

        p5.loadImage(
          "http://localhost:3000/images/SW_img.jpeg",
          (p1) => {
            imgRef.current = p1;
            dispatch(
              setImg({
                ...img,
                initialScale: wcontainer / p1.width,
                wi: p1.width * img.initialScale,
                w: p1.width * img.initialScale,
                tow: p1.width * img.initialScale,
                h: p1.height * img.initialScale,
                toh: p1.height * img.initialScale,
              })
            );
          },
          (e) => console.log("error", e)
        );
      };

      p5.draw = () => {
        p5.background("#707070");
        setImg({
          ...img,
          w: p5.lerp(img.w, img.tow, 1),
          h: p5.lerp(img.h, img.toh, 1),
        });
        if (imgRef.current) {
          p5.image(imgRef.current, img.tox, img.toy, img.w, img.h);
        }
      };
    },
    [dispatch, img]
  );

  useEffect(() => {
    const p5Instance = new p5(sketch);
    return () => {
      p5Instance.remove();
    };
  }, [sketch]);

  return (
    <div className="image-container" ref={myDivRef}>
      <div ref={canvasRef}></div>
    </div>
  );
}

export default ImageArea2;
