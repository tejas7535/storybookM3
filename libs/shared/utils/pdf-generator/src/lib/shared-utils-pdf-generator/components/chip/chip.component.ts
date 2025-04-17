import { Colors } from '../../constants/colors.enum';
import { Component } from '../../core';
import { FontOptions } from '../../core/format';
import { ChipComponentData, ChipStyle } from './chip.component.interface';

export const primaryChipStyle: ChipStyle = {
  borderColor: Colors.Primary,
  fillColor: Colors.PrimaryContainer,
  textColor: Colors.OnPrimaryContainer,
} as const;

export const infoChipStyle: ChipStyle = {
  borderColor: Colors.Info,
  fillColor: Colors.InfoContainer,
  textColor: Colors.OnInfoContainer,
} as const;

export const defaultChipTextStyle: FontOptions = {
  fontSize: 8,
  fontFamily: 'Noto',
};

export class ChipComponent extends Component {
  private readonly chipText: string;
  private readonly chipStyle: ChipStyle;
  private readonly chipTextStyle: FontOptions;
  private readonly icon?: string;

  public constructor(data: ChipComponentData) {
    super();
    this.chipText = data.chipText;
    this.chipStyle = data?.chipStyle ?? primaryChipStyle;
    this.chipTextStyle = data?.chipTextStyle ?? defaultChipTextStyle;
    this.icon = data.icon;
  }

  public override render(): void {
    const doc = this.assertDoc();

    const startX = this.bounds.x;
    const startY = this.bounds.y;

    const labelSpacing = 4;
    const verticalSpacing = 2;
    const iconSize = this.icon ? 4 : 0;

    const previousFontStyle = this.temporaryFontStyle(this.chipTextStyle);

    const labelHeight = this.getTextDimensions(this.chipText).h;
    const chipHeight = verticalSpacing + verticalSpacing + labelHeight;
    const chipWidth =
      labelSpacing +
      iconSize +
      labelSpacing +
      this.getStringWidth(this.chipText);

    const originalTextColor = doc.getTextColor();
    doc.setDrawColor(this.chipStyle.borderColor);
    doc.setFillColor(this.chipStyle.fillColor);
    doc.setTextColor(this.chipStyle.textColor);

    doc.roundedRect(
      startX,
      startY - doc.getFontSize() / doc.getLineHeight(),
      chipWidth,
      chipHeight,
      chipHeight / 2,
      chipHeight / 2,
      'FD'
    );

    if (this.icon) {
      this.image(
        this.icon,
        startX + labelSpacing,
        startY + 1,
        iconSize,
        iconSize
      );
    }

    const iconSpacing = this.icon ? verticalSpacing + iconSize : 0;
    this.text(startX + labelSpacing + iconSpacing, startY + 1, this.chipText, {
      fontOptions: this.chipTextStyle,
    });

    doc.setTextColor(originalTextColor);

    previousFontStyle();
  }
}
