/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';

import { Lubricator, RecommendationResponse } from '@lsa/shared/models';
import {
  AvailabilityRequestEvent,
  MediasCallbackResponse,
} from '@lsa/shared/models/price-availibility.model';

import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class PriceAvailabilityService implements OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  private readonly priceAndAvailabilityRequestSubject$ =
    new Subject<AvailabilityRequestEvent>();

  private readonly priceAndAvailabilityResponseSubject$ =
    new BehaviorSubject<MediasCallbackResponse>({ items: {} });

  public priceAndAvailabilityRequest$ =
    this.priceAndAvailabilityRequestSubject$.asObservable();

  public priceAndAvailabilityResponse$ =
    this.priceAndAvailabilityResponseSubject$.asObservable();

  constructor(private readonly restService: RestService) {
    this.restService.recommendation$
      .pipe(
        takeUntil(this.destroyed$),
        filter((response): response is RecommendationResponse =>
          this.isRecommendationResponse(response)
        )
      )
      .subscribe((response: RecommendationResponse) => {
        this.handleRecommendationResponse(response);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private handleRecommendationResponse(response: RecommendationResponse): void {
    const minimumRequiredPimCodes = this.getLubricatorPimCodes(
      response.lubricators.minimumRequiredLubricator
    );
    const recommendedPimCodes = this.getLubricatorPimCodes(
      response.lubricators.recommendedLubricator
    );

    const pimCodesSet = new Set<string>([
      ...minimumRequiredPimCodes,
      ...recommendedPimCodes,
    ]);

    this.fetchPriceAndAvailability([...pimCodesSet]);
  }

  private getLubricatorPimCodes(lubricator: Lubricator): Set<string> {
    const pimCodesSet = new Set<string>();

    lubricator?.bundle.forEach((item) => {
      pimCodesSet.add(item.pim_code);
    });

    return pimCodesSet;
  }

  private isRecommendationResponse(
    response: any
  ): response is RecommendationResponse {
    return (
      response && typeof response === 'object' && 'lubricators' in response
    );
  }

  private fetchPriceAndAvailability(pimIds: string[]): void {
    const event: AvailabilityRequestEvent = {
      details: {
        payload: {
          pimIds,
        },
      },
      callback: (result: MediasCallbackResponse) => {
        this.priceAndAvailabilityResponseSubject$.next(result);
      },
    };

    this.priceAndAvailabilityRequestSubject$.next(event);
  }
}
