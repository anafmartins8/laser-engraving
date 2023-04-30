//import { useState } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMark } from "../store/slices/marksSlice";

function ImageArea() {
  //const [scale, setScale] = useState(1);
  const myDivRef = React.createRef();
  const { canvasMode } = useSelector((state) => state.canvas);
  const dispatch = useDispatch();

  const sketch = (p5) => {
    var img;
    let initialScale;
    let zoomScale = 1.0;
    var wi, hi, w, h, tow, toh;
    var x, y;
    let tox = 0;
    let toy = 0;
    var px, py;
    let topx = 0.0;
    let topy = 0.0;
    let isDragging = false;
    var zoom = 0.01; //zoom step per mouse tick
    let wcontainer = myDivRef.current.offsetWidth - 4; //div size (2px + 2px blue borders)
    let hcontainer = myDivRef.current.offsetHeight - 4;
    let drawLine = false;
    let drawSecLine = false;
    let pointLine = 0.0;
    let pointSecLine = 0.0;
    let rectLine = 0;
    let pointRect = 0.0;
    let line1, line2;
    let line1mouse, line2mouse, line1mousetranslation, line2mousetranslation;

    //lines

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
      console.log("tamanho da div container", wcontainer, hcontainer);
      initialScale = wcontainer / img.width;
      wi = w = tow = img.width * initialScale; //atualizar o tamanho da imagem logo no inicio
      hi = h = toh = img.height * initialScale;
      x = tox = w / 2;
      y = toy = h / 2;
      px = topx = 0;
      py = topy = 0;
      console.log("tamanho real da imagem", img.width, img.height);
      console.log("escala inicial", initialScale);
      console.log("tamanho inicial da imagem", w, h);
      console.log("coordenadas iniciais do centro da imagem", x, y);
      line1 = new Line();
      line2 = new Line();
    };

    class Line {
      draw_line(x1, y1, x2, y2) {
        p5.strokeWeight(1);
        p5.stroke("#F58000");
        p5.line(x1, y1, x2, y2);
      }
      draw_rect(yline) {
        p5.fill(255);
        if (topx <= 0 && topx + tow >= wcontainer) {
          pointRect = wcontainer / 2;
        } else if (topx > 0) {
          pointRect = topx + (wcontainer - topx) / 2;
        } else if (topx + tow < wcontainer) {
          pointRect = (tow + topx) / 2;
        }
        p5.rect(pointRect - 3, yline - 3, 6, 6);
      }

      ylimit(yline) {
        return yline > topy - py + toh || yline < topy - py;
      }

      rect(yline) {
        let translateLine = false;
        if (
          p5.pmouseX > pointRect - 10 &&
          p5.pmouseX < pointRect + 10 &&
          p5.pmouseY > yline - 10 &&
          p5.pmouseY < yline + 10
        ) {
          translateLine = true;
          console.log("rect");
        }
        return translateLine;
      }

      fill_rect() {
        p5.strokeWeight(0);
        p5.fill(245, 128, 0, 30);
        p5.rect(topx, pointLine, tow, pointSecLine - pointLine);
      }
    }

    // Display the image using the p5.image function
    p5.draw = () => {
      p5.background("#707070");
      //tween/smooth motion
      w = p5.lerp(w, tow, 1);
      h = p5.lerp(h, toh, 1);

      // Display the image using the p5.image function
      p5.image(img, topx, topy, w, h);
      if (drawLine) {
        line1.draw_line(topx, pointLine, topx + tow, pointLine);
        line1.draw_rect(pointLine);
        line1mouse = line1.rect(pointLine);
      }
      if (drawSecLine) {
        line2.draw_line(topx, pointSecLine, topx + tow, pointSecLine);
        line2.draw_rect(pointSecLine);
        line2mouse = line2.rect(pointSecLine);
        line2.fill_rect();
      }
    };

    p5.doubleClicked = () => {
      if (!isOutSideOfImage()) {
        if (drawLine) {
          drawSecLine = true;
          pointSecLine = p5.mouseY;
        } else {
          pointLine = p5.mouseY;
          drawLine = true;
        }
      }
    };

    p5.mouseReleased = () => {
      line1mousetranslation = false;
      line2mousetranslation = false;

      if (isOutSideOfBounds() || isOutSideOfImage()) return;

      if (!isDragging) {
        /* sem translações - o ponto clidado está idemtificado */
        console.log("canvas coordenates", p5.mouseX, p5.mouseY);
        console.log(
          "image coordenates",
          p5.mouseX / initialScale,
          p5.mouseY / initialScale
        );

        /* Translações */
        console.log("translação a partir de centro", tox - x, toy - y); //centro final menos centro inicial - ok
        console.log(
          "translaçao a partir de ponto inicial",
          topx - px,
          topy - py
        ); // canto sup esq final menos canto sup esq inicial

        /* Saber o ponto clicado depois de translação */
        /* com ponto inicial*/
        console.log("zoomscale2", zoomScale);
        console.log(
          "ponto na imagem inicial - ou seja ponto inicial na translação inversa",
          (p5.mouseX - (topx - px)) / zoomScale,
          (p5.mouseY - (topy - py)) / zoomScale
        );

        console.log(p5.mouseX, topx, px, zoomScale);

        console.log(
          "ponto na imagem real",
          (p5.mouseX - (topx - px)) / (initialScale * zoomScale),
          (p5.mouseY - (topy - py)) / (initialScale * zoomScale)
        );

        console.log("____________________________________________");

        const clickedX = (p5.mouseX - (topx - px)) / (initialScale * zoomScale);
        const clickedY = (p5.mouseY - (topy - py)) / (initialScale * zoomScale);

        dispatch(
          addMark({
            x: clickedX,
            y: clickedY,
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
      console.log("LINE", line1mouse);
      if (p5.mouseIsPressed) {
        if ((line1mouse || line1mousetranslation) && !isOutSideOfImage()) {
          pointLine += p5.mouseY - p5.pmouseY;
          line1mousetranslation = true;
          if (line1.ylimit(pointLine)) {
            //
            if (pointLine < topy) {
              //limite sup
              pointLine = topy;
            } else {
              pointLine = topy + toh;
            }
          }
        } else if (
          (line2mouse || line2mousetranslation) &&
          !isOutSideOfImage()
        ) {
          pointSecLine += p5.mouseY - p5.pmouseY;
          line2mousetranslation = true;
          if (line2.ylimit(pointSecLine)) {
            //
            if (pointSecLine < topy) {
              //limite sup
              pointSecLine = topy;
            } else {
              pointSecLine = topy + toh;
            }
          }
        } else if (!line1mousetranslation && !line2mousetranslation) {
          // Update the values of tox and toy
          tox += p5.mouseX - p5.pmouseX;
          toy += p5.mouseY - p5.pmouseY;
          topx += p5.mouseX - p5.pmouseX;
          topy += p5.mouseY - p5.pmouseY;

          pointLine += p5.mouseY - p5.pmouseY;
          pointSecLine += p5.mouseY - p5.pmouseY;

          // Set isDragging to true
          isDragging = true;
        }
      }

      /* console.log("translação", tox - x, toy - y); */
    };

    p5.mouseWheel = (event) => {
      if (isOutSideOfBounds()) return;
      if (isOutSideOfImage()) return;
      var e = -event.delta;
      if (e > 0) {
        //zoom in
        for (var i = 0; i < e; i++) {
          if (tow * (zoom + 1) > 3 * wi) return; //max zoom
          topx -= zoom * (p5.mouseX - topx);
          topy -= zoom * (p5.mouseY - topy);
          tow *= zoom + 1;
          toh *= zoom + 1;
          pointLine -= zoom * (p5.mouseY - pointLine);
          pointSecLine -= zoom * (p5.mouseY - pointSecLine);
          zoomScale = tow / wi;
          //console.log("Zoom Scale:", topx, topy, toh, tow, zoomScale);
        }

        /*
        for (var i = 0; i < e; i++) {
          if (tow > 10 * myDivRef.current.offsetWidth) return; //max zoom
          tox -= zoom * (p5.mouseX - tox);
          toy -= zoom * (p5.mouseY - toy);
          tow *= zoom + 1;
          toh *= zoom + 1;
        }*/
      }

      if (e < 0) {
        //zoom out
        for (var j = 0; j < -e; j++) {
          if (tow / (zoom + 1) < wi) return; //min zoom
          topx += (zoom / (zoom + 1)) * (p5.mouseX - topx);
          topy += (zoom / (zoom + 1)) * (p5.mouseY - topy);
          toh /= zoom + 1;
          tow /= zoom + 1;
          pointLine += (zoom / (zoom + 1)) * (p5.mouseY - pointLine);
          pointSecLine += (zoom / (zoom + 1)) * (p5.mouseY - pointSecLine);
          zoomScale = tow / wi;
          //console.log("Zoom Scale:", topx, topy, toh, tow, zoomScale);
        }
      }

      /*
      // Change the scale of the image based on the mouse scroll wheel delta
      setScale(scale + event.delta / 1000);
      console.log("scale", scale);
      // Prevent the page from scrolling when the mouse is over the canvas
      return false;*/
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
      // ponto na imagem inicial
      return (
        p5.mouseX > topx - px + tow ||
        p5.mouseX < topx - px ||
        p5.mouseY > topy - py + toh ||
        p5.mouseY < topy - py
      );
    };

    /* translações em touchscreen
    p5.touchMoved = () => {
      // If there are two fingers on the screen, calculate the distance between them
      if (p5.touches.length === 2) {
        const distance = p5.dist(
          p5.touches[0].x,
          p5.touches[0].y,
          p5.touches[1].x,
          p5.touches[1].y
        );

        // Use the distance to adjust the scale factor
        p5.scaleFactor = p5.map(distance, 0, p5.width, 0.5, 2.0);
      }

      // Prevent the default touch behavior
      return false;
    };*/
  };

  return (
    <div className="image-container" ref={myDivRef}>
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
}

export default ImageArea;
