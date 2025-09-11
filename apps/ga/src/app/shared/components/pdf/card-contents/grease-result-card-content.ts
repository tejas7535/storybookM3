/* eslint-disable max-lines */
import {
  CardContent,
  Colors,
  ColumnLayout,
  Component,
  FontOptions,
  Rect,
  RowLayout,
  TextBlock,
  TwoColumnLayout,
} from '@schaeffler/pdf-generator';

import {
  BadgeStyle,
  PDFGreaseReportResult,
  PDFGreaseResultSection,
  PDFGreaseResultSectionItem,
} from '@ga/features/grease-calculation/calculation-result/models';

import {
  BadgeBlock,
  HorizontalDivider,
  ImageBlock,
  LinkBlock,
  PaddedRow,
  QrCodeBlock,
} from '../building-blocks';

export interface GreaseResultCardContentOptions {
  backgroundColor?: string;
  padding?: number;
  margin?: number;
}

const SPACING = {
  NONE: 0,
  TIGHT: 2,
  STANDARD: 4,
  MEDIUM: 6,
  WIDE: 8,
};

const FONT_SIZES = {
  XXSMALL: 6,
  XSMALL: 7,
  SMALL: 8,
  MEDIUM: 10,
  LARGE: 12,
};

const DEFAULT_TITLE_OPTIONS: FontOptions = {
  fontSize: FONT_SIZES.SMALL,
  fontStyle: 'normal',
  fontFamily: 'Noto',
};

export class GreaseResultCardContent extends CardContent {
  private readonly content: Component;

  constructor(
    private readonly greaseData: PDFGreaseReportResult,
    readonly options: GreaseResultCardContentOptions = {}
  ) {
    super(options);
    const headerSection = this.getHeaderSection();
    const sections: Component[] = [];

    for (let i = 0; i < greaseData.sections.length; i += 1) {
      const section = greaseData.sections[i];

      // Add divider before each section (except the first one)
      if (i > 0) {
        const marginVertical = i === 1 ? 0.7 : 0;
        sections.push(this.createDividerRow(marginVertical));
      }

      const sectionComponent = this.getSectionComponent(section);
      sections.push(sectionComponent);
    }

    this.content = new ColumnLayout(
      [headerSection, ...sections],
      0,
      SPACING.TIGHT,
      1.6 // minimum spacing to avoid overlapping with card rounded corners
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

  private getSectionRow(item: PDFGreaseResultSectionItem): Component {
    const titleFontOptions = {
      ...DEFAULT_TITLE_OPTIONS,
      fontSize: FONT_SIZES.XSMALL,
      fontStyle: 'normal',
    };

    const leftComponents: Component[] = [];

    const titleText = new TextBlock(item.title, titleFontOptions);
    leftComponents.push(titleText);

    const rightComponents: Component[] = [];
    if (item?.badgeClass) {
      const badge = this.createBadge(item.value, item.badgeClass);
      rightComponents.push(badge);
    } else {
      const valueText = new TextBlock(item.value, titleFontOptions);
      rightComponents.push(valueText);
    }

    if (item?.secondaryValue) {
      const secondaryText = new TextBlock(
        item.secondaryValue,
        titleFontOptions
      );
      rightComponents.push(secondaryText);
    }

    if (item?.concept1Data) {
      const arrowImage = new ImageBlock(item.concept1Data.arrowImage, 20, 20, {
        topPadding: SPACING.TIGHT,
        leftPadding: SPACING.WIDE,
        rightPadding: 0,
        centered: false,
      });
      leftComponents.push(arrowImage);

      const durationInfo = new TextBlock(
        item.concept1Data.emptyDuration,
        titleFontOptions
      );

      const arrowSetting = new TextBlock(
        item.concept1Data.arrowSetting,
        titleFontOptions
      );

      rightComponents.push(durationInfo, arrowSetting);
    }

    const leftColumn = new ColumnLayout(leftComponents, SPACING.NONE);

    const rightColumn = new ColumnLayout(rightComponents, SPACING.TIGHT);

    return new TwoColumnLayout(
      leftColumn,
      rightColumn,
      0.6,
      0,
      false,
      Colors.Outline
    );
  }

  private getSectionComponent(section: PDFGreaseResultSection): Component {
    const sections: Component[] = [];

    section.values.forEach((item, index) => {
      const isEven = index % 2 === 0;

      const sectionBlock = this.getSectionRow(item);

      const sectionRow = isEven
        ? this.createEvenSectionRow(sectionBlock)
        : this.createOddSectionRow(sectionBlock);

      sections.push(sectionRow);
    });

    const sectionTitleOptions = {
      ...DEFAULT_TITLE_OPTIONS,
      fontSize: FONT_SIZES.SMALL,
      fontStyle: 'bold',
    };

    const sectionTitle = new TextBlock(
      section.sectionTitle,
      sectionTitleOptions,
      1
    );

    const titleRow = this.createSectionTitleRow(sectionTitle);

    return new ColumnLayout([titleRow, ...sections], SPACING.TIGHT);
  }

  private getHeaderSection(): Component {
    const titleFontOptions = {
      ...DEFAULT_TITLE_OPTIONS,
      fontSize: FONT_SIZES.LARGE,
      fontStyle: 'bold',
    };

    const subtitleFontOptions = {
      ...DEFAULT_TITLE_OPTIONS,
      fontSize: FONT_SIZES.XXSMALL,
      fontStyle: 'normal',
    };

    const leftComponents: Component[] = [];

    const { recommended, miscible, preferred } = this.greaseData || {};
    if (recommended) {
      leftComponents.push(
        this.createBadge(recommended, BadgeStyle.Recommended)
      );
    }

    if (miscible) {
      leftComponents.push(this.createBadge(miscible, BadgeStyle.Miscible));
    }

    if (preferred) {
      leftComponents.push(this.createBadge(preferred, BadgeStyle.Preferred));
    }

    const titleText = new LinkBlock(
      this.greaseData.mainTitle,
      this.greaseData.greaseLink,
      titleFontOptions,
      Colors.Primary
    );

    leftComponents.push(titleText);

    const subtitleText = new TextBlock(
      this.greaseData.subTitle,
      subtitleFontOptions
    );

    leftComponents.push(subtitleText);

    const leftColumn = new ColumnLayout(leftComponents, SPACING.TIGHT);

    const qrCode = new QrCodeBlock(this.greaseData.qrCode, 18, -0.5);

    let qrCodeRow;
    if (this.greaseData.image) {
      const greaseImage = new ImageBlock(this.greaseData.image, 40, 0, {
        leftPadding: -12,
        topPadding: -3,
      });

      qrCodeRow = new RowLayout([greaseImage, qrCode], 0, Colors.Surface);
    } else {
      const imageSpacePlaceholder = new TextBlock(' ', titleFontOptions);

      qrCodeRow = new RowLayout(
        [imageSpacePlaceholder, qrCode],
        0,
        Colors.Surface
      );
    }

    const titleSection = new TwoColumnLayout(
      leftColumn,
      qrCodeRow,
      0.5,
      10,
      false,
      Colors.Outline
    );

    if (this.greaseData.partnerVersionInfo) {
      const poweredBy = new TextBlock(
        this.greaseData.partnerVersionInfo.title,
        {
          ...DEFAULT_TITLE_OPTIONS,
          fontSize: FONT_SIZES.XSMALL,
          fontStyle: 'normal',
        },
        1
      );

      const schaefflerLogo = new ImageBlock(
        this.greaseData.partnerVersionInfo.schaefflerLogo,
        20,
        0,
        {
          topPadding: 0.5,
          leftPadding: -20,
        }
      );

      const row = new RowLayout(
        [poweredBy, schaefflerLogo],
        SPACING.NONE,
        Colors.SurfaceContainer
      );

      const partnerVersionRow = this.createNegativeMarginRow(
        row,
        Colors.SurfaceContainer,
        {
          vertical: 0.7,
          horizontal: SPACING.TIGHT,
        }
      );

      return new ColumnLayout([titleSection, partnerVersionRow], 0);
    }

    return new RowLayout([titleSection]);
  }

  private createBadge(text: string, style: BadgeStyle): BadgeBlock {
    return new BadgeBlock({ text, style });
  }

  private createSectionTitleRow(component: Component): PaddedRow {
    const padding = {
      vertical: 0,
      horizontal: 1.5,
    };
    const color = Colors.Surface;

    return this.createNegativeMarginRow(component, color, padding, -1.5);
  }

  private createEvenSectionRow(component: Component): PaddedRow {
    const color = Colors.Surface;
    const padding = {
      vertical: 0.5,
      horizontal: SPACING.TIGHT,
    };

    return this.createNegativeMarginRow(component, color, padding);
  }

  private createOddSectionRow(component: Component): PaddedRow {
    const color = Colors.SurfaceContainer;
    const padding = {
      vertical: 1,
      horizontal: SPACING.TIGHT,
    };

    return this.createNegativeMarginRow(component, color, padding);
  }

  private createDividerRow(marginVertical?: number): PaddedRow {
    const divider = new HorizontalDivider();

    return this.createNegativeMarginRow(
      divider,
      Colors.Surface,
      {
        vertical: 0.7,
        horizontal: 0,
      },
      0,
      marginVertical
    );
  }

  private createNegativeMarginRow(
    cmp: Component,
    color: Colors,
    padding: {
      vertical: number;
      horizontal: number;
    },
    marginHorizontal?: number,
    marginVertical?: number
  ): PaddedRow {
    const negativeMarginForCardRoundedCorners = -1.7;

    return new PaddedRow(cmp, color, {
      paddingVertical: padding?.vertical,
      paddingHorizontal: padding?.horizontal,
      marginHorizontal: marginHorizontal || negativeMarginForCardRoundedCorners,
      marginVertical: marginVertical || 0,
    });
  }
}
