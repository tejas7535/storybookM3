import { Injectable } from '@angular/core';

import * as QRCode from 'qrcode';

import { Colors } from '@schaeffler/pdf-generator';

export interface QRCodeOptions {
  /**
   * QR Code error correction level
   * L - Low (7%)
   * M - Medium (15%)
   * Q - Quartile (25%)
   * H - High (30%)
   */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';

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

@Injectable()
export class QrCodeService {
  async generateMultipleQrCodes(
    items: { data: string; name: string; options?: QRCodeOptions }[]
  ): Promise<{ name: string; base64: string }[]> {
    const results = await Promise.all(
      items.map(async (item) => {
        const base64 = await this.generateQrCodeAsBase64(
          item.data,
          item.name,
          item.options
        );

        return {
          name: item.name,
          base64,
        };
      })
    );

    return results;
  }

  async generateQrCodeAsBase64(
    data: string,
    name: string,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const defaultOptions: QRCodeOptions = {
      errorCorrectionLevel: 'M',
      width: 200,
      margin: 4,
      color: {
        dark: '#000000',
        light: Colors.Surface,
      },
    };

    const qrOptions = { ...defaultOptions, ...options };

    try {
      const dataUrl = await QRCode.toDataURL(data, {
        errorCorrectionLevel: qrOptions.errorCorrectionLevel,
        width: qrOptions.width,
        margin: qrOptions.margin,
        color: qrOptions.color,
      });

      return dataUrl;
    } catch (error) {
      console.error(`Error generating QR code for ${name}:`, error);
      throw error;
    }
  }
}
