import {
  CardConfigOptions,
  CardContent,
  Colors,
  ColumnLayout,
  Component,
  DEFAULT_LINK_OPTIONS,
  DEFAULT_TITLE_OPTIONS,
  FONT_SIZES,
  FontOptions,
  Link,
  Rect,
  SPACING,
  TextBlock,
  TwoColumnLayout,
} from '@schaeffler/pdf-generator';

import { QrCodeLinkBlock } from '../building-blocks';

export interface SleeveConnectorCardContentOptions extends CardConfigOptions {
  leftColumnWidth?: number;
  dividerColor?: string;
  dividerGap?: number;
  titleFontOptions?: FontOptions;
  descriptionFontOptions?: FontOptions;
  linkFontOptions?: FontOptions;
  imageWidth?: number;
  imageHeight?: number;
}

export class SleeveConnectorCardContent extends CardContent {
  private readonly content: Component;

  constructor(
    private readonly title: string,
    private readonly description: string,
    private readonly rightColumnTitle: string,
    private readonly rightColumnDescription: string,
    private readonly link: Link,
    options: SleeveConnectorCardContentOptions = {}
  ) {
    super(options);

    const leftColumnWidth = options.leftColumnWidth || 0.31;
    const dividerColor = options.dividerColor || Colors.Outline;
    const dividerGap = options.dividerGap || SPACING.MEDIUM;
    const titleFontOptions = options.titleFontOptions || DEFAULT_TITLE_OPTIONS;
    const linkFontOptions = options.linkFontOptions || DEFAULT_LINK_OPTIONS;
    const leftColumnComponents: Component[] = [];

    const titleBlock = new TextBlock(this.title, titleFontOptions);
    leftColumnComponents.push(titleBlock);

    const descriptionBlock = new TextBlock(
      this.description,
      {
        fontSize: FONT_SIZES.MEDIUM,
      },
      SPACING.TIGHT
    );
    leftColumnComponents.push(descriptionBlock);

    const { text, url, qrCodeBase64 } = this.link;

    const linkBlock = new QrCodeLinkBlock(
      qrCodeBase64,
      text,
      url,
      linkFontOptions,
      Colors.Primary
    );
    leftColumnComponents.push(linkBlock);

    const rightColumnComponents: Component[] = [];

    const rightDescription = new TextBlock(this.rightColumnDescription, {
      fontSize: FONT_SIZES.LARGE,
    });
    rightColumnComponents.push(rightDescription);

    const rightTitle = new TextBlock(this.rightColumnTitle, titleFontOptions);
    rightColumnComponents.push(rightTitle);

    const leftColumn = new ColumnLayout(
      leftColumnComponents,
      SPACING.STANDARD,
      SPACING.NONE
    );

    const rightColumn = new ColumnLayout(
      rightColumnComponents,
      SPACING.STANDARD,
      6.5
    );

    this.content = new TwoColumnLayout(
      leftColumn,
      rightColumn,
      leftColumnWidth,
      dividerGap,
      true,
      dividerColor
    );
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    const contentBounds = new Rect(
      bounds.x + this.padding,
      bounds.y + this.padding,
      bounds.height - this.padding * 2,
      bounds.width - this.padding * 2
    );

    this.content.setDocument(this._pdfDoc);
    const [, height] = this.content.evaluate(contentBounds);

    this.calculatedHeight = height + this.padding * 2;

    return [true, this.calculatedHeight + this.margin];
  }

  public override render(): void {
    super.render();

    const contentBounds = new Rect(
      this.bounds.x + this.padding,
      this.bounds.y + this.padding,
      this.calculatedHeight - this.padding * 2,
      this.bounds.width - this.padding * 2
    );

    this.content.setBounds(contentBounds);
    this.content.render();
  }
}
