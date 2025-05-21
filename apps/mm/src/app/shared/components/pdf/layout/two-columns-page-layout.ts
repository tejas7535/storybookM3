import { Component, Rect } from '@schaeffler/pdf-generator';

interface Props {
  leftComponent?: Component;
  rightComponent?: Component;
  columnGap?: number;
  leftColumnWidth?: number; // percentage (0-1)
}

export class TwoColumnPageLayout extends Component {
  private readonly leftComponent?: Component;
  private readonly rightComponent?: Component;
  private readonly columnGap: number;
  private readonly leftColumnWidthPercent: number;

  constructor({
    leftComponent,
    rightComponent,
    columnGap = 10,
    leftColumnWidth = 0.5,
  }: Props) {
    super();
    this.leftComponent = leftComponent;
    this.rightComponent = rightComponent;
    this.columnGap = columnGap;
    this.leftColumnWidthPercent = leftColumnWidth;
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);

    const { leftBounds, rightBounds } = this.calculateColumnBounds(bounds);

    let leftHeight = 0;
    let rightHeight = 0;

    if (this.leftComponent) {
      this.leftComponent.setDocument(this._pdfDoc);
      const [leftFits, leftComponentHeight] =
        this.leftComponent.evaluate(leftBounds);

      if (!leftFits) {
        return [false, 0, undefined, this];
      }

      leftHeight = leftComponentHeight;
    }

    if (this.rightComponent) {
      this.rightComponent.setDocument(this._pdfDoc);
      const [rightFits, rightComponentHeight] =
        this.rightComponent.evaluate(rightBounds);

      if (!rightFits) {
        return [false, 0, undefined, this];
      }

      rightHeight = rightComponentHeight;
    }

    const rowHeight = Math.max(leftHeight, rightHeight);

    return [true, rowHeight];
  }

  public override render(): void {
    super.render();

    if (this.leftComponent) {
      const { leftBounds } = this.calculateColumnBounds(this.bounds);
      this.leftComponent.setBounds(leftBounds);
      this.leftComponent.render();
    }

    if (this.rightComponent) {
      const { rightBounds } = this.calculateColumnBounds(this.bounds);
      this.rightComponent.setBounds(rightBounds);
      this.rightComponent.render();
    }
  }

  private calculateColumnBounds(bounds: Rect): {
    leftBounds: Rect;
    rightBounds: Rect;
  } {
    const leftColumnWidth =
      (bounds.width - this.columnGap) * this.leftColumnWidthPercent;
    const rightColumnWidth = bounds.width - leftColumnWidth - this.columnGap;

    const leftBounds = new Rect(
      bounds.x,
      bounds.y,
      bounds.height,
      leftColumnWidth
    );

    const rightBounds = new Rect(
      bounds.x + leftColumnWidth + this.columnGap,
      bounds.y,
      bounds.height,
      rightColumnWidth
    );

    return { leftBounds, rightBounds };
  }
}
