import Point from "./point";
import Spline from "./spline";
import Vector from "./vector";

export enum Ground {
  HOLE,
  GREEN,
  FAIRWAY,
  ROUGH,
  FOREST,
  FLAG_BASE,
  FLAG,
}

export default class Course {
  public height = 780;
  public width = 780;
  public terrain: (Ground | null)[][] = [];

  public fairwayOutline: Point[] = [];
  public roughOutline: Point[] = [];
  public teeCenter: Point;
  public greenCenter: Point;

  constructor() {
    this.initializeArray();
    const basePath = this.generateBasePath();

    const rough = this.generateRough(basePath, this.getAnchors(basePath, 5));
    const fairway = this.generateFairway(
      basePath,
      this.getAnchors(basePath, 2)
    );

    this.roughOutline = this.outlineFromSpline(rough);
    this.fairwayOutline = this.outlineFromSpline(fairway);

    this.teeCenter = basePath[basePath.length - 1];
    this.greenCenter = basePath[0];
    // this.terrain[basePath[0].y - 1][basePath[0].x] = Ground.FLAG_BASE;
    // this.terrain[basePath[0].y - 2][basePath[0].x] = Ground.FLAG_BASE;
    // this.terrain[basePath[0].y - 2][basePath[0].x + 1] = Ground.FLAG;
  }

  private initializeArray(): void {
    for (let i = 0; i < this.height; i++) {
      this.terrain[i] = [];
      for (let j = 0; j < this.width; j++) {
        this.terrain[i][j] = null;
      }
    }
  }

  private generateBasePath(): Point[] {
    const hBound = 240;
    const upperBound = this.getRandomInt(120, 180);
    const lowerBound = this.getRandomInt(120, 180);

    const path: Point[] = [];
    path.push(
      new Point(this.getRandomInt(hBound, this.width - hBound), upperBound)
    );

    let lastMove: Point | undefined = undefined;

    while (path[path.length - 1].y < this.height - lowerBound) {
      const moves = [new Point(-20, 20), new Point(0, 10), new Point(20, 20)];
      let move: Point;

      if (path[path.length - 1].x < hBound) {
        moves[0] = new Point(0, 10);
      }

      if (path[path.length - 1].x > this.width - hBound) {
        moves[2] = new Point(0, 10);
      }

      if (lastMove === undefined || lastMove.x === 0) {
        move = moves[this.getRandomInt(0, 3)];
      } else if (lastMove.x < 0) {
        move = moves[this.getRandomInt(0, 2)];
      } else {
        move = moves[this.getRandomInt(1, 3)];
      }

      path.push(
        new Point(
          path[path.length - 1].x + move.x,
          path[path.length - 1].y + move.y
        )
      );
      lastMove = move;
    }

    return path;
  }

  private getAnchors(path: Point[], count: number): Point[] {
    const interval = Math.floor(path.length / count - 1);
    const anchors: Point[] = [];

    for (let t = 0; t < (count - 1) * interval + 1; t += interval) {
      anchors.push(path[t]);
    }

    anchors.push(path[path.length - 1]);

    return anchors;
  }

  private generateRough(path: Point[], anchors: Point[]): Spline {
    const rough = new Spline();
    let i = 0;
    anchors.forEach((anchor, j) => {
      const widthMin: number = this.getRandomInt(140, 180);
      if (j === 0) rough.points.push(new Point(anchor.x, anchor.y - 100));

      let leftmost: Point = new Point(anchor.x - widthMin, anchor.y);
      let rightmost: Point = new Point(anchor.x + widthMin, anchor.y);

      while (!(path[i].x === anchor.x && path[i].y === anchor.y)) {
        if (path[i].x < leftmost.x) leftmost.x = path[i].x;

        if (path[i].x > rightmost.x) rightmost.x = path[i].x;

        i++;
      }

      rough.points.unshift(leftmost);
      rough.points.push(rightmost);

      if (j === anchors.length - 1)
        rough.points.push(new Point(anchor.x, anchor.y + 80));
    });

    return rough;
  }

  private generateFairway(path: Point[], anchors: Point[]): Spline {
    const widthMin = 50;
    const widthMax = 70;
    const fairway = new Spline();

    for (let i = 0; i < anchors.length; i++) {
      const widthLeft: number = this.getRandomInt(widthMin, widthMax);
      const widthRight: number = this.getRandomInt(widthMin, widthMax);
      let next: number = i + 1;
      let prev: number = i - 1;

      if (i === 0) prev = i;

      if (i === anchors.length - 1) next = i;

      const vect1: Vector = new Vector(
        anchors[next].x - anchors[i].x,
        anchors[next].y - anchors[i].y
      );
      const vect2: Vector = new Vector(
        anchors[i].x - anchors[prev].x,
        anchors[i].y - anchors[prev].y
      );
      vect1.normalize();
      vect2.normalize();

      const bisect: Vector = new Vector(
        -1 * (vect1.y + vect2.y),
        vect1.x + vect2.x
      );
      bisect.normalize();

      fairway.points.unshift(
        new Point(
          Math.floor(anchors[i].x - bisect.x * widthLeft),
          Math.floor(anchors[i].y - bisect.y * widthLeft)
        )
      );
      fairway.points.push(
        new Point(
          Math.floor(anchors[i].x + bisect.x * widthRight),
          Math.floor(anchors[i].y + bisect.y * widthRight)
        )
      );
    }

    return fairway;
  }

  private generateGreen(origin: Point, radius: number): Point[] {
    const points: Point[] = [];
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        if (x * x + y * y < radius * radius) {
          if (x * x + y * y < (radius - 20) * (radius - 20)) {
            points.push(new Point(origin.y + y, origin.x + x));
          }
        }
      }
    }

    return points;
  }

  private outlineFromSpline(spline: Spline): Point[] {
    const array: Point[] = [];
    for (let t = 0; t < spline.points.length; t += 0.2) {
      const pos: Point = spline.getSplinePoint(t, true);
      array.push(new Point(pos.y, pos.x));
    }
    return array;
  }

  private getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
}
