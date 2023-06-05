export function drawMark(p5, mark) {
  p5.strokeWeight(1);
  p5.stroke("#F58000");
  p5.fill(245, 128, 0, 30);
  p5.rect(mark.x, mark.y, mark.w, mark.h);
}

export function drawTranslationPoint1(p5, mark) {
  p5.fill(255);
  p5.strokeWeight(1);
  p5.stroke("#F58000");
  p5.rect(mark.x + mark.w / 2 - 3, mark.y + mark.h / 2 - 3, 6, 6);
}

export function markInTranslation(p5, mark) {
  return (
    p5.pmouseX > mark.x + mark.w / 2 - 10 &&
    p5.pmouseX < mark.x + mark.w / 2 + 10 &&
    p5.pmouseY > mark.y + mark.h / 2 - 10 &&
    p5.pmouseY < mark.y + mark.h / 2 + 10
  );
}
