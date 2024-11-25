import { inject, Injectable } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { CustomerId } from '@gq/shared/models/customer/customer-ids.model';
import { MaterialTableItem } from '@gq/shared/models/table/material-table-item-model';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { Store } from '@ngrx/store';

import {
  addRowDataItems,
  clearCreateCaseRowData,
  clearCustomer,
  clearOfferType,
  clearPurchaseOrderType,
  clearSectorGpsd,
  clearShipToParty,
  resetAllAutocompleteOptions,
  setRowDataCurrency,
  updateCurrencyOfPositionItems,
  updateRowDataItem,
  validateMaterialsOnCustomerAndSalesOrg,
} from '../actions/create-case/create-case.actions';
import { SalesOrg } from '../reducers/create-case/models/sales-orgs.model';
import { SectorGpsdFacade } from '../sector-gpsd/sector-gpsd.facade';
import {
  getCaseRowData,
  getCustomerConditionsValid,
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
    this.store.dispatch(resetAllAutocompleteOptions());
    this.store.dispatch(clearCustomer());
    this.store.dispatch(clearShipToParty());
    this.store.dispatch(clearSectorGpsd());
    this.store.dispatch(clearOfferType());
    this.store.dispatch(clearPurchaseOrderType());
    this.sectorGpsdFacade.resetAllSectorGpsds();
    this.store.dispatch(clearCreateCaseRowData());
    this.store.dispatch(setRowDataCurrency({ currency: undefined }));
  }

  updateCurrencyOfPositionItems(currency: string): void {
    this.store.dispatch(setRowDataCurrency({ currency }));
    this.store.dispatch(updateCurrencyOfPositionItems());
  }

  getQuotationToDate(customerId: CustomerId): Observable<string> {
    return this.quotationService.getQuotationToDateForCaseCreation(customerId);
  }
}
