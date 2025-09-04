/**
 * QR Code error correction level
 * L - Low (7%)
 * M - Medium (15%)
 * Q - Quartile (25%)
 * H - High (30%)
 */
export type QRErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRCodeOptions {
  errorCorrectionLevel?: QRErrorCorrectionLevel;

  /**
   * Size of QR code in pixels
   */
  width?: number;

  /**
   * Color of QR code (dark parts)
   */
  color?: {
    dark?: string;
    light?: string;
  };

  margin?: number;
}

export interface QrCodeGenerator {
  toDataURL(data: string, options?: QRCodeOptions): Promise<string>;
}
