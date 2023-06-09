//import { useState } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMark } from "../../store/slices/marksSlice";
import { CANVAS_MODES } from "../../consts/canvas.consts";

function ImageArea() {
  //const [scale, setScale] = useState(1);
  const myDivRef = React.createRef();
  const { canvasMode } = useSelector((state) => state.canvas);
  const dispatch = useDispatch();

  const sketch = (p5) => {
    var img;
    let initialScale;
    let zoomScale = 1.0;
    var wi, w, h, tow, toh;
    var x, y; //x and y initial coordinates
    let tox = 0.0; //x coordinate of the starting point of the image
    let toy = 0.0; //y coordinate of the starting point of the image
    let isDragging = false;
    var zoom = 0.01; //zoom step per mouse tick
    let wcontainer = myDivRef.current.offsetWidth - 4; //div size (2px + 2px blue borders)
    let hcontainer = myDivRef.current.offsetHeight - 4;
    let drawLine = false;
    let drawSecLine = false;
    let pointLine = 0.0;
    let pointSecLine = 0.0;
    let pointRect = 0.0;
    let line1, line2, rect;
    let line1mouse, line2mouse, line1mousetranslation, line2mousetranslation;
    let rectx, recty;
    let recth = 0.0;
    let rectw = 0.0;
    let drawRect = false;
    let drawRectDisable = false;
    let rectmouse = false;

    p5.preload = () => {
      p5.loadImage(
        "http://localhost:3000/images/SW_img.jpeg",
        (p1) => (img = p1),
        (e) => console.log("error", e),
        (is) => (initialScale = is)
      );
    };

    p5.setup = () => {
      p5.createCanvas(wcontainer, hcontainer);
      initialScale = wcontainer / img.width;
      wi = w = tow = img.width * initialScale; //atualizar o tamanho da imagem logo no inicio
      h = toh = img.height * initialScale;
      x = tox = 0;
      y = toy = 0;
      console.log("tamanho da div container", wcontainer, hcontainer);
      console.log("tamanho real da imagem", img.width, img.height);
      console.log("escala inicial", initialScale);
      console.log("tamanho inicial da imagem", w, h);
      line1 = new Line();
      line2 = new Line();
      rect = new Rect();
    };

    class Line {
      //Draw line
      drawLine(x1, y1, x2, y2) {
        p5.strokeWeight(1);
        p5.stroke("#F58000");
        p5.line(x1, y1, x2, y2);
      }

      //Draw translation point on line (6x6)
      drawTranslationPoint(yline) {
        p5.fill(255);
        if (tox <= 0 && tox + tow >= wcontainer) {
          pointRect = wcontainer / 2;
        } else if (tox > 0) {
          pointRect = tox + (wcontainer - tox) / 2;
        } else if (tox + tow < wcontainer) {
          pointRect = (tow + tox) / 2;
        }
        p5.rect(pointRect - 3, yline - 3, 6, 6);
      }

      //Control image limit for translations
      setLimit(yline) {
        return yline > toy - y + toh || yline < toy - y;
      }

      //Make margin for the point of translation
      addMarginToPoint(yline) {
        return (
          p5.pmouseX > pointRect - 10 &&
          p5.pmouseX < pointRect + 10 &&
          p5.pmouseY > yline - 10 &&
          p5.pmouseY < yline + 10
        );
      }

      //Fill space between drawn lines - ROI
      fillROI() {
        p5.strokeWeight(0);
        p5.fill(245, 128, 0, 30);
        p5.rect(tox, pointLine, tow, pointSecLine - pointLine);
      }
    }

    class Rect {
      //Draw Rectangle
      drawRect(x, y, w, h) {
        p5.strokeWeight(1);
        p5.stroke("#F58000");
        p5.fill(245, 128, 0, 30);
        p5.rect(x, y, w, h);
      }

      //Draw translation point on rectangle (6x6) - the center
      drawTranslationPoint() {
        p5.fill(255);
        p5.rect(rectx + rectw / 2 - 3, recty + recth / 2 - 3, 6, 6);
      }

      //Make margin for the point of translation
      addMarginToPoint() {
        return (
          p5.pmouseX > rectx + rectw / 2 - 10 &&
          p5.pmouseX < rectx + rectw / 2 + 10 &&
          p5.pmouseY > recty + recth / 2 - 10 &&
          p5.pmouseY < recty + recth / 2 + 10
        );
      }
    }

    // Display the image using the p5.image function
    p5.draw = () => {
      p5.background("#707070");
      //tween/smooth motion
      w = p5.lerp(w, tow, 1);
      h = p5.lerp(h, toh, 1);

      // Display the image using the p5.image function
      p5.image(img, tox, toy, w, h);
      if (drawLine) {
        line1.drawLine(tox, pointLine, tox + tow, pointLine);
        line1.drawTranslationPoint(pointLine);
        line1mouse = line1.addMarginToPoint(pointLine);
      }
      if (drawSecLine) {
        line2.drawLine(tox, pointSecLine, tox + tow, pointSecLine);
        line2.drawTranslationPoint(pointSecLine);
        line2mouse = line2.addMarginToPoint(pointSecLine);
        line2.fillROI();
      }
      if (drawRect) {
        rect.drawRect(rectx, recty, rectw, recth);
        rect.drawTranslationPoint();
        rectmouse = rect.addMarginToPoint();
      }
    };

    p5.doubleClicked = () => {
      if (!isOutSideOfImage()) {
        if (drawLine) {
          if (!drawSecLine) {
            pointSecLine = p5.mouseY;
          }
          drawSecLine = true;
        } else {
          pointLine = p5.mouseY;
          drawLine = true;
        }
      }
    };

    p5.mouseReleased = () => {
      line1mousetranslation = false;
      line2mousetranslation = false;

      if (drawRect) {
        drawRectDisable = true;
      }

      if (isOutSideOfBounds() || isOutSideOfImage()) return;

      if (!isDragging) {
        const clickedX = convertToRealScale(rectx);
        const clickedY = convertToRealScale(recty);
        const windowW = convertToRealScale(rectw);
        const windowH = convertToRealScale(recth);

        dispatch(
          addMark({
            x: parseFloat(clickedX),
            y: parseFloat(clickedY),
            w: parseFloat(windowW),
            h: parseFloat(windowH),
          })
        );
      }

      if (isDragging) {
        // Do something
        console.log("Mouse released after dragging");
        // Set isDragging to false
        isDragging = false;
      }
    };

    p5.mouseDragged = () => {
      if (isOutSideOfBounds()) return;
      //if (isOutSideOfImage()) return;
      if (canvasMode === CANVAS_MODES.markMode && !drawRectDisable) {
        // modo rect
        if (p5.mouseIsPressed) {
          if (!drawRect) {
            rectx = p5.mouseX;
            recty = p5.mouseY;
          }
          drawRect = true;
          rectw += p5.mouseX - p5.pmouseX;
          recth += p5.mouseY - p5.pmouseY;
        }
      } else if (canvasMode === CANVAS_MODES.markMode && drawRectDisable) {
        if (rectmouse) {
          rectx += p5.mouseX - p5.pmouseX;
          recty += p5.mouseY - p5.pmouseY;
        }
      } else if (canvasMode === CANVAS_MODES.roiMode) {
        //modo drag
        if (p5.mouseIsPressed) {
          if ((line1mouse || line1mousetranslation) && !isOutSideOfImage()) {
            pointLine += p5.mouseY - p5.pmouseY;
            line1mousetranslation = true;
            if (line1.setLimit(pointLine)) {
              if (pointLine < toy) {
                //limite sup
                pointLine = toy;
              } else {
                pointLine = toy + toh;
              }
            }
          } else if (
            (line2mouse || line2mousetranslation) &&
            !isOutSideOfImage()
          ) {
            pointSecLine += p5.mouseY - p5.pmouseY;
            line2mousetranslation = true;
            if (line2.setLimit(pointSecLine)) {
              //
              if (pointSecLine < toy) {
                //limite sup
                pointSecLine = toy;
              } else {
                pointSecLine = toy + toh;
              }
            }
          } else if (!line1mousetranslation && !line2mousetranslation) {
            // Update the values
            tox += p5.mouseX - p5.pmouseX;
            toy += p5.mouseY - p5.pmouseY;

            pointLine += p5.mouseY - p5.pmouseY;
            pointSecLine += p5.mouseY - p5.pmouseY;

            // Set isDragging to true
            isDragging = true;
          }
        }
      }
    };

    p5.mouseWheel = (event) => {
      if (isOutSideOfBounds()) return;
      if (isOutSideOfImage()) return;
      var e = -event.delta;
      if (e > 0) {
        //zoom in
        for (var i = 0; i < e; i++) {
          if (tow * (zoom + 1) > 3 * wi) return; //max zoom
          tox -= zoom * (p5.mouseX - tox);
          toy -= zoom * (p5.mouseY - toy);
          tow *= zoom + 1;
          toh *= zoom + 1;
          pointLine -= zoom * (p5.mouseY - pointLine);
          pointSecLine -= zoom * (p5.mouseY - pointSecLine);
          rectx -= zoom * (p5.mouseX - rectx);
          recty -= zoom * (p5.mouseY - recty);
          rectw *= zoom + 1;
          recth *= zoom + 1;

          zoomScale = tow / wi;
        }
      }

      if (e < 0) {
        //zoom out
        for (var j = 0; j < -e; j++) {
          if (tow / (zoom + 1) < wi) return; //min zoom
          tox += (zoom / (zoom + 1)) * (p5.mouseX - tox);
          toy += (zoom / (zoom + 1)) * (p5.mouseY - toy);
          toh /= zoom + 1;
          tow /= zoom + 1;
          pointLine += (zoom / (zoom + 1)) * (p5.mouseY - pointLine);
          pointSecLine += (zoom / (zoom + 1)) * (p5.mouseY - pointSecLine);
          rectx += (zoom / (zoom + 1)) * (p5.mouseX - rectx);
          recty += (zoom / (zoom + 1)) * (p5.mouseY - recty);
          rectw /= zoom + 1;
          recth /= zoom + 1;
          zoomScale = tow / wi;
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
      return (
        p5.mouseX > tox - x + tow ||
        p5.mouseX < tox - x ||
        p5.mouseY > toy - y + toh ||
        p5.mouseY < toy - y
      );
    };

    const convertToRealScale = (number) => {
      return (number / (initialScale * zoomScale)).toFixed(1);
    };
  };

  return (
    <div className="image-container" ref={myDivRef}>
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
}

export default ImageArea;
