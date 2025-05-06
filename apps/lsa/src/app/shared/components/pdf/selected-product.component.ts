import {
  ChipComponent,
  Colors,
  Component,
  FontOptions,
  Rect,
} from '@schaeffler/pdf-generator';

import { starsIconPrimary } from './constants/pdf-icons';

export interface SelectedProductComponetInterface {
  selectionTitle: string;
  itemTitle: string;
  itemDescription: string;
  idLabel: string;
  idValue: string;
  chipLabel: string;
  productImage: string;
}

export class SelectedProductComponent extends Component {
  private readonly descriptionMaxWidth = 80;
  private readonly verticalSpacing: number = 4;

  private readonly titleStyle = {
    fontStyle: 'bold',
    fontSize: 14,
    fontFamily: 'Noto',
  };

  private readonly valueStyle = {
    fontStyle: 'normal',
    fontSize: 10,
    fontFamily: 'Noto',
  };

  private readonly selectionTitle: string;
  private readonly itemTitle: string;
  private readonly itemDescription: string;
  private readonly idLabel: string;
  private readonly idValue: string;
  private readonly chipLabel: string;
  private readonly productImage: string;

  constructor(data: SelectedProductComponetInterface) {
    super();

    this.selectionTitle = data.selectionTitle;
    this.itemTitle = data.itemTitle;
    this.itemDescription = data.itemDescription;

    this.idLabel = data.idLabel;
    this.idValue = data.idValue;
    this.chipLabel = data.chipLabel;
    this.productImage = data.productImage;
  }

  override evaluate(
    bounds: Rect
  ): [boolean, number, (Component | undefined)?, (Component | undefined)?] {
    super.evaluate(bounds);

    const selectionTitleHeight = this.getTextDimensions(
      this.selectionTitle,
      this.titleStyle
    ).h;

    const itemTitleHeight = this.getTextDimensions(this.itemTitle).h;

    const itemDescription = this.conservativeTextHeight(
      this.itemDescription,
      this.descriptionMaxWidth,
      this.valueStyle
    );

    const itemLabelHeight = this.getTextDimensions(
      this.idLabel,
      this.valueStyle
    ).h;

    const textHeight =
      selectionTitleHeight +
      this.verticalSpacing +
      itemTitleHeight +
      this.verticalSpacing +
      itemDescription +
      this.verticalSpacing +
      itemLabelHeight +
      this.verticalSpacing +
      10;

    const scaledImageBlogHeight =
      this.scaleImage(this.productImage, 50)[1] +
      selectionTitleHeight +
      2 * this.verticalSpacing;
    const actualHeight = Math.max(textHeight, scaledImageBlogHeight);

    const fits = actualHeight <= bounds.height;

    return [
      fits,
      actualHeight,
      fits ? this : undefined,
      fits ? undefined : this,
    ];
  }

  render(): void {
    super.render();
    const initialTextColor = this._doc.getTextColor();

    const imageOffset = 50;

    this.setTextColor(Colors.TextHighEmphasis);
    let xPosition = this.bounds.x;
    let yPosition = this.bounds.y + this.verticalSpacing;

    this.text(xPosition, yPosition, this.selectionTitle, {
      fontOptions: this.titleStyle,
    });

    const textHeight = this.getTextDimensions(
      this.selectionTitle,
      this.titleStyle
    ).h;

    yPosition += textHeight + this.verticalSpacing;

    this.image(this.productImage, xPosition, yPosition, 50);

    xPosition += imageOffset;

    this.text(xPosition, yPosition, this.itemTitle, {
      fontOptions: this.titleStyle,
    });

    this.renderChip(this.bounds.width - 50, yPosition);

    const itemTitleHeight = this.getTextDimensions(
      this.itemTitle,
      this.titleStyle
    ).h;

    yPosition += this.verticalSpacing + itemTitleHeight;

    this.setTextColor(Colors.TextMediumEmphasis);

    this.text(xPosition, yPosition, this.itemDescription, {
      fontOptions: this.valueStyle,
      textOptions: {
        maxWidth: this.descriptionMaxWidth,
      },
    });

    yPosition += this.verticalSpacing + itemTitleHeight + 10;

    this.text(xPosition, yPosition, this.idLabel, {
      fontOptions: this.valueStyle,
    });

    xPosition += this.getTextDimensions(this.idLabel, this.valueStyle).w + 10;

    this.setTextColor(Colors.TextHighEmphasis);
    this.text(xPosition, yPosition, this.idValue, {
      fontOptions: this.valueStyle,
    });

    this.setTextColor(initialTextColor);
  }

  private conservativeTextHeight(
    text: string,
    maxWidth: number,
    font: FontOptions
  ): number {
    const dimen = this.getTextDimensions(text, { ...font, maxWidth } as any);

    return Math.max(dimen.h, this.getMultilineTextHeight(text, maxWidth, font));
  }

  private setTextColor(color: string): void {
    const doc = this.assertDoc();
    doc.setTextColor(color);
  }

  private renderChip(startX: number, startY: number) {
    const chip = new ChipComponent({
      chipText: this.chipLabel.toUpperCase(),
      icon: starsIconPrimary,
    });

    chip.setDocument(this._pdfDoc);
    const chipBounds = new Rect(startX, startY, 100, 50);
    chip.setBounds(chipBounds);

    chip.render();
  }
}
