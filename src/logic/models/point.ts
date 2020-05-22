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

  add(vector: Vector) {
    return new Point(this.x + vector.x, this.y + vector.y);
  }
}
