import {
  Colors,
  Component,
  FontOptions,
  Rect,
} from '@schaeffler/pdf-generator';

import { linkArrowPrimary } from '../constants/pdf-icons';

/**
 * Component that displays a QR code alongside a link
 * If no QR code is provided, only the link will be displayed
 */
export class QrCodeLinkBlock extends Component {
  private readonly hasQrCode: boolean;

  /**
   * Create a new QR code with link component
   *
   * @param qrCodeBase64 Base64 encoded QR code image (optional)
   * @param linkText Text to display for the link
   * @param url URL for both the QR code and link
   * @param fontOptions Font options for the link text
   * @param linkColor Color for the link text
   * @param qrCodeSize Size of the QR code in PDF units
   * @param spacing Spacing between QR code and link
   * @param arrowSize Size of the arrow icon in PDF units
   */
  constructor(
    private readonly qrCodeBase64: string | undefined,
    private readonly linkText: string,
    private readonly url: string,
    private readonly fontOptions: FontOptions,
    private readonly linkColor: string = Colors.Primary,
    private readonly qrCodeSize: number = 19,
    private readonly spacing: number = 2,
    private readonly arrowSize: number = 4
  ) {
    super();
    this.hasQrCode = !!qrCodeBase64;
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    const reducedArrowSpacing = Math.max(1, this.spacing - 1);
    const arrowWidth = this.arrowSize;
    const availableWidth = this.hasQrCode
      ? bounds.width -
        this.qrCodeSize -
        this.spacing -
        reducedArrowSpacing -
        arrowWidth
      : bounds.width - reducedArrowSpacing - arrowWidth;

    // Get the text height
    const linkTextHeight = this.getMultilineTextHeight(
      this.linkText,
      availableWidth,
      this.fontOptions
    );

    // Height will be the maximum of the QR code size (if present) and the text height
    const height = this.hasQrCode
      ? Math.max(this.qrCodeSize, linkTextHeight)
      : linkTextHeight;

    return [true, height];
  }

  public override render(): void {
    super.render();

    const resetTextColor = this.setTextColor(this.linkColor);

    const textX = this.hasQrCode
      ? this.bounds.x + this.qrCodeSize + this.spacing
      : this.bounds.x;

    const reducedArrowSpacing = Math.max(1, this.spacing - 1);
    const arrowWidth = this.arrowSize;
    const maxWidth = this.hasQrCode
      ? this.bounds.width -
        this.qrCodeSize -
        this.spacing -
        reducedArrowSpacing -
        arrowWidth
      : this.bounds.width - reducedArrowSpacing - arrowWidth;

    const textHeight = this.getMultilineTextHeight(
      this.linkText,
      maxWidth,
      this.fontOptions
    );

    const textY = this.hasQrCode
      ? this.bounds.y + this.qrCodeSize / 2 - textHeight / 2 // Center text vertically with QR code
      : this.bounds.y;

    if (this.hasQrCode && this.qrCodeBase64) {
      this.image(
        this.qrCodeBase64,
        this.bounds.x,
        this.bounds.y,
        this.qrCodeSize,
        this.qrCodeSize
      );
    }

    this.text(textX, textY, this.linkText, {
      fontOptions: this.fontOptions,
      textOptions: { maxWidth },
      link: this.url,
    });

    // Calculate the arrow position
    const textDimensions = this.getTextDimensions(this.linkText, {
      ...this.fontOptions,
      maxWidth,
    });
    const textWidth = textDimensions.w;

    const singleLineHeight = this.getTextDimensions('View Product', {
      ...this.fontOptions,
      maxWidth: 9999, // Ensure it fits in a single line
    }).h;

    // Only show arrow if the text fits in a single line
    const isMultiline = textHeight > singleLineHeight * 1.2;

    if (!isMultiline) {
      const arrowY = textY + textHeight / 2 - this.arrowSize / 2 + 0.5;

      this.image(
        linkArrowPrimary,
        textX + textWidth + reducedArrowSpacing,
        arrowY,
        this.arrowSize,
        this.arrowSize
      );
    }

    resetTextColor();
  }
}
