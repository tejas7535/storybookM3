import { Component, FontOptions, Rect } from '@schaeffler/pdf-generator';

export interface LinkBlockOptions {
  showUnderline?: boolean;
  extraSpacing?: number;
}

export class LinkBlock extends Component {
  private readonly showUnderline: boolean;
  private readonly extraSpacing: number;

  constructor(
    private readonly textValue: string,
    private readonly url: string,
    private readonly fontOptions: FontOptions,
    private readonly color: string,
    options: LinkBlockOptions = {}
  ) {
    super();
    this.showUnderline = options.showUnderline ?? true;
    this.extraSpacing = options.extraSpacing ?? 0;
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    const height = this.getMultilineTextHeight(
      this.textValue,
      bounds.width,
      this.fontOptions
    );

    return [true, height + this.extraSpacing];
  }

  public override render(): void {
    super.render();

    this.assertDoc();

    const resetTextColor = this.setTextColor(this.color);

    this.renderMultilineLink();

    if (this.showUnderline) {
      this.drawUnderlines();
    }

    resetTextColor();
  }

  private renderMultilineLink(): void {
    const doc = this.assertDoc();

    const resetFontStyle = this.temporaryFontStyle(this.fontOptions);

    const splitLines = this.getSplitTextLines();

    const lineHeightFactor = doc.getLineHeightFactor();
    const fontSize = doc.getFontSize();
    const lineHeight = (fontSize * lineHeightFactor) / doc.internal.scaleFactor;

    splitLines.forEach((line: string, index: number) => {
      const yPosition =
        this.bounds.y +
        fontSize / doc.internal.scaleFactor +
        index * lineHeight;

      doc.textWithLink(line, this.bounds.x, yPosition, { url: this.url });
    });

    if (resetFontStyle) {
      resetFontStyle();
    }
  }

  private drawUnderlines(): void {
    const doc = this.assertDoc();

    const resetFontStyle = this.temporaryFontStyle(this.fontOptions);

    const splitLines = this.getSplitTextLines();

    const lineHeightFactor = doc.getLineHeightFactor();
    const fontSize = doc.getFontSize();
    const lineHeight = (fontSize * lineHeightFactor) / doc.internal.scaleFactor;
    const underlineOffset = 1;

    const originalDrawColor = doc.getDrawColor();
    doc.setDrawColor(this.color);

    splitLines.forEach((line: string, index: number) => {
      const lineWidth = doc.getTextDimensions(line).w;
      const yPosition =
        this.bounds.y +
        fontSize / doc.internal.scaleFactor +
        index * lineHeight +
        underlineOffset;

      doc.line(this.bounds.x, yPosition, this.bounds.x + lineWidth, yPosition);
    });

    doc.setDrawColor(originalDrawColor);
    if (resetFontStyle) {
      resetFontStyle();
    }
  }

  private getSplitTextLines(): string[] {
    const doc = this.assertDoc();

    return doc.splitTextToSize(this.textValue, this.bounds.width) as string[];
  }
}
