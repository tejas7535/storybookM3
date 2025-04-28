import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  of,
  Subject,
  switchMap,
  take,
  tap,
  timeout,
} from 'rxjs';

import { environment } from '@mm/environments/environment';

import { ProductDesignation, ProductImagesResponse } from './api.model';

const IMAGE_RESOLUTION_DEBOUNCE_TIME_MS = 800;
const IMAGE_RESOLUTION_URL = environment.productImageUrl;
const FALLBACK_IMAGE_URL = '/assets/images/placeholder.png';

@Injectable({ providedIn: 'root' })
export class ProductImageResolverService {
  public fetchResult = new Subject();

  private readonly urlCache = new Map<ProductDesignation, string>();
  private designationQueue: ProductDesignation[] = [];

  private readonly queryTrigger = new Subject<ProductDesignation[]>();

  private readonly resolvedImages = this.queryTrigger.pipe(
    distinctUntilChanged(
      (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort())
    ),
    debounceTime(IMAGE_RESOLUTION_DEBOUNCE_TIME_MS),
    switchMap((imageDesignationQueue) =>
      this.makeImageResolutionRequest(imageDesignationQueue)
    ),

    map((response) => {
      for (const [designation, url] of Object.entries(
        response.product_images
      )) {
        this.urlCache.set(designation, url);
      }

      return response.product_images;
    }),
    tap(() => (this.designationQueue = [])),
    tap(() => {
      this.fetchResult.next(this.urlCache);
    })
  );

  constructor(private readonly httpService: HttpClient) {
    this.resolvedImages.subscribe();
  }

  public resolveImageDesignation(designation: ProductDesignation) {
    if (this.urlCache.has(designation)) {
      return of(this.urlCache.get(designation)).pipe(delay(1));
    }
    this.designationQueue.push(designation);
    this.queryTrigger.next(this.designationQueue);

    return this.fetchResult.pipe(
      timeout({ first: 3500 }),
      take(1),
      map(() => {
        const url = this.urlCache.get(designation);

        return url || FALLBACK_IMAGE_URL;
      }),
      catchError(() => of(FALLBACK_IMAGE_URL))
    );
  }

  private makeImageResolutionRequest(designations: ProductDesignation[]) {
    return this.httpService.post<ProductImagesResponse>(IMAGE_RESOLUTION_URL, {
      bearingDesignations: designations,
    });
  }
}
