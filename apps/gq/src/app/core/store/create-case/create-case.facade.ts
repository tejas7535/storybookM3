import { inject, Injectable } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { ShipToPartyFacade } from '@gq/core/store/ship-to-party/ship-to-party.facade';
import { CustomerId } from '@gq/shared/models/customer/customer-ids.model';
import { MaterialTableItem } from '@gq/shared/models/table/material-table-item-model';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { PLsSeriesRequest } from '@gq/shared/services/rest/search/models/pls-series-request.model';
import { Store } from '@ngrx/store';

import {
  addRowDataItems,
  clearCreateCaseRowData,
  clearCustomer,
  clearOfferType,
  clearPurchaseOrderType,
  clearSectorGpsd,
  clearShipToParty,
  getPLsAndSeries,
  navigateToCaseOverView,
  resetAllAutocompleteOptions,
  resetPLsAndSeries,
  resetProductLineAndSeries,
  setRowDataCurrency,
  setSelectedGpsdGroups,
  setSelectedProductLines,
  setSelectedSeries,
  updateCurrencyOfPositionItems,
  updateRowDataItem,
  validateMaterialsOnCustomerAndSalesOrg,
} from '../actions/create-case/create-case.actions';
import { SalesOrg } from '../reducers/create-case/models/sales-orgs.model';
import { SectorGpsdFacade } from '../sector-gpsd/sector-gpsd.facade';
import {
  getCaseRowData,
  getCreateCustomerCaseDisabled,
  getCustomerConditionsValid,
  getProductLinesAndSeries,
  getProductLinesAndSeriesLoading,
  getSalesOrgs,
  getSalesOrgsOfShipToParty,
  getSelectedCustomerId,
  getSelectedSalesOrg,
} from '../selectors/create-case/create-case.selector';

@Injectable({
  providedIn: 'root',
})
export class CreateCaseFacade {
  private readonly store: Store = inject(Store);
  private readonly sectorGpsdFacade: SectorGpsdFacade =
    inject(SectorGpsdFacade);
  private readonly shipToPartyFacade: ShipToPartyFacade =
    inject(ShipToPartyFacade);

  private readonly quotationService: QuotationService =
    inject(QuotationService);

  customerIdForCaseCreation$ = this.store.select(getSelectedCustomerId);
  customerSalesOrgs$ = this.store.select(getSalesOrgs);
  selectedCustomerSalesOrg$ = this.store.select(getSelectedSalesOrg);
  shipToPartySalesOrgs$ = this.store.select(getSalesOrgsOfShipToParty);

  customerIdentifier$: Observable<CustomerId> = combineLatest([
    this.customerIdForCaseCreation$,
    this.selectedCustomerSalesOrg$,
  ]).pipe(
    map(([customerId, salesOrg]: [string, SalesOrg]) => ({
      customerId,
      salesOrg: salesOrg?.id,
    }))
  );

  newCaseRowData$ = this.store.select(getCaseRowData);
  customerConditionsValid$ = this.store.select(getCustomerConditionsValid);

  getProductLinesAndSeries$ = this.store.select(getProductLinesAndSeries);
  getProductLinesAndSeriesLoading$ = this.store.select(
    getProductLinesAndSeriesLoading
  );

  getCreateCustomerCaseDisabled$ = this.store.select(
    getCreateCustomerCaseDisabled
  );

  // #####################################################################################
  // ###############################     methods     #####################################
  // #####################################################################################

  addRowDataItems(items: MaterialTableItem[]): void {
    this.store.dispatch(addRowDataItems({ items }));
  }
  updateRowDataItem(
    recentData: MaterialTableItem,
    revalidate: boolean = false
  ): void {
    this.store.dispatch(updateRowDataItem({ item: recentData, revalidate }));
  }

  validateMaterialsOnCustomerAndSalesOrg(): void {
    this.store.dispatch(validateMaterialsOnCustomerAndSalesOrg());
  }

  resetCaseCreationInformation(): void {
    this.store.dispatch(navigateToCaseOverView());
    this.store.dispatch(resetAllAutocompleteOptions());
    this.store.dispatch(clearCustomer());
    this.store.dispatch(clearShipToParty());
    this.store.dispatch(clearSectorGpsd());
    this.store.dispatch(clearOfferType());
    this.store.dispatch(clearPurchaseOrderType());
    this.sectorGpsdFacade.resetAllSectorGpsds();
    this.store.dispatch(clearCreateCaseRowData());

    this.store.dispatch(resetPLsAndSeries());
    this.store.dispatch(resetProductLineAndSeries());
    this.store.dispatch(setRowDataCurrency({ currency: undefined }));
    this.shipToPartyFacade.resetAllShipToParties();
  }

  updateCurrencyOfPositionItems(currency: string): void {
    this.store.dispatch(setRowDataCurrency({ currency }));
    this.store.dispatch(updateCurrencyOfPositionItems());
  }

  getQuotationToDate(customerId: CustomerId): Observable<string> {
    return this.quotationService.getQuotationToDateForCaseCreation(customerId);
  }

  getPLsAndSeries(customerFilters: PLsSeriesRequest): void {
    this.store.dispatch(getPLsAndSeries({ customerFilters }));
  }

  selectProductLines(selectedProductLines: string[]): void {
    this.store.dispatch(setSelectedProductLines({ selectedProductLines }));
  }

  selectSeries(selectedSeries: string[]): void {
    this.store.dispatch(setSelectedSeries({ selectedSeries }));
  }

  selectGpsdGroups(selectedGpsdGroups: string[]) {
    this.store.dispatch(setSelectedGpsdGroups({ selectedGpsdGroups }));
  }
}
