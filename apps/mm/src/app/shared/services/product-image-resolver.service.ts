import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, of, take, tap } from 'rxjs';

import { getAssetsPath } from '@mm/core/services/assets-path-resolver/assets-path-resolver.helper';
import { environment } from '@mm/environments/environment';

import { ProductDesignation, ProductImagesResponse } from './api.model';

const IMAGE_RESOLUTION_URL = environment.productImageUrl;
const FALLBACK_IMAGE_URL = `${getAssetsPath()}/images/placeholder.png`;

@Injectable({ providedIn: 'root' })
export class ProductImageResolverService {
  private readonly urlCache = new Map<ProductDesignation, string>();

  constructor(private readonly httpService: HttpClient) {}

  public resolveImageDesignation(designation: ProductDesignation) {
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
      map((result) => result.product_images[designation] || FALLBACK_IMAGE_URL),
      catchError(() => of(FALLBACK_IMAGE_URL))
    );
  }

  private makeImageResolutionRequest(designations: ProductDesignation[]) {
    return this.httpService.post<ProductImagesResponse>(IMAGE_RESOLUTION_URL, {
      bearingDesignations: designations,
    });
  }
}
