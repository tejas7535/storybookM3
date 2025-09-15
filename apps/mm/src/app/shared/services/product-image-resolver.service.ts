import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, map, of, take, tap } from 'rxjs';

import { environment } from '@mm/environments/environment';

import { EaDeliveryService } from '@schaeffler/engineering-apps-behaviors/utils';

import { ProductImagesResponse } from './api.model';

const IMAGE_RESOLUTION_URL = environment.productImageUrl;
const FALLBACK_IMAGE_URL = `/images/placeholder.png`;

@Injectable({ providedIn: 'root' })
export class ProductImageResolverService {
  private readonly httpService = inject(HttpClient);
  private readonly deliveryService = inject(EaDeliveryService);

  private readonly urlCache = new Map<string, string>();

  private readonly fallbackImageUrl = `${this.deliveryService.assetsPath()}${FALLBACK_IMAGE_URL}`;

  public resolveImageDesignation(designation: string) {
    if (this.urlCache.has(designation)) {
      return of(this.urlCache.get(designation));
    }

    return this.makeImageResolutionRequest([designation]).pipe(
      take(1),
      tap((result) => {
        Object.entries(result.product_images).forEach(
          ([resultDesignation, url]) =>
            this.urlCache.set(resultDesignation, url)
        );
      }),
      map(
        (result) => result.product_images[designation] || this.fallbackImageUrl
      ),
      catchError(() => of(this.fallbackImageUrl))
    );
  }

  private makeImageResolutionRequest(designations: string[]) {
    return this.httpService.post<ProductImagesResponse>(IMAGE_RESOLUTION_URL, {
      bearingDesignations: designations,
    });
  }
}
