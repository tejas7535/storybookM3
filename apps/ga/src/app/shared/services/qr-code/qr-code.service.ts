import { inject, Injectable } from '@angular/core';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as QRCode from 'qrcode';

import { Colors } from '@schaeffler/pdf-generator';

import { GreaseShopService } from '@ga/features/grease-calculation/calculation-result/components/grease-report-shop-buttons/grease-shop.service';
import { PartnerVersion } from '@ga/shared/models';

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

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  private readonly greaseShopService = inject(GreaseShopService);

  async generateGreaseQrCode(
    greaseTitle: string,
    partner?: PartnerVersion,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const shopUrl = this.greaseShopService.getShopUrl(greaseTitle, partner);

    return this.generateQrCodeAsBase64(shopUrl, options);
  }

  async generateMultipleQrCodes(
    items: { data: string; name: string; options?: QRCodeOptions }[]
  ): Promise<{ name: string; base64: string }[]> {
    const results = await Promise.all(
      items.map(async (item) => {
        const base64 = await this.generateQrCodeAsBase64(
          item.data,
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
      console.error(`Error generating QR code:`, error);
      throw error;
    }
  }
}
