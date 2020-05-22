import Point from "./models/point";
import Vector from "./models/vector";

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
const intersect = (
  { x: x1, y: y1 }: Point,
  { x: x2, y: y2 }: Point,
  { x: x3, y: y3 }: Point,
  { x: x4, y: y4 }: Point
) => {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Return a object with the x and y coordinates of the intersection
  const x = x1 + ua * (x2 - x1);
  const y = y1 + ua * (y2 - y1);

  return new Point(x, y);
};

export const generateSvgPath = (points: Point[]) => {
  let path = `M ${points[0].x} ${points[0].y} `;

  for (let i = 0; i < points.length - 3; i++) {
    const lineDir = new Vector(
      points[i + 2].x - points[i].x,
      points[i + 2].y - points[i].y
    );

    const p1 = intersect(
      points[i + 1],
      points[i + 1].add(lineDir),
      points[i],
      points[i].add(new Vector(-lineDir.y, lineDir.x))
    );

    const p2 = points[i + 1];
    if (p1) {
      path = `${path} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y} `;
    } else {
      // parallel
      path = `${path} L ${p2.x} ${p2.y} `;
    }
  }
  {
    const lineDir = new Vector(
      points[0].x - points[points.length - 2].x,
      points[0].y - points[points.length - 2].y
    );
    const p1 = intersect(
      points[points.length - 1],
      points[points.length - 1].add(lineDir),
      points[points.length - 2],
      points[points.length - 2].add(new Vector(-lineDir.y, lineDir.x))
    );

    const p2 = points[points.length - 1];
    if (p1) {
      path = `${path} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y} `;
    } else {
      // parallel
      path = `${path} L ${p2.x} ${p2.y} `;
    }
  }
  {
    const lineDir = new Vector(
      points[1].x - points[points.length - 1].x,
      points[1].y - points[points.length - 1].y
    );
    const p1 = intersect(
      points[0],
      points[0].add(lineDir),
      points[points.length - 1],
      points[points.length - 1].add(new Vector(-lineDir.y, lineDir.x))
    );

    const p2 = points[0];
    if (p1) {
      path = `${path} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y} `;
    } else {
      // parallel
      path = `${path} L ${p2.x} ${p2.y} `;
    }
  }

  return path;
};

export const clearCanvas = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d");
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
};
