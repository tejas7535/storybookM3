import { inject, Injectable } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { loadMaterialSalesOrg } from '@gq/core/store/actions/material-sales-org/material-sales-org.actions';
import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { getQuotationCurrency } from '@gq/core/store/active-case/active-case.selectors';
import * as fromActiveCaseSelectors from '@gq/core/store/active-case/active-case.selectors';
import {
  getMaterialSalesOrg,
  getMaterialSalesOrgDataAvailable,
} from '@gq/core/store/selectors/material-sales-org/material-sales-org.selector';
import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { MarketValueDriverDisplayItem } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver-display-item.interface';
import { TableItem } from '@gq/f-pricing/pricing-assistant-modal/models/table-item';
import { ProductType } from '@gq/shared/models';
import { MaterialToCompare } from '@gq/shared/models/f-pricing/material-to-compare.interface';
import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ComparableMaterialsRowData } from '../transactions/models/f-pricing-comparable-materials.interface';
import { FPricingActions } from './f-pricing.actions';
import { fPricingFeature, FPricingState } from './f-pricing.reducer';
import { FPricingPositionData } from './models/f-pricing-position-data.interface';
import { MarketValueDriverWarningLevel } from './models/market-value-driver-warning-level.enum';
import { MaterialInformationExtended } from './models/material-information-extended.interface';

@Injectable({
  providedIn: 'root',
})
export class FPricingFacade {
  readonly #store = inject(Store);
  readonly #actions$ = inject(Actions);
  readonly #activeCaseFacade = inject(ActiveCaseFacade);

  private readonly transformationService = inject(TransformationService);

  updateFPricingDataSuccess$: Observable<void> = this.#actions$.pipe(
    ofType(FPricingActions.updateFPricingSuccess)
  );

  /** Confirming gq or manual price will call the updateQuotationDetails action of activeCase store.
   Provide information about a successful update within the fPricing facade */
  updatePriceSuccess$: Observable<void> =
    this.#activeCaseFacade.quotationDetailUpdateSuccess$;

  fPricingDataComplete$: Observable<FPricingPositionData> = combineLatest([
    this.#store.select(fPricingFeature.selectFPricingState),
    this.#store.select(getQuotationCurrency),
    this.#store.select(getMaterialSalesOrg),
    this.#store.select(getMaterialSalesOrgDataAvailable),
    this.#store.select(fPricingFeature.getComparableTransactionsForDisplaying),
    this.#store.select(fPricingFeature.getComparableTransactionsAvailable),
    this.#store.select(fPricingFeature.getMarketValueDriverForDisplay),
    this.#store.select(fPricingFeature.getAnyMarketValueDriverSelected),
    this.#store.select(fPricingFeature.getAllMarketValueDriverSelected),
    this.#store.select(fPricingFeature.getMarketValueDriverWarningLevel),
    this.#store.select(fPricingFeature.getTechnicalValueDriversForDisplay),
    this.#store.select(fPricingFeature.getSanityChecksForDisplay),
    this.#store.select(fromActiveCaseSelectors.getIsQuotationStatusActive),
  ]).pipe(
    map(
      ([
        fPricingState,
        currency,
        materialSalesOrg,
        materialSalesOrgDataAvailable,
        comparableTransactionsForDisplay,
        comparableTransactionsAvailable,
        marketValueDriversDisplay,
        anyMarketValueDriverSelected,
        allMarketValueDriverSelected,
        marketValueDriverWarningLevel,
        technicalValueDriversForDisplay,
        sanityChecksForDisplay,
        quotationIsActive,
      ]: [
        FPricingState,
        string,
        MaterialSalesOrg,
        boolean,
        ComparableMaterialsRowData[],
        boolean,
        MarketValueDriverDisplayItem[],
        boolean,
        boolean,
        MarketValueDriverWarningLevel,
        TableItem[],
        TableItem[],
        boolean,
      ]) => ({
        ...fPricingState,
        currency,
        materialSalesOrg,
        materialSalesOrgAvailable: materialSalesOrgDataAvailable,
        comparableTransactionsForDisplay,
        comparableTransactionsAvailable,
        marketValueDriversDisplay,
        anyMarketValueDriverSelected,
        allMarketValueDriverSelected,
        marketValueDriverWarningLevel,
        technicalValueDriversForDisplay: technicalValueDriversForDisplay.map(
          (item) => ({
            ...item,
            value: this.transformationService.transformNumberWithUnit(
              (item.value as number) * 100,
              item.editableValueUnit,
              false
            ),
          })
        ),
        sanityChecksForDisplay: sanityChecksForDisplay.map((item) => ({
          ...item,
          value: this.transformationService.transformNumberCurrency(
            item.value as number,
            currency
          ),
        })),
        quotationIsActive,
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

  fPricingCalculationsLoading$: Observable<boolean> = this.#store.select(
    fPricingFeature.selectFPricingCalculationsLoading
  );

  /**  Combination of fPricing loading and quotation detail update state */
  fPricingDataLoading$: Observable<boolean> = combineLatest([
    this.#store.select(fPricingFeature.selectFPricingDataLoading),
    this.#activeCaseFacade.quotationDetailUpdating$,
  ]).pipe(
    map(
      ([fPricingDataLoading, quotationDetailUpdating]) =>
        fPricingDataLoading || quotationDetailUpdating
    )
  );

  materialComparisonLoading$: Observable<boolean> = this.#store.select(
    fPricingFeature.selectMaterialComparisonLoading
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

  triggerCalculations(): void {
    this.#store.dispatch(FPricingActions.triggerFPricingCalculations());
  }
  updateFPricingData(gqPositionId: string) {
    this.#store.dispatch(FPricingActions.updateFPricing({ gqPositionId }));
  }

  updateManualPrice(gqPositionId: string, comment?: string) {
    this.#store.dispatch(
      FPricingActions.updateManualPrice({ gqPositionId, comment })
    );
  }

  setMarketValueDriverSelection(selection: MarketValueDriverSelection) {
    this.#store.dispatch(
      FPricingActions.setMarketValueDriverSelection({ selection })
    );

    this.triggerCalculations();
  }

  changePrice(price: number): void {
    this.#store.dispatch(FPricingActions.changePrice({ price }));
  }

  updateTechnicalValueDriver(technicalValueDriver: TableItem): void {
    this.#store.dispatch(
      FPricingActions.updateTechnicalValueDriver({
        technicalValueDriver,
      })
    );
  }

  loadDataForComparisonScreen(
    referenceMaterialProductType: ProductType,
    referenceMaterial: string,
    materialToCompare: MaterialToCompare
  ) {
    this.#store.dispatch(
      FPricingActions.getComparisonMaterialInformation({
        referenceMaterialProductType,
        referenceMaterial,
        materialToCompare: materialToCompare.number,
      })
    );
  }
}
