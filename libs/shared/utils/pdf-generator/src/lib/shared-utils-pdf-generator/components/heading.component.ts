import { Colors } from '../constants';
import { Component, FontOptions, Margins, Rect } from '../core';

export const HeadingFonts: { [key: string]: FontOptions } = {
  main: {
    fontSize: 10,
    fontFamily: 'Noto',
  },
  medium: {
    fontSize: 8,
    fontFamily: 'Noto',
  },
};

interface Props {
  font?: FontOptions;
  text: string;
  underline?: boolean;
  strokeWidth?: number;
  dividerColor?: string;
  spacing?: Margins;
  textColor?: string;
}
export class SectionHeading extends Component {
  private readonly fontPreference: FontOptions;
  private readonly textValue: string;

  private readonly spacing: Margins;
  private readonly underline: boolean;
  private readonly strokeWidth: number;
  private readonly dividerColor: string;
  private readonly textColor: string;

  constructor(private readonly props: Props) {
    super();
    this.fontPreference = props.font || HeadingFonts['main'];
    this.textValue = props.text;
    this.underline = props.underline ?? true;
    this.strokeWidth = props.strokeWidth || 0.5;
    this.spacing = props.spacing || {
      left: 2,
      top: 1.15,
      right: 2,
      bottom: 2.5,
    };
    this.dividerColor = props.dividerColor || '#d0d7db';
    this.textColor = props.textColor || Colors.DarkGreyVariant;
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);
    const textHeight = this.getTextDimensions(this.textValue, {
      ...this.fontPreference,
    }).h;
    const vSpace = this.spacing.top + this.spacing.bottom;
    const fits = this.bounds.height >= textHeight + vSpace + this.strokeWidth;

    if (fits) {
      return [true, textHeight + vSpace + this.strokeWidth];
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
    const doc = this.assertDoc();
    const textHeight = this.getTextDimensions(
      this.textValue,
      this.fontPreference
    ).h;

    const resetTextColor = this.setTextColor(this.textColor);

    this.text(
      this.bounds.x + this.spacing.left,
      this.bounds.y + this.spacing.top,
      this.textValue,
      {
        fontOptions: this.fontPreference,
      }
    );

    resetTextColor();

    if (this.underline) {
      const ycoord =
        this.bounds.y + this.spacing.top + this.spacing.bottom + textHeight;
      doc.stroke();
      doc.setDrawColor(this.dividerColor);
      doc.setLineWidth(this.strokeWidth);
      doc.line(this.bounds.x, ycoord, this.bounds.BottomRight.x, ycoord);
    }
  }
}
