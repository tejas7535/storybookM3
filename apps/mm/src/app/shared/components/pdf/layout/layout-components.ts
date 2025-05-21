/* eslint-disable no-plusplus */
import { Component, Rect } from '@schaeffler/pdf-generator';

export class ColumnLayout extends Component {
  private readonly topMargin: number;

  constructor(
    private readonly components: Component[],
    private readonly spacing: number = 4,
    topMargin: number = 0
  ) {
    super();
    this.topMargin = topMargin;
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    let totalHeight = this.topMargin;
    let currentY = bounds.y + this.topMargin;

    for (const component of this.components) {
      component.setDocument(this._pdfDoc);

      const componentBounds = new Rect(
        bounds.x,
        currentY,
        bounds.height - totalHeight,
        bounds.width
      );

      const [, height] = component.evaluate(componentBounds);
      const isFirstComponent = component === this.components[0];
      const firstComponentSpacing = isFirstComponent ? 0 : this.spacing;
      totalHeight += height + firstComponentSpacing;
      currentY += height + this.spacing;
    }

    return [true, totalHeight];
  }

  public override render(): void {
    super.render();

    let currentY = this.bounds.y + this.topMargin;

    for (const component of this.components) {
      const [, height] = component.evaluate(
        new Rect(this.bounds.x, currentY, 0, this.bounds.width)
      );

      component.setBounds(
        new Rect(this.bounds.x, currentY, height, this.bounds.width)
      );

      component.render();
      currentY += height + this.spacing;
    }
  }
}

export class RowLayout extends Component {
  private componentWidths: number[] = [];

  constructor(
    private readonly components: Component[],
    private readonly spacing: number = 4
  ) {
    super();
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    const availableWidth = bounds.width;
    const equalWidth =
      (availableWidth - (this.components.length - 1) * this.spacing) /
      this.components.length;

    let maxHeight = 0;
    this.componentWidths = [];

    for (const component of this.components) {
      component.setDocument(this._pdfDoc);

      const componentBounds = new Rect(
        0, // x will be set during render
        bounds.y,
        bounds.height,
        equalWidth
      );

      const [, height] = component.evaluate(componentBounds);
      this.componentWidths.push(equalWidth);
      maxHeight = Math.max(maxHeight, height);
    }

    return [true, maxHeight];
  }

  public override render(): void {
    super.render();

    let currentX = this.bounds.x;

    for (let i = 0; i < this.components.length; i++) {
      const component = this.components[i];
      const width = this.componentWidths[i];

      component.setBounds(
        new Rect(currentX, this.bounds.y, this.bounds.height, width)
      );

      component.render();
      currentX += width + this.spacing;
    }
  }
}

export class TwoColumnLayout extends Component {
  constructor(
    private readonly leftColumn: Component,
    private readonly rightColumn: Component,
    private readonly leftColumnWidth: number = 0.5, // as a proportion of total width (0-1)
    private readonly columnGap: number = 8,
    private readonly drawDivider: boolean = false,
    private readonly dividerColor: string = '#000000'
  ) {
    super();
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    const leftColumnWidth = bounds.width * this.leftColumnWidth;
    const rightColumnWidth = bounds.width - leftColumnWidth - this.columnGap;

    this.leftColumn.setDocument(this._pdfDoc);
    this.rightColumn.setDocument(this._pdfDoc);

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

    const [, leftHeight] = this.leftColumn.evaluate(leftBounds);
    const [, rightHeight] = this.rightColumn.evaluate(rightBounds);

    return [true, Math.max(leftHeight, rightHeight)];
  }

  public override render(): void {
    super.render();

    const leftColumnWidth = this.bounds.width * this.leftColumnWidth;
    const rightColumnWidth =
      this.bounds.width - leftColumnWidth - this.columnGap;

    const leftBounds = new Rect(
      this.bounds.x,
      this.bounds.y,
      this.bounds.height,
      leftColumnWidth
    );

    const rightBounds = new Rect(
      this.bounds.x + leftColumnWidth + this.columnGap,
      this.bounds.y,
      this.bounds.height,
      rightColumnWidth
    );

    this.leftColumn.setBounds(leftBounds);
    this.rightColumn.setBounds(rightBounds);

    // Draw divider if requested
    if (this.drawDivider) {
      const doc = this.assertDoc();
      const dividerX = this.bounds.x + leftColumnWidth + this.columnGap / 2;

      doc.setDrawColor(this.dividerColor);
      doc.setLineWidth(0.5);
      doc.line(
        dividerX,
        this.bounds.y,
        dividerX,
        this.bounds.y + this.bounds.height
      );
    }

    this.leftColumn.render();
    this.rightColumn.render();
  }
}
