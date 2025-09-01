import { Colors } from '../../constants';
import { Component, FontOptions, Rect } from '../../core';

export class TextBlock extends Component {
  private extraSpacing = 0;

  public constructor(
    private readonly textValue: string,
    private readonly fontOptions: FontOptions,
    extraSpacing = 0
  ) {
    super();
    this.extraSpacing = extraSpacing;
  }

  public setExtraSpacing(spacing: number): this {
    this.extraSpacing = spacing;

    return this;
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
    const restoreColor = this.setTextColor(Colors.DarkGreyVariant);

    this.text(this.bounds.x, this.bounds.y, this.textValue, {
      fontOptions: this.fontOptions,
      textOptions: { maxWidth: this.bounds.width },
    });

    restoreColor();
  }
}
