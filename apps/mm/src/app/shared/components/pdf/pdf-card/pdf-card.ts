import { Colors, Component, Rect } from '@schaeffler/pdf-generator';

interface CardProps {
  content: Component[];
  borderRadius?: number;
  backgroundColor?: string;
  padding?: number;
  margin?: number;
  borderColor?: string;
  borderWidth?: number;
  keepTogether?: boolean;
}

export class PdfCardComponent extends Component {
  private readonly content: Component[];
  private readonly borderRadius: number;
  private readonly backgroundColor: string;
  private readonly padding: number;
  private readonly margin: number;
  private readonly borderColor: string;
  private readonly borderWidth: number;
  private readonly keepTogether: boolean;
  private calculatedHeight = 0;
  private fittingContent: Component[] = [];
  private evaluated = false;

  constructor({
    content,
    borderRadius = 8,
    backgroundColor = Colors.Surface,
    padding = 16,
    margin = 0,
    borderColor = Colors.Outline,
    borderWidth = 0.5,
    keepTogether = false,
  }: CardProps) {
    super();
    this.content = content;
    this.borderRadius = borderRadius;
    this.backgroundColor = backgroundColor;
    this.padding = padding;
    this.margin = margin;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    this.keepTogether = keepTogether;
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);

    if (this.isCachedEvaluation(bounds)) {
      return [true, this.calculatedHeight + this.margin];
    }

    this.evaluated = true;

    const contentBounds = this.calculateContentBounds(bounds);

    if (this.keepTogether) {
      const result = this.evaluateKeepTogether(bounds, contentBounds);
      if (result) {
        return result;
      }
    }

    const [fittingComponents, remainingComponents, yOffset] =
      this.evaluateComponents(contentBounds);

    this.fittingContent = fittingComponents;
    this.calculatedHeight = this.calculateHeight(
      fittingComponents,
      bounds,
      yOffset
    );

    if (remainingComponents.length === 0) {
      return [true, this.calculatedHeight + this.margin];
    }

    return this.createSplitComponents(fittingComponents, remainingComponents);
  }

  public override render(): void {
    super.render();

    const doc = this.assertDoc();
    const cardHeight = this.calculatedHeight;

    doc.setFillColor(this.backgroundColor);
    doc.roundedRect(
      this.bounds.x,
      this.bounds.y,
      this.bounds.width,
      cardHeight,
      this.borderRadius,
      this.borderRadius,
      'F'
    );

    if (this.borderWidth > 0) {
      doc.setDrawColor(this.borderColor);
      doc.setLineWidth(this.borderWidth);
      doc.roundedRect(
        this.bounds.x,
        this.bounds.y,
        this.bounds.width,
        cardHeight,
        this.borderRadius,
        this.borderRadius,
        'S'
      );
    }

    for (const component of this.fittingContent) {
      component.render();
    }
  }

  private isCachedEvaluation(bounds: Rect): boolean {
    return (
      this.evaluated &&
      this.bounds.x === bounds.x &&
      this.bounds.y === bounds.y &&
      this.bounds.width === bounds.width &&
      this.bounds.height === bounds.height
    );
  }

  private calculateContentBounds(bounds: Rect): Rect {
    return new Rect(
      bounds.x + this.padding,
      bounds.y + this.padding,
      bounds.height - this.padding * 2,
      bounds.width - this.padding * 2
    );
  }

  private evaluateKeepTogether(
    bounds: Rect,
    contentBounds: Rect
  ): [boolean, number, Component?, Component?] | undefined {
    let totalHeightNeeded = this.padding * 2;
    const tempBounds = new Rect(
      contentBounds.x,
      contentBounds.y,
      Number.MAX_SAFE_INTEGER,
      contentBounds.width
    );

    for (const component of this.content) {
      component.setDocument(this._pdfDoc);
      const [, height] = component.evaluate(
        new Rect(
          tempBounds.x,
          tempBounds.y + totalHeightNeeded - this.padding,
          Number.MAX_SAFE_INTEGER,
          tempBounds.width
        )
      );
      totalHeightNeeded += height;
    }

    if (totalHeightNeeded > bounds.height) {
      const overflow = this.clonePdfCard(this.content);

      return [false, 0, undefined, overflow];
    }

    return undefined;
  }

  private evaluateComponents(
    contentBounds: Rect
  ): [Component[], Component[], number] {
    let yOffset = contentBounds.y;
    const fittingComponents: Component[] = [];
    const remainingComponents: Component[] = [];

    for (const component of this.content) {
      component.setDocument(this._pdfDoc);

      const componentBounds = new Rect(
        contentBounds.x,
        yOffset,
        contentBounds.height - (yOffset - contentBounds.y),
        contentBounds.width
      );

      const [fits, height, fittingPart, overflowPart] =
        component.evaluate(componentBounds);

      if (fits) {
        fittingComponents.push(component);
        yOffset += height;
      } else if (fittingPart) {
        fittingComponents.push(fittingPart);
        yOffset += height;

        if (overflowPart) {
          remainingComponents.push(overflowPart);
        }
      } else {
        remainingComponents.push(component);
      }
    }

    return [fittingComponents, remainingComponents, yOffset];
  }

  private calculateHeight(
    fittingComponents: Component[],
    bounds: Rect,
    yOffset: number
  ): number {
    return fittingComponents.length > 0
      ? yOffset - bounds.y + this.padding
      : this.padding * 2;
  }

  private createSplitComponents(
    fittingComponents: Component[],
    remainingComponents: Component[]
  ): [boolean, number, Component?, Component?] {
    const fittingComponent = this.clonePdfCard(fittingComponents);
    const overflowComponent = this.clonePdfCard(remainingComponents);

    return [
      false,
      this.calculatedHeight + this.margin,
      fittingComponent,
      overflowComponent,
    ];
  }

  private clonePdfCard(components: Component[]): PdfCardComponent | undefined {
    if (!components || components.length === 0) {
      return undefined;
    }

    return new PdfCardComponent({
      content: components,
      borderRadius: this.borderRadius,
      backgroundColor: this.backgroundColor,
      padding: this.padding,
      margin: this.margin,
      borderColor: this.borderColor,
      borderWidth: this.borderWidth,
      keepTogether: this.keepTogether,
    });
  }
}
