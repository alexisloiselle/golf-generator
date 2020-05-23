import Point from "./models/point";

export const generateSvgPath = (points: Point[]) => {
  let path = `M ${points[0].x} ${points[0].y} `;
  const isLengthEven = points.length % 2 === 0;

  // points
  for (let i = 0; i < points.length - (isLengthEven ? 3 : 2); i += 2) {
    const p1 = points[i + 2];
    const midPoint = points[i].add(points[i + 2]).div(2);
    const p0 = points[i + 1].add(points[i + 1].substract(midPoint));
    path = `${path} Q ${p0.x} ${p0.y} ${p1.x} ${p1.y} `;
  }

  //  last
  if (isLengthEven) {
    const p1 = points[0];
    const midPoint = points[points.length - 2].add(points[0]).div(2);
    const p0 = points[points.length - 1].add(
      points[points.length - 1].substract(midPoint)
    );
    path = `${path} Q ${p0.x} ${p0.y} ${p1.x} ${p1.y}`;
  }

  return path;
};
