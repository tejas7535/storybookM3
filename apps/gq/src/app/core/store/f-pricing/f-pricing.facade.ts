/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { MarketValueDriverDisplayItem } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver-display-item.interface';
import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { Store } from '@ngrx/store';

import { loadMaterialSalesOrg } from '../actions/material-sales-org/material-sales-org.actions';
import { getQuotationCurrency } from '../active-case/active-case.selectors';
import {
  getMaterialSalesOrg,
  getMaterialSalesOrgDataAvailable,
} from '../selectors/material-sales-org/material-sales-org.selector';
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
    this.#store.select(getMaterialSalesOrg),
    this.#store.select(getMaterialSalesOrgDataAvailable),
    this.#store.select(fPricingFeature.getMarketValueDriverForDisplay),
    this.#store.select(fPricingFeature.getAnyMarketValueDriverSelected),
  ]).pipe(
    map(
      ([
        fPricingState,
        currency,
        materialSalesOrg,
        materialSalesOrgDataAvailable,
        marketValueDriversDisplay,
        anyMarketValueDriverSelection,
      ]: [
        FPricingState,
        string,
        MaterialSalesOrg,
        boolean,
        MarketValueDriverDisplayItem[],
        boolean
      ]) => ({
        ...fPricingState,
        currency,
        materialSalesOrg,
        materialSalesOrgAvailable: materialSalesOrgDataAvailable,
        marketValueDriversDisplay,
        anyMarketValueDriverSelection,
      })
    )
  );

  referencePrice$: Observable<number> = this.#store.select(
    fPricingFeature.selectReferencePrice
  );

  materialInformation$: Observable<MaterialInformationExtended[]> =
    this.#store.select(fPricingFeature.getMaterialInformationExtended);

  materialSalesOrg$: Observable<MaterialSalesOrg> =
    this.#store.select(getMaterialSalesOrg);
  materialSalesOrgDataAvailable$: Observable<boolean> = this.#store.select(
    getMaterialSalesOrgDataAvailable
  );

  // #########################################
  // ##########     methods     ##############
  // #########################################

  loadDataForPricingAssistant(gqPositionId: string): void {
    this.#store.dispatch(FPricingActions.loadFPricingData({ gqPositionId }));
    this.#store.dispatch(loadMaterialSalesOrg({ gqPositionId }));
  }
}
