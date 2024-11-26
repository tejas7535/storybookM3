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
    const { minimumRequiredLubricator, recommendedLubricator } =
      response.lubricators;

    const pimCodesWithNullQty = new Set<string>([
      ...this.getLubricatorPimCodesWithNullQty(minimumRequiredLubricator),
      ...this.getLubricatorPimCodesWithNullQty(recommendedLubricator),
    ]);

    const pimCodesWithQty = new Set<string>([
      ...this.getLubricatorPimCodesWithQty(minimumRequiredLubricator),
      ...this.getLubricatorPimCodesWithQty(recommendedLubricator),
    ]);

    this.fetchPriceAndAvailability([...pimCodesWithQty]);

    // cam be used to simulate delay from backend
    // setTimeout(() => {
    //   this.fetchPriceAndAvailability([...pimCodesWithNullQty]);
    // }, 5000);

    this.fetchPriceAndAvailability([...pimCodesWithNullQty]);
  }

  private getPimCodes(
    lubricator: Lubricator,
    filterQty: (qty: number) => boolean
  ): Set<string> {
    const pimCodesSet = new Set<string>();

    lubricator?.bundle
      .filter((item) => filterQty(item.qty))
      .forEach((item) => {
        pimCodesSet.add(item.pim_code);
      });

    return pimCodesSet;
  }

  private getLubricatorPimCodesWithQty(lubricator: Lubricator): Set<string> {
    return this.getPimCodes(lubricator, (qty) => qty > 0);
  }

  private getLubricatorPimCodesWithNullQty(
    lubricator: Lubricator
  ): Set<string> {
    return this.getPimCodes(lubricator, (qty) => qty === 0);
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
