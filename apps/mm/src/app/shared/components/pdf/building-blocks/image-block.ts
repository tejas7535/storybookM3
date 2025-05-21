import { Component, Rect } from '@schaeffler/pdf-generator';

export class ImageBlock extends Component {
  private scaledHeight: number;
  private readonly topPadding: number = 7; // Add top padding

  constructor(
    private readonly imageData: string,
    private readonly width: number,
    private readonly height?: number
  ) {
    super();
    this.scaledHeight = height || 0;
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

    return [true, this.scaledHeight + this.topPadding];
  }

  public override render(): void {
    super.render();

    try {
      this.image(
        this.imageData,
        this.bounds.x,
        this.bounds.y + this.topPadding,
        this.width
      );
    } catch (error) {
      console.error('Error rendering image:', error);
    }
  }
}
