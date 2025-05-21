import { Component, FontOptions, Rect } from '@schaeffler/pdf-generator';

export class LinkBlock extends Component {
  constructor(
    private readonly textValue: string,
    private readonly url: string,
    private readonly fontOptions: FontOptions,
    private readonly color: string
  ) {
    super();
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    const height = this.getMultilineTextHeight(
      this.textValue,
      bounds.width,
      this.fontOptions
    );

    return [true, height];
  }

  public override render(): void {
    super.render();

    const resetTextColor = this.setTextColor(this.color);

    this.text(this.bounds.x, this.bounds.y, this.textValue, {
      fontOptions: this.fontOptions,
      textOptions: { maxWidth: this.bounds.width },
      link: this.url,
    });

    resetTextColor();
  }
}
