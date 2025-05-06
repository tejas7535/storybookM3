import { Point } from './point';

export class Rect {
  public readonly TopLeft: Point;

  public constructor(
    public readonly x: number,
    public readonly y: number,
    public height: number,
    public width: number
  ) {
    this.TopLeft = new Point(x, y);
  }

  public get BottomRight(): Point {
    return new Point(this.TopLeft.x + this.width, this.TopLeft.y + this.height);
  }

  public isWithin(x: number, y: number) {
    return (
      x >= this.TopLeft.x &&
      x <= this.BottomRight.x &&
      y >= this.TopLeft.y &&
      y <= this.TopLeft.y
    );
  }
}
