import { Component, FontOptions, Rect } from '../core';

export const HeadingFonts: { [key: string]: FontOptions } = {
  main: {
    fontSize: 12,
    fontFamily: 'Noto',
    fontStyle: 'bold',
  },
  medium: {
    fontSize: 10,
    fontFamily: 'Noto',
    fontStyle: 'bold',
  },
};

interface Props {
  font: FontOptions;
  text: string;
}
export class SectionHeading extends Component {
  private readonly fontPreference: FontOptions;
  private readonly textValue: string;

  constructor(private readonly props: Props) {
    super();
    this.fontPreference = props.font;
    this.textValue = props.text;
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);
    const textHeight = this.getTextDimensions(this.textValue, {
      ...this.fontPreference,
    }).h;
    const fits = this.bounds.height >= textHeight;

    if (fits) {
      return [true, textHeight];
    }

    return [
      false,
      this.bounds.height,
      undefined,
      new SectionHeading(this.props),
    ];
  }

  public override render(): void {
    super.render();
    this.text(this.bounds.x, this.bounds.y, this.textValue, {
      fontOptions: this.fontPreference,
    });
  }
}
