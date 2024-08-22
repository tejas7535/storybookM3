import { inject, Injectable } from '@angular/core';

import { MaterialTableItem } from '@gq/shared/models/table/material-table-item-model';
import { Store } from '@ngrx/store';

import {
  clearCreateCaseRowData,
  clearCustomer,
  clearOfferType,
  clearPurchaseOrderType,
  clearSectorGpsd,
  clearShipToParty,
  resetAllAutocompleteOptions,
  updateRowDataItem,
  validateMaterialsOnCustomerAndSalesOrg,
} from '../actions/create-case/create-case.actions';
import { SectorGpsdFacade } from '../sector-gpsd/sector-gpsd.facade';
import {
  getCaseRowData,
  getCustomerConditionsValid,
  getSalesOrgs,
  getSalesOrgsOfShipToParty,
} from '../selectors/create-case/create-case.selector';

@Injectable({
  providedIn: 'root',
})
export class CreateCaseFacade {
  private readonly store: Store = inject(Store);
  private readonly sectorGpsdFacade: SectorGpsdFacade =
    inject(SectorGpsdFacade);
  customerSalesOrgs$ = this.store.select(getSalesOrgs);
  shipToPartySalesOrgs$ = this.store.select(getSalesOrgsOfShipToParty);

  newCaseRowData$ = this.store.select(getCaseRowData);

  customerConditionsValid$ = this.store.select(getCustomerConditionsValid);

  // #####################################################################################
  // ###############################     methods     #####################################
  // #####################################################################################

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
  }
}
