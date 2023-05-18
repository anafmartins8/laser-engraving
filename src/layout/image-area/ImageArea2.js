import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImg } from "../../store/slices/canvasSlice";
import p5 from "p5";

function ImageArea2() {
  const divRef = useRef(null);
  const imgState = useSelector((state) => state.canvas.img);
  const dispatch = useDispatch();
  const imgStateRef = useRef(imgState); //create a mutable reference to img and access its current value inside the sketch function

  useEffect(() => {
    imgStateRef.current = imgState;
  }, [imgState]);

  const sketch = useCallback(
    (p5) => {
      let wcontainer, hcontainer;
      let loadedImg;
      p5.preload = () => {
        wcontainer = divRef.current.offsetWidth - 4;
        hcontainer = divRef.current.offsetHeight - 4;

        loadedImg = p5.loadImage(
          "http://localhost:3000/images/SW_img.jpeg",
          (p1) => {
            loadedImg = p1;
            const { initialScale } = imgStateRef.current;
            dispatch(
              setImg({
                ...imgStateRef.current,
                initialScale: wcontainer / p1.width,
                wi: p1.width * initialScale,
                w: p1.width * initialScale,
                tow: p1.width * initialScale,
                h: p1.height * initialScale,
                toh: p1.height * initialScale,
              })
            );
          },
          console.log(imgStateRef.current.initialScale),
          (e) => console.log("error", e)
        );
      };

      p5.setup = () => {
        p5.createCanvas(wcontainer, hcontainer).parent(divRef.current);
      };

      p5.draw = () => {
        p5.background("#707070");
        const { tox, toy, tow, toh } = imgStateRef.current;
        if (loadedImg) {
          p5.image(loadedImg, tox, toy, tow, toh);
        }
      };

      p5.mouseDragged = () => {
        const { tox, toy } = imgStateRef.current;
        dispatch(
          setImg({
            ...imgStateRef.current,
            tox: tox + p5.mouseX - p5.pmouseX,
            toy: toy + p5.mouseY - p5.pmouseY,
          })
        );
      };

      p5.mouseWheel = (event) => {
        var e = -event.delta;
        const { tox, toy, tow, toh, zoom } = imgStateRef.current;
        if (e > 0) {
          //zoom in
          if (tow * (zoom + 1) > 5 * imgStateRef.current.wi) return;
          dispatch(
            setImg({
              ...imgStateRef.current,
              tox: tox - zoom * (p5.mouseX - tox),
              toy: toy - zoom * (p5.mouseY - toy),
              tow: tow * (zoom + 1),
              toh: toh * (zoom + 1),
            })
          );
          //dispatch(setScale(imgStateRef.current.tow / imgStateRef.current.wi));
        }
        if (e < 0) {
          //zoom out
          if (tow / (zoom + 1) < imgStateRef.current.wi) return;
          dispatch(
            setImg({
              ...imgStateRef.current,
              tox: tox + (zoom / (zoom + 1)) * (p5.mouseX - tox),
              toy: toy + (zoom / (zoom + 1)) * (p5.mouseY - toy),
              tow: tow / (zoom + 1),
              toh: toh / (zoom + 1),
            })
          );
        }
      };
    },
    [dispatch]
  );

  useEffect(() => {
    const p5Instance = new p5(sketch);
    return () => {
      p5Instance.remove();
    };
  }, [sketch]);

  return <div className="image-container" ref={divRef}></div>;
}

export default ImageArea2;
