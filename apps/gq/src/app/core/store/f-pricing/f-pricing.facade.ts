/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { getQuotationCurrency } from '@gq/core/store/active-case/active-case.selectors';
import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { MarketValueDriverDisplayItem } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver-display-item.interface';
import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { loadMaterialSalesOrg } from '../actions/material-sales-org/material-sales-org.actions';
import { ComparableMaterialsRowData } from '../reducers/transactions/models/f-pricing-comparable-materials.interface';
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
  readonly #actions$ = inject(Actions);

  updateFPricingDataSuccess$: Observable<void> = this.#actions$.pipe(
    ofType(FPricingActions.updateFPricingSuccess)
  );

  fPricingDataComplete$: Observable<FPricingPositionData> = combineLatest([
    this.#store.select(fPricingFeature.selectFPricingState),
    this.#store.select(getQuotationCurrency),
    this.#store.select(getMaterialSalesOrg),
    this.#store.select(getMaterialSalesOrgDataAvailable),
    this.#store.select(fPricingFeature.getMarketValueDriverForDisplay),
    this.#store.select(fPricingFeature.getAnyMarketValueDriverSelected),
    this.#store.select(fPricingFeature.getComparableTransactionsForDisplaying),
    this.#store.select(fPricingFeature.getComparableTransactionsAvailable),
  ]).pipe(
    map(
      ([
        fPricingState,
        currency,
        materialSalesOrg,
        materialSalesOrgDataAvailable,
        marketValueDriversDisplay,
        anyMarketValueDriverSelection,
        comparableTransactionsForDisplay,
        comparableTransactionsAvailable,
      ]: [
        FPricingState,
        string,
        MaterialSalesOrg,
        boolean,
        MarketValueDriverDisplayItem[],
        boolean,
        ComparableMaterialsRowData[],
        boolean
      ]) => ({
        ...fPricingState,
        currency,
        materialSalesOrg,
        materialSalesOrgAvailable: materialSalesOrgDataAvailable,
        marketValueDriversDisplay,
        anyMarketValueDriverSelection,
        comparableTransactionsForDisplay,
        comparableTransactionsAvailable,
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

  comparableTransactionsLoading$: Observable<boolean> = this.#store.select(
    fPricingFeature.selectComparableTransactionsLoading
  );
  fPricingDataLoading$: Observable<boolean> = this.#store.select(
    fPricingFeature.selectFPricingDataLoading
  );

  // #########################################
  // ##########     methods     ##############
  // #########################################

  loadDataForPricingAssistant(gqPositionId: string): void {
    this.#store.dispatch(FPricingActions.loadFPricingData({ gqPositionId }));
    this.#store.dispatch(loadMaterialSalesOrg({ gqPositionId }));
    this.#store.dispatch(
      FPricingActions.loadComparableTransactions({ gqPositionId })
    );
  }

  resetDataForPricingAssistant(): void {
    this.#store.dispatch(FPricingActions.resetFPricingData());
  }

  updateFPricingData(gqPositionId: string) {
    this.#store.dispatch(FPricingActions.updateFPricing({ gqPositionId }));
  }

  setMarketValueDriverSelection(selection: MarketValueDriverSelection) {
    this.#store.dispatch(
      FPricingActions.setMarketValueDriverSelection({ selection })
    );
  }

  changePrice(price: number): void {
    this.#store.dispatch(FPricingActions.changePrice({ price }));
  }
}
