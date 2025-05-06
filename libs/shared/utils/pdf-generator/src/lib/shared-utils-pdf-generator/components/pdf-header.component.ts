import { Component } from '../core';
import { FontOptions } from '../core/format';
import { Rect } from '../core/rect';
import { mergeDefaults } from '../core/util';

const LOGO =
  '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';

interface FormatProps {
  title: FontOptions;
  linkText: FontOptions;
  date: FontOptions;
}

export interface PDFHeaderProps {
  reportTitle: string;
  date?: {
    formattedDate?: string;
    dateLocale?: string;
  };
  headerLink?: {
    target?: string;
    linkText?: string;
    showQRCode?: boolean;
  };
  format?: Partial<FormatProps>;
}

const QR_CODE_SIZE = 25;
const VERTICAL_MARGIN = 5;
const LOGO_HEIGHT = 7;

const Defaults: FormatProps = {
  title: {
    fontFamily: 'Noto',
    fontStyle: 'bold',
    fontSize: 14,
  },
  date: {
    fontFamily: 'Noto',
    fontSize: 10,
  },
  linkText: {
    fontFamily: 'Noto',
    fontSize: 8,
  },
};

export class PDFHeader extends Component {
  private readonly creationDate: string;
  private readonly headerLink?: string;
  private readonly headerLinkText?: string;

  private readonly includeQR: boolean = false;
  private readonly reportTitle: string;

  private readonly titleFormat: FontOptions;
  private readonly dateFontFormat: FontOptions;
  private readonly linkTextFormat: FontOptions;

  public constructor(props: PDFHeaderProps) {
    super();

    this.titleFormat = mergeDefaults(
      props.format?.title || {},
      Defaults?.title
    );
    this.dateFontFormat = mergeDefaults(
      props.format?.date || {},
      Defaults?.date
    );
    this.linkTextFormat = mergeDefaults(
      props.format?.linkText || {},
      Defaults?.linkText
    );

    this.reportTitle = props?.reportTitle || 'Untitled report';
    this.creationDate =
      props?.date?.formattedDate ||
      new Intl.DateTimeFormat(props?.date?.dateLocale || 'en', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(Date.now()));

    if (props?.headerLink?.target) {
      this.headerLink = props.headerLink.target;
      this.headerLinkText = props.headerLink.linkText;
      this.includeQR = !!props.headerLink.showQRCode;
    }
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, (Component | undefined)?, (Component | undefined)?] {
    super.evaluate(bounds);
    const verticalSpace = this.getRequiredVerticalSpace();

    return [
      verticalSpace <= bounds.height,
      verticalSpace,
      undefined,
      verticalSpace > bounds.height ? this : undefined,
    ];
  }

  public override render(): void {
    super.render();
    const pdf = this.assertDoc();

    pdf.setFont('Noto');
    let dateTextOffset = LOGO_HEIGHT;

    if (!this.includeQR) {
      this.image(LOGO, this.bounds.x, this.bounds.y, undefined, LOGO_HEIGHT);
    }

    let headerLinkOffsetRight = 0;
    if (this.includeQR) {
      headerLinkOffsetRight = QR_CODE_SIZE + 2;
      // TODO: print QR code

      pdf.rect(
        this.bounds.x + this.bounds.width - QR_CODE_SIZE,
        this.bounds.y,
        QR_CODE_SIZE,
        QR_CODE_SIZE
      );
      dateTextOffset = QR_CODE_SIZE;

      this.image(
        LOGO,
        this.bounds.x,
        this.bounds.y + QR_CODE_SIZE / 2 - LOGO_HEIGHT / 2,
        undefined,
        LOGO_HEIGHT
      );
    }

    if (this.headerLink) {
      const linkText = this.headerLinkText || this.headerLink;
      const textDimensions = this.getTextDimensions(linkText, {
        ...this.linkTextFormat,
      });
      const x =
        this.bounds.BottomRight.x - textDimensions.w - headerLinkOffsetRight;
      const y =
        this.bounds.y +
        (this.includeQR ? QR_CODE_SIZE : LOGO_HEIGHT) / 2 -
        textDimensions.h / 2;

      this.text(x, y, linkText, {
        link: this.headerLink,
        fontOptions: this.linkTextFormat,
      });
    }

    // Creation date
    this.text(
      this.bounds.BottomRight.x -
        this.getTextDimensions(this.creationDate, { ...this.dateFontFormat }).w,
      this.bounds.y + dateTextOffset + VERTICAL_MARGIN,
      this.creationDate,
      { fontOptions: this.dateFontFormat }
    );

    // Report title
    this.text(
      this.bounds.x,
      this.bounds.y + dateTextOffset + VERTICAL_MARGIN,
      this.reportTitle,
      {
        fontOptions: this.titleFormat,
      }
    );
  }

  private getRequiredVerticalSpace() {
    if (this.includeQR) {
      return (
        QR_CODE_SIZE +
        VERTICAL_MARGIN +
        this.getTextDimensions(this.reportTitle, { ...this.titleFormat }).h *
          this._doc!.getLineHeightFactor()
      );
    }

    return (
      LOGO_HEIGHT +
      VERTICAL_MARGIN +
      this.getTextDimensions(this.reportTitle, { ...this.titleFormat }).h *
        this._doc!.getLineHeightFactor()
    );
  }
}
