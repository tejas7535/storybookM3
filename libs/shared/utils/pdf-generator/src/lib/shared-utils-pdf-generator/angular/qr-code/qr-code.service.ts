import { inject, Injectable } from '@angular/core';

import { Colors } from '../../constants';
import { QRCodeOptions } from './qr-code.interface';
import { QR_CODE_LIB } from './qr-code.token';

@Injectable()
export class QrCodeService {
  private readonly qrGenerator = inject(QR_CODE_LIB, { optional: true });

  public async generateMultipleQrCodes(
    items: { data: string; name: string; options?: QRCodeOptions }[]
  ): Promise<{ name: string; base64: string }[]> {
    if (!this.qrGenerator) {
      this.qrCodeNotAvailableMsg();

      return [];
    }

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

  public async generateQrCodeAsBase64(
    data: string,
    name: string,
    options: QRCodeOptions = {}
  ): Promise<string> {
    if (!this.qrGenerator) {
      this.qrCodeNotAvailableMsg();

      return '';
    }

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
      const dataUrl = await this.qrGenerator.toDataURL(data, {
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

  private qrCodeNotAvailableMsg(): void {
    console.warn(
      'QR Code generator not provided, provide qr code lib as dependency'
    );
  }
}
