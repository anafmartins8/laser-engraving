export function drawLine(p5, line, x1, x2) {
  p5.strokeWeight(1);
  p5.stroke("#F58000");
  p5.line(x1, line.y, x2, line.y);
}

export function drawTranslationPoint(p5, line, topx, tow, wcontainer) {
  p5.fill(255);
  p5.strokeWeight(1);
  p5.stroke("#F58000");
  let middleCanvasPoint;
  if (topx <= 0 && topx + tow >= wcontainer) {
    middleCanvasPoint = wcontainer / 2;
  } else if (topx > 0) {
    middleCanvasPoint = topx + (wcontainer - topx) / 2;
  } else if (topx + tow < wcontainer) {
    middleCanvasPoint = (tow + topx) / 2;
  }
  p5.rect(middleCanvasPoint - 3, line.y - 3, 6, 6);
  return middleCanvasPoint;
}

export function ylimit(line, topy, py, toh) {
  return line.y > topy - py + toh || line.y < topy - py;
}

export function lineInTranslation(p5, line) {
  return (
    p5.pmouseX > line.translationPoint - 10 &&
    p5.pmouseX < line.translationPoint + 10 &&
    p5.pmouseY > line.y - 10 &&
    p5.pmouseY < line.y + 10
  );
}

export function fillROI(p5, line, topx, tow, yFirstLine) {
  p5.strokeWeight(0);
  p5.fill(245, 128, 0, 30);
  p5.rect(topx, yFirstLine, tow, line.y - yFirstLine);
}
