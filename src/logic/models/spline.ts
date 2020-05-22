import Point from "./point";

// OneLoneCoder @ Github [https://github.com/OneLoneCoder/videos/blob/master/OneLoneCoder_Splines1.cpp]
export default class Spline {
  public points: Point[] = [];

  public getSplinePoint(t: number, bLooped: boolean): Point {
    let p0: number, p1: number, p2: number, p3: number;

    if (!bLooped) {
      p1 = Math.floor(t) + 1;
      p2 = p1 + 1;
      p3 = p2 + 1;
      p0 = p1 - 1;
    } else {
      p1 = Math.floor(t);
      p2 = (p1 + 1) % this.points.length;
      p3 = (p2 + 1) % this.points.length;
      p0 = p1 >= 1 ? p1 - 1 : this.points.length - 1;
    }

    t = t - Math.floor(t);

    const tt: number = t * t;
    const ttt: number = tt * t;

    const q1: number = -ttt + 2.0 * tt - t;
    const q2: number = 3.0 * ttt - 5.0 * tt + 2.0;
    const q3: number = -3.0 * ttt + 4.0 * tt + t;
    const q4: number = ttt - tt;

    const tx: number =
      0.5 *
      (this.points[p0].x * q1 +
        this.points[p1].x * q2 +
        this.points[p2].x * q3 +
        this.points[p3].x * q4);
    const ty: number =
      0.5 *
      (this.points[p0].y * q1 +
        this.points[p1].y * q2 +
        this.points[p2].y * q3 +
        this.points[p3].y * q4);

    return new Point(Math.floor(tx), Math.floor(ty));
  }
}
