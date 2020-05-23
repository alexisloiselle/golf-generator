import Vector from "./vector";

export default class Point {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toVector(): Vector {
    return new Vector(this.x, this.y);
  }

  add(vector: Vector | Point) {
    return new Point(this.x + vector.x, this.y + vector.y);
  }

  substract(v: Vector | Point) {
    return new Point(this.x - v.x, this.y - v.y);
  }

  mul(f: number) {
    return new Point(this.x * f, this.y * f);
  }

  div(divider: number) {
    return new Point(this.x / divider, this.y / divider);
  }
}
