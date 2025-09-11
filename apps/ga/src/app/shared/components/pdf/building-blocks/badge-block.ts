import {
  ChipComponent,
  Colors,
  Component,
  Rect,
} from '@schaeffler/pdf-generator';

import { BadgeStyle } from '@ga/features/grease-calculation/calculation-result/models';

export const BADGE = {
  HEIGHT: 10,
  PADDING: 8,
  FONT_SIZE: 6,
};

export interface BadgeConfig {
  text: string;
  style?: BadgeStyle;
}

export class BadgeBlock extends Component {
  constructor(private readonly config: BadgeConfig) {
    super();
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    if (!this.config.text) {
      return [false, 0];
    }

    return [true, 4];
  }

  public override render(): void {
    super.render();

    if (!this.config.text) {
      return;
    }

    this.assertDoc();
    const style = this.getBadgeStyle();

    const chip = new ChipComponent({
      chipText: this.config.text,
      chipStyle: style,
      chipTextStyle: {
        fontSize: BADGE.FONT_SIZE,
        fontStyle: 'bold',
        fontFamily: 'Noto',
      },
    });

    const chipWidth = this.getStringWidth(this.config.text) + BADGE.PADDING;
    chip.setBounds(
      new Rect(this.bounds.x, this.bounds.y, BADGE.HEIGHT, chipWidth)
    );

    chip.setDocument(this._pdfDoc);
    chip.render();
  }

  private getBadgeStyle() {
    switch (this.config.style) {
      case BadgeStyle.Recommended:
        return {
          borderColor: Colors.Success,
          fillColor: Colors.SuccessContainer,
          textColor: Colors.OnSuccessContainer,
        };
      case BadgeStyle.Success:
        return {
          borderColor: Colors.Surface,
          fillColor: Colors.SuccessContainer,
          textColor: Colors.OnSuccessContainer,
        };
      case BadgeStyle.Error:
        return {
          borderColor: Colors.Surface,
          fillColor: Colors.ErrorContainer,
          textColor: Colors.OnErrorContainer,
        };
      case BadgeStyle.Warning:
        return {
          borderColor: Colors.Surface,
          fillColor: Colors.WarningContainer,
          textColor: Colors.OnWarningContainer,
        };
      case BadgeStyle.Miscible:
        return {
          borderColor: Colors.Category2,
          fillColor: Colors.Category2Container,
          textColor: Colors.OnCategory2Container,
        };
      case BadgeStyle.Preferred:
        return {
          borderColor: Colors.Neutral,
          fillColor: Colors.NeutralContainer,
          textColor: Colors.OnNeutralContainer,
        };
      default:
        return {
          borderColor: Colors.DarkGreyVariant,
          fillColor: Colors.DarkGreyVariant,
          textColor: Colors.Surface,
        };
    }
  }
}
