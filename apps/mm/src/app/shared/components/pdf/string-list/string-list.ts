/* eslint-disable no-plusplus */

import {
  Colors,
  Component,
  FontOptions,
  Rect,
} from '@schaeffler/pdf-generator';

export enum ListStyle {
  NONE = 'none',
  BULLET = 'bullet',
  NUMBERED = 'numbered',
}

interface StringListProps {
  items: string[];
  fontOptions?: FontOptions;
  lineSpacing?: number;
  listStyle?: ListStyle;
  backgroundColor?: string;
  padding?: number;
  margin?: number;
  startNumber?: number;
}

export class StringListComponent extends Component {
  private readonly items: string[];
  private readonly fontOptions: FontOptions;
  private readonly lineSpacing: number;
  private readonly listStyle: ListStyle;
  private readonly backgroundColor: string;
  private readonly padding: number;
  private readonly margin: number;
  private readonly startNumber: number;

  private fittingItems: string[] = [];
  private calculatedHeight = 0;

  constructor({
    items,
    fontOptions = {},
    lineSpacing = 1.4,
    listStyle = ListStyle.NONE,
    backgroundColor = Colors.Surface,
    padding = 8,
    margin = 0,
    startNumber = 1,
  }: StringListProps) {
    super();

    this.items = items;
    this.fontOptions = fontOptions;
    this.lineSpacing = lineSpacing;
    this.listStyle = listStyle;
    this.backgroundColor = backgroundColor;
    this.padding = padding;
    this.margin = margin;
    this.startNumber = startNumber;
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);

    const fittingItems: string[] = [];
    const remainingItems: string[] = [];

    let yOffset = bounds.y + this.padding;
    const availableWidth = bounds.width - this.padding * 2;

    for (const item of this.items) {
      if (!item) {
        continue;
      }

      const itemHeight = this.getMultilineTextHeight(
        item,
        availableWidth - (this.listStyle === ListStyle.NONE ? 0 : 6),
        this.fontOptions
      );
      const lineHeight = itemHeight + this.lineSpacing;

      if (yOffset + lineHeight <= bounds.y + bounds.height - this.padding) {
        fittingItems.push(item);
        yOffset += lineHeight;
      } else {
        remainingItems.push(item);
      }
    }

    this.fittingItems = fittingItems;

    this.calculatedHeight =
      fittingItems.length > 0
        ? yOffset - bounds.y + this.padding
        : this.padding * 2;

    if (remainingItems.length === 0) {
      return [true, this.calculatedHeight + this.margin];
    }

    const fittingComponent = this.cloneStringList(fittingItems);
    const overflowComponent = this.cloneStringList(
      remainingItems,
      this.listStyle === ListStyle.NUMBERED
        ? this.startNumber + fittingItems.length
        : this.startNumber
    );

    return [
      false,
      this.calculatedHeight + this.margin,
      fittingComponent,
      overflowComponent,
    ];
  }

  public override render(): void {
    super.render();
    const doc = this.assertDoc();

    if (this.backgroundColor) {
      doc.setFillColor(this.backgroundColor);
      doc.rect(
        this.bounds.x,
        this.bounds.y,
        this.bounds.width,
        this.calculatedHeight,
        'F'
      );
    }

    let yOffset = this.bounds.y + this.padding;
    const availableWidth = this.bounds.width - this.padding * 2;

    for (let i = 0; i < this.fittingItems.length; i++) {
      const item = this.fittingItems[i];

      const itemHeight = this.getMultilineTextHeight(
        item,
        availableWidth - (this.listStyle === ListStyle.NONE ? 0 : 6),
        this.fontOptions
      );

      const lineHeight = itemHeight + this.lineSpacing;

      if (this.listStyle === ListStyle.BULLET) {
        const bulletOffset = 6;
        this.text(this.bounds.x + this.padding, yOffset, '•', {
          fontOptions: this.fontOptions,
        });

        this.text(this.bounds.x + this.padding + bulletOffset, yOffset, item, {
          textOptions: { maxWidth: availableWidth - bulletOffset },
          fontOptions: this.fontOptions,
        });
      } else if (this.listStyle === ListStyle.NUMBERED) {
        const numberOffset = 6;
        const number = `${this.startNumber + i}.`;
        this.text(this.bounds.x + this.padding, yOffset, number, {
          fontOptions: this.fontOptions,
        });

        this.text(this.bounds.x + this.padding + numberOffset, yOffset, item, {
          textOptions: { maxWidth: availableWidth - numberOffset },
          fontOptions: this.fontOptions,
        });
      } else {
        this.text(this.bounds.x + this.padding, yOffset, item, {
          textOptions: { maxWidth: availableWidth },
          fontOptions: this.fontOptions,
        });
      }

      yOffset += lineHeight;
    }
  }

  private cloneStringList(
    items: string[],
    startNumber?: number
  ): StringListComponent | undefined {
    if (!items || items.length === 0) {
      return undefined;
    }

    return new StringListComponent({
      items,
      fontOptions: this.fontOptions,
      lineSpacing: this.lineSpacing,
      listStyle: this.listStyle,
      backgroundColor: this.backgroundColor,
      padding: this.padding,
      margin: this.margin,
      startNumber: startNumber || this.startNumber,
    });
  }
}
