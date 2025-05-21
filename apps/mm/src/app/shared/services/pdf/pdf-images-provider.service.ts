/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable @typescript-eslint/prefer-readonly */
/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { firstValueFrom, forkJoin } from 'rxjs';

import { ImageResolverService } from '@schaeffler/pdf-generator';

import { ProductImageResolverService } from '../product-image-resolver.service';
import { ResultDataService } from '../result-data.service';

interface ImageData {
  designation: string;
  imageUrl: string;
  base64?: string;
}

@Injectable()
export class PdfImagesProviderService {
  private readonly dataService = inject(ResultDataService);
  private readonly imagesResolver = inject(ImageResolverService);
  private readonly imageLinkResolver = inject(ProductImageResolverService);

  private _isReady = signal(false);
  public isReady = this._isReady.asReadonly();

  private _resolvedImages = signal<
    Record<string, { url: string; base64?: string }>
  >({});
  public resolvedImages = this._resolvedImages.asReadonly();

  async getImages(): Promise<Record<string, { url: string; base64?: string }>> {
    this._isReady.set(false);
    const designations = this.dataService.imageProductsIds();

    if (!designations || designations.length === 0) {
      this._isReady.set(true);

      return {};
    }

    try {
      const imageRequests = designations.map((id) =>
        this.imageLinkResolver.resolveImageDesignation(id)
      );

      const urlResults = await firstValueFrom(forkJoin(imageRequests));

      const imageMap = designations.reduce(
        (acc, id, index) => {
          acc[id] = { url: urlResults[index] };

          return acc;
        },
        {} as Record<string, { url: string; base64?: string }>
      );

      const imageObjects: ImageData[] = Object.entries(imageMap).map(
        ([designation, data]) => ({
          designation,
          imageUrl: data.url,
        })
      );

      const base64Results = await firstValueFrom(
        this.imagesResolver.fetchImages(imageObjects, 'imageUrl')
      );

      base64Results.forEach((result: ImageData) => {
        if (imageMap[result.designation]) {
          imageMap[result.designation].base64 = result.imageUrl;
        }
      });

      this._resolvedImages.set(imageMap);
      this._isReady.set(true);

      return imageMap;
    } catch (error) {
      console.error('Failed to resolve product images', error);
      this._isReady.set(true);

      return {};
    }
  }

  getImageUrl(designation: string): string | undefined {
    return this._resolvedImages()[designation]?.url;
  }

  getImageBase64(designation: string): string | undefined {
    return this._resolvedImages()[designation]?.base64;
  }
}
