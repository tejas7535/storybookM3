import { Component, Rect } from '@schaeffler/pdf-generator';

/**
 * Simple QR code component for PDF generation
 * Displays a QR code image with configurable size and optional padding
 */
export class QrCodeBlock extends Component {
  /**
   * Create a new QR code block
   *
   * @param qrCodeBase64 Base64 encoded QR code image
   * @param size Size of the QR code in PDF units (default: 20)
   * @param padding Padding around the QR code (default: 2)
   */
  constructor(
    private readonly qrCodeBase64: string,
    private readonly size: number = 20,
    private readonly padding: number = 2
  ) {
    super();
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    // Return the total height including padding
    return [true, this.size + this.padding * 2];
  }

  public override render(): void {
    super.render();

    if (!this.qrCodeBase64) {
      console.warn('QR code data is empty, skipping render');

      return;
    }

    try {
      this.image(
        this.qrCodeBase64,
        this.bounds.x + this.padding,
        this.bounds.y + this.padding,
        this.size,
        this.size
      );
    } catch (error) {
      console.error('Error rendering QR code:', error);
    }
  }
}
