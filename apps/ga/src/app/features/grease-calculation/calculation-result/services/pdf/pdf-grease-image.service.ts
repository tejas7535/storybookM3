import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { firstValueFrom } from 'rxjs';

import { HashMap, TranslocoService } from '@jsverse/transloco';

import { ImageResolverService } from '@schaeffler/pdf-generator';

import { CalculationParametersFacade } from '@ga/core/store';
import { PartnerVersion } from '@ga/shared/models';

import { PDFPartnerVersionHeaderInfo } from '../../models';

@Injectable({ providedIn: 'root' })
export class PdfGreaseImageService {
  private readonly imageResolverService = inject(ImageResolverService);
  private readonly translocoService = inject(TranslocoService);
  private readonly parametersFacade = inject(CalculationParametersFacade);

  private readonly schaefflerGreases = toSignal(
    this.parametersFacade.schaefflerGreases$
  );

  /**
   * Retrieves the base64 encoded image for a specific grease
   */
  public async getGreaseImageBase64(
    greaseName: string
  ): Promise<string | undefined> {
    try {
      const schaefflerGreases = this.schaefflerGreases();
      const greaseData = schaefflerGreases?.find(
        (grease) => grease.name === greaseName
      );

      let imageUrl: string | undefined;

      if (greaseData?.data?.imageUrl) {
        imageUrl = greaseData.data.imageUrl;
      }

      if (!imageUrl) {
        return undefined;
      }

      const imageWithUrl = { imageUrl };
      const base64Result = await firstValueFrom(
        this.imageResolverService.fetchImageObject(imageWithUrl, 'imageUrl')
      );

      return base64Result.imageUrl;
    } catch (error) {
      console.warn(`Failed to load image for grease ${greaseName}:`, error);

      return undefined;
    }
  }

  /**
   * Gets partner version header information including logos
   */
  public async getPartnerVersionHeaderInfo(
    partnerVersion: `${PartnerVersion}`
  ): Promise<PDFPartnerVersionHeaderInfo | undefined> {
    if (partnerVersion) {
      return {
        title: this.getTranslatedTitle('poweredBy'),
        schaefflerLogo: await firstValueFrom(
          this.imageResolverService.readImageFromAssets(
            '/assets/images/schaeffler-logo.png'
          )
        ),
      };
    }

    return undefined;
  }

  /**
   * Gets the concept1 arrow image based on duration
   */
  public async getConcept1ArrowImage(duration: number): Promise<string> {
    const path = '/assets/images/pdf/setting_';
    const imagePath = duration
      ? `${path}${duration}.png`
      : `${path}disabled.png`;

    const image = await firstValueFrom(
      this.imageResolverService.readImageFromAssets(imagePath)
    );

    return image;
  }

  /**
   * Helper method to load any image from assets
   */
  public async loadImageFromAssets(imagePath: string): Promise<string> {
    return firstValueFrom(
      this.imageResolverService.readImageFromAssets(imagePath)
    );
  }

  private getTranslatedTitle(translationKey: string, params?: HashMap): string {
    return this.translocoService.translate(
      `calculationResult.${translationKey}`,
      params
    );
  }
}
