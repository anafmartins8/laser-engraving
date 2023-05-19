export function draw_line(p5, line, x1, x2) {
  p5.strokeWeight(1);
  p5.stroke("#F58000");
  p5.line(x1, line.y, x2, line.y);
}

export function draw_rect(p5, line, topx, tow, wcontainer) {
  p5.fill(255);
  let pointRect = 0.0;
  if (topx <= 0 && topx + tow >= wcontainer) {
    pointRect = wcontainer / 2;
  } else if (topx > 0) {
    pointRect = topx + (wcontainer - topx) / 2;
  } else if (topx + tow < wcontainer) {
    pointRect = (tow + topx) / 2;
  }
  p5.rect(pointRect - 3, line.y - 3, 6, 6);
}

export function ylimit(line, topy, py, toh) {
  return line.y > topy - py + toh || line.y < topy - py;
}

export function rect(p5, line) {
  return (
    p5.pmouseX > line.pointRect - 10 &&
    p5.pmouseX < line.pointRect + 10 &&
    p5.pmouseY > line.y - 10 &&
    p5.pmouseY < line.y + 10
  );
}

export function fill_rect(p5, line, topx, tow, yFirstLine) {
  p5.strokeWeight(0);
  p5.fill(245, 128, 0, 30);
  p5.rect(topx, yFirstLine, tow, line.y - yFirstLine);
}
