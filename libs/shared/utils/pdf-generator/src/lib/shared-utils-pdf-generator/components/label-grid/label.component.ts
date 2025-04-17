import { Component } from '../../core/component';
import { FontOptions } from '../../core/format';
import { Rect } from '../../core/rect';
import { mergeDefaults } from '../../core/util';

export interface Styles {
  labelStyle: FontOptions;
  valueStyle: FontOptions;
  verticalSpacing: number;
}

export interface LabelValues {
  label: string;
  value: string;
}

export interface Props {
  value: LabelValues;
  styles?: Partial<Styles>;
}

const FontStyles: Styles = {
  labelStyle: {
    fontStyle: 'bold',
    fontSize: 8,
    fontFamily: 'Noto',
  },
  valueStyle: {
    fontStyle: 'normal',
    fontSize: 10,
    fontFamily: 'Noto',
  },
  verticalSpacing: 4,
} as const;

export class GridLabel extends Component {
  private readonly label: string;
  private readonly value: string;

  private readonly labelStyle: FontOptions;
  private readonly valueStyle: FontOptions;

  private readonly verticalSpacing: number;

  constructor({ value, styles }: Props) {
    super();
    this.label = value.label;
    this.value = value.value;
    this.labelStyle = mergeDefaults(styles?.labelStyle, FontStyles.labelStyle);
    this.valueStyle = mergeDefaults(styles?.labelStyle, FontStyles.valueStyle);
    this.verticalSpacing =
      styles?.verticalSpacing || FontStyles.verticalSpacing;
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);
    const maxWidth = this.bounds.width;

    const labelTextHeight = this.conservativeTextHeight(
      this.label,
      maxWidth,
      this.labelStyle
    );
    const valueTextHeight = this.conservativeTextHeight(
      this.value,
      maxWidth,
      this.valueStyle
    );

    const actualHeight =
      labelTextHeight + valueTextHeight + this.verticalSpacing;
    const fits = actualHeight <= bounds.height;

    return [
      fits,
      actualHeight,
      fits ? this : undefined,
      fits ? undefined : this,
    ];
  }

  public override render(): void {
    super.render();
    const doc = this.assertDoc();
    doc.setTextColor('#666666');
    this.text(this.bounds.x, this.bounds.y, this.label, {
      fontOptions: this.labelStyle,
      textOptions: {
        maxWidth: this.bounds.width,
      },
    });

    const textHeight = this.getMultilineTextHeight(
      this.value,
      this.bounds.width,
      this.valueStyle
    );

    doc.setTextColor('#000');
    this.text(
      this.bounds.x,
      this.bounds.BottomRight.y - textHeight,
      this.value,
      {
        fontOptions: this.valueStyle,
      }
    );
  }

  private conservativeTextHeight(
    text: string,
    maxWidth: number,
    font: FontOptions
  ): number {
    const dimen = this.getTextDimensions(text, { ...font, maxWidth });

    return Math.max(dimen.h, this.getMultilineTextHeight(text, maxWidth, font));
  }
}
