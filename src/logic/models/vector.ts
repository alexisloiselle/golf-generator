export default class Vector {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public normalize(): void {
    const length: number = Math.sqrt(this.x * this.x + this.y * this.y);
    if (length > 0) {
      this.x /= length;
      this.y /= length;
    }
  }

  public add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  public substract(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  public mul(factor: number): Vector {
    return new Vector(this.x * factor, this.y * factor);
  }

  public static dot(v1: Vector, v2: Vector): number {
    return v1.x * v2.x + v1.y * v2.y;
  }
}
