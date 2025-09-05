/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import {
  Link,
  QrCodeService,
  QRErrorCorrectionLevel,
} from '@schaeffler/pdf-generator';

import { ResultDataService } from '../result-data.service';

export interface QrCodeData {
  /** URL or text to encode in the QR code */
  data: string;

  /** Name identifier for the QR code */
  name: string;

  /** Optional width in pixels */
  width?: number;

  errorCorrectionLevel?: QRErrorCorrectionLevel;
}

@Injectable()
export class PdfProductQrLinkService {
  private readonly qrCodeService = inject(QrCodeService);
  private readonly translocoService = inject(TranslocoService);
  private readonly dataService = inject(ResultDataService);
  private readonly linkCache = new Map<string, Link>();

  // Track loading state
  private readonly _isReady = signal(false);
  public readonly isReady = this._isReady.asReadonly();

  /**
   * Preloads product QR codes from the result data service
   */
  async preloadProductQrCodes(): Promise<void> {
    this._isReady.set(false);

    const productIds = this.dataService.productsLinksWithQrCodeIds();

    if (!productIds || productIds.length === 0) {
      this._isReady.set(true);

      return;
    }

    try {
      const qrCodes: QrCodeData[] = productIds.map((id) => {
        const url = this.getProductMediasUrl(id);

        return {
          data: url,
          name: `${id}`,
          width: 100,
          errorCorrectionLevel: 'M',
        };
      });

      await this.preloadQrCodesWithLinks(qrCodes);
      this._isReady.set(true);
    } catch (error) {
      console.error('Failed to preload product QR codes', error);
      this._isReady.set(true);
    }
  }

  getLink(name: string): Link | undefined {
    return this.linkCache.get(name);
  }

  clearCache(): void {
    this.linkCache.clear();
  }

  private async preloadQrCodesWithLinks(qrCodes: QrCodeData[]): Promise<void> {
    this.clearCache();

    const urlMap = new Map<string, string>();

    qrCodes.forEach((code) => {
      urlMap.set(code.name, code.data);
    });

    const results = await this.qrCodeService.generateMultipleQrCodes(
      qrCodes.map((code) => ({
        data: code.data,
        name: code.name,
        options: {
          width: code.width,
          errorCorrectionLevel: code.errorCorrectionLevel,
        },
      }))
    );

    results.forEach((result) => {
      const url = urlMap.get(result.name) || '';
      this.linkCache.set(result.name, {
        text: this.translocoService.translate('reportResult.viewProductButton'),
        url,
        qrCodeBase64: result.base64,
      });
    });
  }

  private getProductMediasUrl(productId: string): string {
    const baseUrl = this.translocoService.translate(
      'reportResult.mediasBaseUrl'
    );

    return `${baseUrl}/p/${productId}?utm_source=mounting-manager&utm_medium=pdf`;
  }
}
