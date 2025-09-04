import { Component, Rect, SPACING } from '@schaeffler/pdf-generator';

// Enhanced wrapper to add configurable padding and margins around content with background
export class PaddedRow extends Component {
  constructor(
    private readonly content: Component,
    private readonly backgroundColor: string,
    private readonly options: {
      paddingVertical?: number;
      paddingHorizontal?: number;
      marginVertical?: number;
      marginHorizontal?: number;
      borderRadius?: number; // Add border radius support
    } = {}
  ) {
    super();
  }

  private get paddingVertical(): number {
    return this.options.paddingVertical ?? SPACING.TIGHT;
  }

  private get paddingHorizontal(): number {
    return this.options.paddingHorizontal ?? SPACING.TIGHT;
  }

  private get marginVertical(): number {
    return this.options.marginVertical ?? 0;
  }

  private get marginHorizontal(): number {
    return this.options.marginHorizontal ?? 0;
  }

  private get borderRadius(): number {
    return this.options.borderRadius ?? 0;
  }

  public evaluate(bounds: Rect): [boolean, number] {
    const contentBounds = new Rect(
      bounds.x + this.marginHorizontal + this.paddingHorizontal,
      bounds.y + this.marginVertical + this.paddingVertical,
      bounds.height - (this.marginVertical + this.paddingVertical) * 2,
      bounds.width - (this.marginHorizontal + this.paddingHorizontal) * 2
    );

    this.content.setDocument(this._pdfDoc);
    const [, height] = this.content.evaluate(contentBounds);

    return [true, height + (this.paddingVertical + this.marginVertical) * 2];
  }

  public render(): void {
    const doc = this.assertDoc();

    // Draw background with margins (background doesn't extend into margin area)
    const bgX = this.bounds.x + this.marginHorizontal;
    const bgY = this.bounds.y + this.marginVertical;
    const bgWidth = this.bounds.width - this.marginHorizontal * 2;
    const bgHeight = this.bounds.height - this.marginVertical * 2;

    doc.setFillColor(this.backgroundColor);

    if (this.borderRadius > 0) {
      doc.roundedRect(
        bgX,
        bgY,
        bgWidth,
        bgHeight,
        this.borderRadius,
        this.borderRadius,
        'F'
      );
    } else {
      doc.rect(bgX, bgY, bgWidth, bgHeight, 'F');
    }

    // Render content with padding and margins
    const contentBounds = new Rect(
      this.bounds.x + this.marginHorizontal + this.paddingHorizontal,
      this.bounds.y + this.marginVertical + this.paddingVertical,
      this.bounds.height - (this.marginVertical + this.paddingVertical) * 2,
      this.bounds.width - (this.marginHorizontal + this.paddingHorizontal) * 2
    );

    this.content.setBounds(contentBounds);
    this.content.render();
  }
}
