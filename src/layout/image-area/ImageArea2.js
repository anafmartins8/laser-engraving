import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImg, addLine, editLine } from "../../store/slices/canvasSlice";

import { DEFAULT_LINE } from "../../consts/line.consts";
import { DEFAULT_MARK } from "../../consts/mark.consts";

import {
  drawLine,
  drawTranslationPoint,
  fillROI,
  lineInTranslation,
} from "../../utils/line.utils";
import p5 from "p5";
import {
  drawMark,
  drawTranslationPoint1,
  markInTranslation,
} from "../../utils/mark.utils";
import { CANVAS_MODES } from "../../consts/canvas.consts";
import { addMark, editMark } from "../../store/slices/marksSlice";

const MAX_LINES = 2;
const MAX_MARKS = 5;

function ImageArea2() {
  const divRef = useRef(null);
  const canvasMode = useSelector((state) => state.canvas.canvasMode);
  const imgState = useSelector((state) => state.canvas.img);
  const linesState = useSelector((state) => state.canvas.lines);
  const marksState = useSelector((state) => state.marks.marks);
  const { isMarking } = useSelector((state) => state.marks);

  const dispatch = useDispatch();

  const canvasModeRef = useRef(canvasMode);
  const imgStateRef = useRef(imgState); //create a mutable reference to img and access its current value inside the sketch function
  const linesStateRef = useRef(linesState); //create a mutable reference to lines and access its current value inside the sketch function
  const isMarkingRef = useRef(isMarking);
  const marksStateRef = useRef(marksState); //create a mutable reference to lines and access its current value inside the sketch function

  useEffect(() => {
    canvasModeRef.current = canvasMode;
    imgStateRef.current = imgState;
    linesStateRef.current = linesState;
    isMarkingRef.current = isMarking;
    marksStateRef.current = marksState;
  }, [canvasMode, imgState, linesState, isMarking, marksState]);

  const sketch = useCallback((p5) => {
    let wcontainer, hcontainer;
    let loadedImg;
    p5.preload = () => {
      wcontainer = divRef.current.offsetWidth - 4;
      hcontainer = divRef.current.offsetHeight - 4;

      loadedImg = p5.loadImage(
        "http://localhost:3000/images/SW_img.jpeg",
        (p1) => {
          loadedImg = p1;
          const initialScale = wcontainer / p1.width;
          const preloadedImg = {
            ...imgState,
            initialScale: initialScale,
            wi: p1.width * initialScale,
            w: p1.width * initialScale,
            tow: p1.width * initialScale,
            h: p1.height * initialScale,
            toh: p1.height * initialScale,
          };
          dispatch(setImg(preloadedImg));
        },
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
      if (canvasModeRef.current === CANVAS_MODES.roiMode) {
        linesStateRef.current.forEach((line, i) => {
          drawLine(p5, line, tox, tox + tow);
          if (i === MAX_LINES - 1) {
            fillROI(p5, line, tox, tow, linesStateRef.current[0].y);
          }
          dispatch(
            editLine({
              index: i,
              line: {
                ...line,
                translationPoint: drawTranslationPoint(
                  p5,
                  line,
                  tox,
                  tow,
                  wcontainer
                ),
              },
            })
          );
        });
      }

      marksStateRef.current.forEach((mark, i) => {
        drawMark(p5, mark);
        dispatch(
          editMark({
            index: i,
            mark: {
              ...mark,
              translationPoint: drawTranslationPoint1(p5, mark),
            },
          })
        );
      });
    };

    p5.mousePressed = () => {
      const lineIndex = linesStateRef.current.findIndex((line) =>
        lineInTranslation(p5, line)
      );

      if (lineIndex !== -1) {
        const lineToMove = linesStateRef.current[lineIndex];

        dispatch(
          editLine({
            index: lineIndex,
            line: {
              ...lineToMove,
              inTranslation: true,
            },
          })
        );
      }

      if (
        canvasModeRef.current === CANVAS_MODES.markMode &&
        isMarkingRef.current
      ) {
        dispatch(
          addMark({
            ...DEFAULT_MARK,
            x: p5.pmouseX,
            y: p5.pmouseY,
          })
        );
      }
    };

    p5.mouseDragged = () => {
      if (isOutSideOfBounds()) return;

      const { tox, toy } = imgStateRef.current;

      const lineToMoveIndex = linesStateRef.current.findIndex(
        (line) => line.inTranslation === true
      );

      if (lineToMoveIndex !== -1) {
        const lineToMove = linesStateRef.current[lineToMoveIndex];
        //update the values of lines
        dispatch(
          editLine({
            index: lineToMoveIndex,
            line: {
              ...lineToMove,
              y: lineToMove.y + p5.mouseY - p5.pmouseY,
              yImage: convertToRealScale(
                lineToMove.y + imgStateRef.current.y - imgStateRef.current.toy
              ),
            },
          })
        );
      } else if (
        canvasModeRef.current === CANVAS_MODES.markMode &&
        isMarkingRef.current
      ) {
        const currentMark =
          marksStateRef.current[marksStateRef.current.length - 1];
        dispatch(
          editMark({
            index: marksStateRef.current.length - 1,
            mark: {
              ...currentMark,
              w: currentMark.w + p5.mouseX - p5.pmouseX,
              h: currentMark.h + p5.mouseY - p5.pmouseY,
            },
          })
        );
      } else {
        //update the values of image and lines
        dispatch(
          setImg({
            ...imgStateRef.current,
            tox: tox + p5.mouseX - p5.pmouseX,
            toy: toy + p5.mouseY - p5.pmouseY,
          })
        );
        linesStateRef.current.forEach((line, i) => {
          dispatch(
            editLine({
              index: i,
              line: {
                ...line,
                y: line.y + p5.mouseY - p5.pmouseY,
              },
            })
          );
        });
      }
    };

    p5.mouseReleased = () => {
      linesStateRef.current.forEach((line, i) => {
        dispatch(
          editLine({
            index: i,
            line: { ...line, inTranslation: false },
          })
        );
      });
    };

    p5.doubleClicked = () => {
      if (
        isOutSideOfImage() ||
        linesStateRef.current.length === MAX_LINES ||
        canvasModeRef.current !== CANVAS_MODES.roiMode
      ) {
        return;
      }

      dispatch(
        addLine({
          ...DEFAULT_LINE,
          y: p5.mouseY,
          yImage: convertToRealScale(
            p5.mouseY + imgStateRef.current.y - imgStateRef.current.toy
          ),
        })
      );
    };

    p5.mouseWheel = (event) => {
      if (isOutSideOfBounds() || isOutSideOfImage()) return;
      var e = -event.delta;
      const { wi, tox, toy, tow, toh, zoom } = imgStateRef.current;
      if (e > 0) {
        //zoom in
        if (tow * (zoom + 1) > 5 * imgStateRef.current.wi) return;

        //update the values of image
        dispatch(
          setImg({
            ...imgStateRef.current,
            tox: tox - zoom * (p5.mouseX - tox),
            toy: toy - zoom * (p5.mouseY - toy),
            tow: tow * (zoom + 1),
            toh: toh * (zoom + 1),
            scale: imgStateRef.current.tow / wi,
          })
        );

        //update the values of lines
        linesStateRef.current.forEach((line, i) => {
          dispatch(
            editLine({
              index: i,
              line: {
                ...line,
                y: line.y - zoom * (p5.mouseY - line.y),
              },
            })
          );
        });
      }

      if (e < 0) {
        //zoom out
        if (tow / (zoom + 1) < imgStateRef.current.wi) return;

        //update the values of image
        dispatch(
          setImg({
            ...imgStateRef.current,
            tox: tox + (zoom / (zoom + 1)) * (p5.mouseX - tox),
            toy: toy + (zoom / (zoom + 1)) * (p5.mouseY - toy),
            tow: tow / (zoom + 1),
            toh: toh / (zoom + 1),
            scale: imgStateRef.current.tow / wi,
          })
        );

        //update the values of lines
        linesStateRef.current.forEach((line, i) => {
          dispatch(
            editLine({
              index: i,
              line: {
                ...line,
                y: line.y + (zoom / (zoom + 1)) * (p5.mouseY - line.y),
              },
            })
          );
        });
      }
    };

    const isOutSideOfBounds = () => {
      return (
        p5.mouseX > wcontainer ||
        p5.mouseX < 0 ||
        p5.mouseY > hcontainer ||
        p5.mouseY < 0
      );
    };

    const isOutSideOfImage = () => {
      const { x, y, tox, toy, tow, toh } = imgStateRef.current;
      return (
        p5.mouseX > tox - x + tow ||
        p5.mouseX < tox - x ||
        p5.mouseY > toy - y + toh ||
        p5.mouseY < toy - y
      );
    };

    const convertToRealScale = (number) => {
      const { initialScale, scale } = imgStateRef.current;
      return (number / (initialScale * scale)).toFixed(1);
    };
  }, []);

  useEffect(() => {
    const p5Instance = new p5(sketch);
    return () => {
      p5Instance.remove();
    };
  }, [sketch]);

  return <div className="image-container" ref={divRef}></div>;
}

export default ImageArea2;
