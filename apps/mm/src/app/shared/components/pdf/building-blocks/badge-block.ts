import {
  ChipComponent,
  Colors,
  Component,
  Rect,
} from '@schaeffler/pdf-generator';

export type BadgeStyle = 'recommended' | 'alternative' | 'custom';
export type BadgePosition = 'top-right' | 'above-title' | 'custom';

export const BADGE = {
  HEIGHT: 10,
  PADDING: 8,
  FONT_SIZE: 6,
};

export interface BadgeConfig {
  textValue: string;
  style?: BadgeStyle;
  position?: BadgePosition;
  customStyle?: {
    borderColor?: string;
    fillColor?: string;
    textColor?: string;
  };
}

export class BadgeBlock extends Component {
  constructor(private readonly config: BadgeConfig) {
    super();
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    if (!this.config.textValue) {
      return [false, 0];
    }

    return [true, 4];
  }

  public override render(): void {
    super.render();

    if (!this.config.textValue) {
      return;
    }

    this.assertDoc();
    const style = this.getBadgeStyle();

    const chip = new ChipComponent({
      chipText: this.config.textValue,
      chipStyle: style,
      chipTextStyle: {
        fontSize: BADGE.FONT_SIZE,
        fontStyle: 'bold',
        fontFamily: 'Noto',
      },
    });

    const chipWidth =
      this.getStringWidth(this.config.textValue) + BADGE.PADDING;
    chip.setBounds(
      new Rect(this.bounds.x, this.bounds.y, chipWidth, BADGE.HEIGHT)
    );

    chip.setDocument(this._pdfDoc);
    chip.render();
  }

  private getBadgeStyle() {
    if (this.config.style === 'recommended') {
      return {
        borderColor: Colors.Primary,
        fillColor: Colors.Primary,
        textColor: Colors.Surface,
      };
    }

    return {
      borderColor: Colors.DarkGreyVariant,
      fillColor: Colors.DarkGreyVariant,
      textColor: Colors.Surface,
    };
  }
}
