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
  drawMarkTranslationPoint,
  drawResizePointsX,
  drawResizePointsY,
  markInTranslation,
  markInResizingLeft,
  markInResizingRight,
  markInResizingTop,
  markInResizingBottom,
} from "../../utils/mark.utils";
import { CANVAS_MODES } from "../../consts/canvas.consts";
import {
  addMark,
  editMark,
  changeToDragMode,
} from "../../store/slices/marksSlice";

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
            wcontainer: wcontainer,
            hcontainer: hcontainer,
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
      } else if (canvasModeRef.current === CANVAS_MODES.markMode) {
        marksStateRef.current.forEach((mark, i) => {
          drawMark(p5, mark);
          dispatch(
            editMark({
              index: i,
              mark: {
                ...mark,
                translationPoint: drawMarkTranslationPoint(p5, mark),
                resizePointsX: drawResizePointsX(p5, mark),
                resizePointsY: drawResizePointsY(p5, mark),
              },
            })
          );
        });
      }
    };

    p5.mousePressed = () => {
      if (isOutSideOfBounds()) return;

      const lineIndex = linesStateRef.current.findIndex((line) =>
        lineInTranslation(p5, line)
      );

      const markIndex = marksStateRef.current.findIndex((mark) =>
        markInTranslation(p5, mark)
      );

      const markToResizeLeftIndex = marksStateRef.current.findIndex((mark) =>
        markInResizingLeft(p5, mark)
      );

      const markToResizeRightIndex = marksStateRef.current.findIndex((mark) =>
        markInResizingRight(p5, mark)
      );

      const markToResizeTopIndex = marksStateRef.current.findIndex((mark) =>
        markInResizingTop(p5, mark)
      );

      const markToResizeBottomIndex = marksStateRef.current.findIndex((mark) =>
        markInResizingBottom(p5, mark)
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
      } else if (markIndex !== -1) {
        const markToMove = marksStateRef.current[markIndex];

        dispatch(
          editMark({
            index: markIndex,
            mark: {
              ...markToMove,
              inTranslation: true,
            },
          })
        );
      } else if (markToResizeLeftIndex !== -1) {
        const markLeftToResize = marksStateRef.current[markToResizeLeftIndex];

        dispatch(
          editMark({
            index: markToResizeLeftIndex,
            mark: {
              ...markLeftToResize,
              inResizingLeft: true,
            },
          })
        );
      } else if (markToResizeRightIndex !== -1) {
        const markRightToResize = marksStateRef.current[markToResizeRightIndex];

        dispatch(
          editMark({
            index: markToResizeRightIndex,
            mark: {
              ...markRightToResize,
              inResizingRight: true,
            },
          })
        );
      } else if (markToResizeTopIndex !== -1) {
        const markTopToResize = marksStateRef.current[markToResizeTopIndex];

        dispatch(
          editMark({
            index: markToResizeTopIndex,
            mark: {
              ...markTopToResize,
              inResizingTop: true,
            },
          })
        );
      } else if (markToResizeBottomIndex !== -1) {
        const markBottomToResize =
          marksStateRef.current[markToResizeBottomIndex];

        dispatch(
          editMark({
            index: markToResizeBottomIndex,
            mark: {
              ...markBottomToResize,
              inResizingBottom: true,
            },
          })
        );
      } else if (
        canvasModeRef.current === CANVAS_MODES.markMode &&
        isMarkingRef.current &&
        marksStateRef.current.length !== MAX_MARKS
      ) {
        dispatch(
          addMark({
            ...DEFAULT_MARK,
            x: p5.pmouseX,
            y: p5.pmouseY,
            xImage: convertToRealScale(
              p5.mouseX + imgStateRef.current.x - imgStateRef.current.tox
            ),
            yImage: convertToRealScale(
              p5.mouseY + imgStateRef.current.y - imgStateRef.current.toy
            ),
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

      const markToMoveIndex = marksStateRef.current.findIndex(
        (mark) => mark.inTranslation === true
      );

      const markToResizeLeftIndex = marksStateRef.current.findIndex(
        (mark) => mark.inResizingLeft === true
      );

      const markToResizeRightIndex = marksStateRef.current.findIndex(
        (mark) => mark.inResizingRight === true
      );

      const markToResizeTopIndex = marksStateRef.current.findIndex(
        (mark) => mark.inResizingTop === true
      );

      const markToResizeBottomIndex = marksStateRef.current.findIndex(
        (mark) => mark.inResizingBottom === true
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
      } else if (markToMoveIndex !== -1) {
        const markToMove = marksStateRef.current[markToMoveIndex];
        //update the values of mark
        dispatch(
          editMark({
            index: markToMoveIndex,
            mark: {
              ...markToMove,
              x: markToMove.x + p5.mouseX - p5.pmouseX,
              y: markToMove.y + p5.mouseY - p5.pmouseY,
              xImage: convertToRealScale(
                markToMove.x + imgStateRef.current.x - imgStateRef.current.tox
              ),
              yImage: convertToRealScale(
                markToMove.y + imgStateRef.current.y - imgStateRef.current.toy
              ),
            },
          })
        );
      } else if (markToResizeLeftIndex !== -1) {
        const markLeftToResize = marksStateRef.current[markToResizeLeftIndex];
        dispatch(
          editMark({
            index: markToResizeLeftIndex,
            mark: {
              ...markLeftToResize,
              x: markLeftToResize.x + p5.mouseX - p5.pmouseX,
              xImage: convertToRealScale(
                markLeftToResize.x +
                  imgStateRef.current.x -
                  imgStateRef.current.tox
              ),
              w: markLeftToResize.w - (p5.mouseX - p5.pmouseX),
              wImage: convertToRealScale(markLeftToResize.w),
            },
          })
        );
      } else if (markToResizeRightIndex !== -1) {
        const markRightToResize = marksStateRef.current[markToResizeRightIndex];
        dispatch(
          editMark({
            index: markToResizeRightIndex,
            mark: {
              ...markRightToResize,
              w: markRightToResize.w + p5.mouseX - p5.pmouseX,
              wImage: convertToRealScale(markRightToResize.w),
            },
          })
        );
      } else if (markToResizeTopIndex !== -1) {
        const markTopToResize = marksStateRef.current[markToResizeTopIndex];
        dispatch(
          editMark({
            index: markToResizeTopIndex,
            mark: {
              ...markTopToResize,
              y: markTopToResize.y + p5.mouseY - p5.pmouseY,
              yImage: convertToRealScale(
                markTopToResize.y +
                  imgStateRef.current.y -
                  imgStateRef.current.toy
              ),
              h: markTopToResize.h - (p5.mouseY - p5.pmouseY),
              hImage: convertToRealScale(markTopToResize.h),
            },
          })
        );
      } else if (markToResizeBottomIndex !== -1) {
        const markBottomToResize =
          marksStateRef.current[markToResizeBottomIndex];
        dispatch(
          editMark({
            index: markToResizeBottomIndex,
            mark: {
              ...markBottomToResize,
              h: markBottomToResize.h + p5.mouseY - p5.pmouseY,
              hImage: convertToRealScale(markBottomToResize.h),
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
              wImage: convertToRealScale(currentMark.w),
              hImage: convertToRealScale(currentMark.h),
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
        marksStateRef.current.forEach((mark, i) => {
          dispatch(
            editMark({
              index: i,
              mark: {
                ...mark,
                x: mark.x + p5.mouseX - p5.pmouseX,
                y: mark.y + p5.mouseY - p5.pmouseY,
              },
            })
          );
        });
      }
    };

    p5.mouseReleased = () => {
      //prevent drawing marks
      if (marksStateRef.current.length === MAX_MARKS) {
        dispatch(changeToDragMode());
      }

      linesStateRef.current.forEach((line, i) => {
        dispatch(
          editLine({
            index: i,
            line: { ...line, inTranslation: false },
          })
        );
      });

      marksStateRef.current.forEach((mark, i) => {
        dispatch(
          editMark({
            index: i,
            mark: {
              ...mark,
              inTranslation: false,
              inResizingLeft: false,
              inResizingRight: false,
              inResizingTop: false,
              inResizingBottom: false,
            },
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
        for (var i = 0; i < e; i++) {
          if (tow * (zoom + 1) > 4 * wi) return;

          //update the values of image
          dispatch(
            setImg({
              ...imgStateRef.current,
              tox: tox - zoom * (p5.mouseX - tox),
              toy: toy - zoom * (p5.mouseY - toy),
              tow: tow * (zoom + 1),
              toh: toh * (zoom + 1),
              scale: (tow * (zoom + 1)) / wi,
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

          //upadates the values of marks
          marksStateRef.current.forEach((mark, i) => {
            dispatch(
              editMark({
                index: i,
                mark: {
                  ...mark,
                  x: mark.x - zoom * (p5.mouseX - mark.x),
                  y: mark.y - zoom * (p5.mouseY - mark.y),
                  w: mark.w * (zoom + 1),
                  h: mark.h * (zoom + 1),
                },
              })
            );
          });
        }
      }

      if (e < 0) {
        //zoom out
        for (var j = 0; j < -e; j++) {
          if (tow / (zoom + 1) < wi) return;

          //update the values of image
          dispatch(
            setImg({
              ...imgStateRef.current,
              tox: tox + (zoom / (zoom + 1)) * (p5.mouseX - tox),
              toy: toy + (zoom / (zoom + 1)) * (p5.mouseY - toy),
              tow: tow / (zoom + 1),
              toh: toh / (zoom + 1),
              scale: tow / (zoom + 1) / wi,
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

          //upadates the values of marks
          marksStateRef.current.forEach((mark, i) => {
            dispatch(
              editMark({
                index: i,
                mark: {
                  ...mark,
                  x: mark.x + (zoom / (zoom + 1)) * (p5.mouseX - mark.x),
                  y: mark.y + (zoom / (zoom + 1)) * (p5.mouseY - mark.y),
                  w: mark.w / (zoom + 1),
                  h: mark.h / (zoom + 1),
                },
              })
            );
          });
        }
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
      return parseFloat((number / (initialScale * scale)).toFixed(1));
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
