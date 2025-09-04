import { Component, Rect } from '@schaeffler/pdf-generator';

export interface ImageBlockOptions {
  topPadding?: number;
  leftPadding?: number;
  rightPadding?: number;
  centered?: boolean;
}

export class ImageBlock extends Component {
  private readonly topPadding: number;
  private readonly leftPadding: number;
  private readonly rightPadding: number;
  private readonly centered: boolean;
  private scaledHeight: number;

  constructor(
    private readonly imageData: string,
    private readonly width: number,
    private readonly height?: number,
    options: ImageBlockOptions = {}
  ) {
    super();
    this.scaledHeight = height || 0;
    this.topPadding = options.topPadding ?? 2;
    this.leftPadding = options.leftPadding ?? 0;
    this.rightPadding = options.rightPadding ?? 0;
    this.centered = options.centered ?? false;
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    try {
      const [, scaledHeight] = this.scaleImage(this.imageData, this.width);
      this.scaledHeight = this.height || scaledHeight;
    } catch (error) {
      console.error('Error scaling image:', error);
      this.scaledHeight = this.height || 0;
    }

    // Return the total height including top padding
    return [true, this.scaledHeight + this.topPadding];
  }

  public override render(): void {
    super.render();

    try {
      let xPosition = this.bounds.x + this.leftPadding;

      if (this.centered) {
        const availableWidth =
          this.bounds.width - this.leftPadding - this.rightPadding;
        const imageXOffset = (availableWidth - this.width) / 2;
        xPosition = this.bounds.x + this.leftPadding + imageXOffset;
      }

      this.image(
        this.imageData,
        xPosition,
        this.bounds.y + this.topPadding,
        this.width
      );
    } catch (error) {
      console.error('Error rendering image:', error);
    }
  }
}
