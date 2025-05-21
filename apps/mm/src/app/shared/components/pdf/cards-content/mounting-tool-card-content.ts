import {
  Colors,
  Component,
  FontOptions,
  Rect,
} from '@schaeffler/pdf-generator';

import { Link } from '../base-components/base-component';
import {
  BadgeBlock,
  BadgeConfig,
  ImageBlock,
  QrCodeLinkBlock,
  TextBlock,
} from '../building-blocks';
import {
  ColumnLayout,
  RowLayout,
  TwoColumnLayout,
} from '../layout/layout-components';
import {
  CardConfigOptions,
  CardContent,
  DEFAULT_DESC_OPTIONS,
  DEFAULT_LINK_OPTIONS,
  DEFAULT_TITLE_OPTIONS,
  SPACING,
} from './card-content';

export type MountingToolBadgePosition = 'top-right' | 'above-title';

export interface MountingToolBadgeConfig {
  textValue: string;
  style?: 'recommended' | 'alternative';
  position?: MountingToolBadgePosition;
}

export interface MountingToolCardContentOptions extends CardConfigOptions {
  leftColumnWidth?: number;
  dividerColor?: string;
  dividerGap?: number;
  titleFontOptions?: FontOptions;
  descriptionFontOptions?: FontOptions;
  linkFontOptions?: FontOptions;
  imageWidth?: number;
  imageHeight?: number;
}

export class MountingToolCardContent extends CardContent {
  private readonly content: Component;

  constructor(
    private readonly title: string,
    private readonly description: string,
    private readonly link: Link,
    private readonly imageData?: string,
    private readonly badge?: BadgeConfig,
    private readonly options: MountingToolCardContentOptions = {}
  ) {
    super(options);

    const imageWidth = options.imageWidth || 25;
    const leftColumnWidth = options.leftColumnWidth || 0.19; // Increased slightly to reduce right padding
    const dividerColor = options.dividerColor || Colors.Outline;
    const dividerGap = options.dividerGap || SPACING.MEDIUM;
    const titleFontOptions = options.titleFontOptions || DEFAULT_TITLE_OPTIONS;
    const descriptionFontOptions =
      options.descriptionFontOptions || DEFAULT_DESC_OPTIONS;
    const linkFontOptions = options.linkFontOptions || DEFAULT_LINK_OPTIONS;

    const leftComponent = new ImageBlock(
      this.imageData,
      imageWidth,
      this.options.imageHeight
    );

    const rightColumnComponents: Component[] = [];

    const titleBlock = new TextBlock(this.title, titleFontOptions);

    if (this.badge) {
      const badgePosition = this.badge.position || 'top-right';
      const badgeBlock = new BadgeBlock(this.badge);

      if (badgePosition === 'above-title') {
        rightColumnComponents.push(badgeBlock, titleBlock);
      } else {
        const rowLayout = new RowLayout([titleBlock, badgeBlock], 80);
        rightColumnComponents.push(rowLayout);
      }
    } else {
      rightColumnComponents.push(titleBlock);
    }

    const descriptionBlock = new TextBlock(
      this.description,
      descriptionFontOptions
    );

    rightColumnComponents.push(descriptionBlock);

    const { text, url, qrCodeBase64 } = this.link;

    const linkBlock = new QrCodeLinkBlock(
      qrCodeBase64,
      text,
      url,
      linkFontOptions,
      Colors.Primary
    );
    rightColumnComponents.push(linkBlock);

    const rightColumn = new ColumnLayout(
      rightColumnComponents,
      SPACING.STANDARD
    );

    this.content = new TwoColumnLayout(
      leftComponent,
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
