/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getQuotationCurrency } from '../active-case/active-case.selectors';
import { FPricingActions } from './f-pricing.actions';
import { fPricingFeature, FPricingState } from './f-pricing.reducer';
import { FPricingPositionData } from './models/f-pricing-position-data.interface';
import { MaterialInformationExtended } from './models/material-information-extended.interface';
@Injectable({
  providedIn: 'root',
})
export class FPricingFacade {
  readonly #store = inject(Store);

  fPricingDataComplete$: Observable<FPricingPositionData> = combineLatest([
    this.#store.select(fPricingFeature.selectFPricingState),
    this.#store.select(getQuotationCurrency),
  ]).pipe(
    map(([fPricingState, currency]: [FPricingState, string]) => ({
      ...fPricingState,
      currency,
    }))
  );

  referencePrice$: Observable<number> = this.#store.select(
    fPricingFeature.selectReferencePrice
  );

  materialInformation$: Observable<MaterialInformationExtended[]> =
    this.#store.select(fPricingFeature.getMaterialInformationExtended);

  // #########################################
  // ##########     methods     ##############
  // #########################################

  loadDataForPricingAssistant(gqPositionId: string): void {
    this.#store.dispatch(FPricingActions.loadFPricingData({ gqPositionId }));
  }
}
