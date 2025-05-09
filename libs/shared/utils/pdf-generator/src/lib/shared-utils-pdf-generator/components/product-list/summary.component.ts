import {
  Component,
  FontOptions,
  Margins,
  mergeDefaults,
  Rect,
} from '../../core';

interface Style {
  labelText: FontOptions;
  valueText: FontOptions;
  outerSpacing: Margins;
  textSpacing: number;
  align: 'right';
}

interface Props {
  styles?: Partial<Style>;
  data: { label: string; value: string }[];
}
const defaultFont: FontOptions = {
  fontFamily: 'Noto',
  fontSize: 10,
};
const defaultStyles: Style = {
  labelText: {
    ...defaultFont,
    fontSize: 8,
  },
  valueText: {
    ...defaultFont,
    fontStyle: 'bold',
  },
  textSpacing: 1.25,
  outerSpacing: { left: 1, right: 1, top: 1.5, bottom: 1.25 },
  align: 'right',
};

export class ProductListSummary extends Component {
  private readonly data: Props['data'];
  private readonly styles: Style;

  constructor(props: Props) {
    super();
    this.data = props.data.filter((data) => !!data.value);
    this.styles = mergeDefaults(props.styles, defaultStyles);
  }

  override evaluate(bounds: Rect): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);
    if (this.data.length === 0) {
      return [true, 0];
    }

    const textHeight =
      this.getTextDimensions(this.data[0].label, this.styles.labelText).h +
      this.getTextDimensions(this.data[0].value, this.styles.valueText).h;

    const vspace =
      textHeight +
      this.styles.outerSpacing.top +
      this.styles.outerSpacing.bottom +
      this.styles.textSpacing;

    const fits = vspace <= this.bounds.height;
    if (fits) {
      return [true, vspace];
    }

    return [
      false,
      vspace,
      undefined,
      new ProductListSummary({ styles: this.styles, data: this.data }),
    ];
  }

  override render(): void {
    const yStart = this.bounds.y + this.styles.outerSpacing.top;
    let xCursor = this.bounds.BottomRight.x - this.styles.outerSpacing.right;
    for (let i = this.data.length - 1; i >= 0; i -= 1) {
      const data = this.data[i];

      const valueDimen = this.getTextDimensions(
        data.value,
        this.styles.valueText
      );
      const labelDimen = this.getTextDimensions(
        data.label,
        this.styles.labelText
      );
      const effectiveWidth = Math.max(valueDimen.w, labelDimen.w);
      xCursor -= effectiveWidth;

      this.text(xCursor, yStart, data.value!, {
        fontOptions: this.styles.valueText,
      });
      this.text(
        xCursor,
        yStart + valueDimen.h + this.styles.textSpacing,
        data.label,
        { fontOptions: this.styles.labelText }
      );

      xCursor -= this.styles.outerSpacing.left + this.styles.outerSpacing.right;
    }
  }
}
