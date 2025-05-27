import { inject, Injectable } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { QuotationToDateActions } from '@gq/core/store/quotation-to-date/quotation-to-date.actions';
import { quotationToDateFeature } from '@gq/core/store/quotation-to-date/quotation-to-date.reducer';
import { ShipToPartyFacade } from '@gq/core/store/ship-to-party/ship-to-party.facade';
import { HeaderInformationData } from '@gq/shared/components/case-header-information/models/header-information-data.interface';
import { CustomerId } from '@gq/shared/models/customer/customer-ids.model';
import { MaterialTableItem } from '@gq/shared/models/table/material-table-item-model';
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
  createCase,
  createCustomerCase,
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
import { CreateCaseHeaderData } from '../reducers/create-case/models/create-case-header-data.interface';
import { SalesOrg } from '../reducers/create-case/models/sales-orgs.model';
import { SectorGpsdFacade } from '../sector-gpsd/sector-gpsd.facade';
import {
  getCaseRowData,
  getCreateCaseLoading,
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

  createCaseLoading$ = this.store.select(getCreateCaseLoading);
  customerIdForCaseCreation$ = this.store.select(getSelectedCustomerId);
  customerSalesOrgs$ = this.store.select(getSalesOrgs);
  selectedCustomerSalesOrg$ = this.store.select(getSelectedSalesOrg);
  shipToPartySalesOrgs$ = this.store.select(getSalesOrgsOfShipToParty);
  quotationToDate$ = this.store.select(
    quotationToDateFeature.selectQuotationToDate
  );

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

  resetCaseCreationInformation(navigateToCaseOverview: boolean = false): void {
    if (navigateToCaseOverview) {
      this.store.dispatch(navigateToCaseOverView());
    }
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

  createNewCase(headerInformationData: HeaderInformationData): void {
    const requestData: CreateCaseHeaderData = this.getHeaderRequestData(
      headerInformationData
    );
    this.store.dispatch(createCase({ createCaseData: requestData }));
  }

  createNewCustomerCase(headerInformationData: HeaderInformationData): void {
    const requestData: CreateCaseHeaderData = this.getHeaderRequestData(
      headerInformationData
    );
    this.store.dispatch(createCustomerCase({ createCaseData: requestData }));
  }

  updateCurrencyOfPositionItems(currency: string): void {
    this.store.dispatch(setRowDataCurrency({ currency }));
    this.store.dispatch(updateCurrencyOfPositionItems());
  }

  getQuotationToDate(customerId: CustomerId) {
    return this.store.dispatch(
      QuotationToDateActions.getQuotationToDate({ customerId })
    );
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

  clearCreateCaseRowData(): void {
    this.store.dispatch(clearCreateCaseRowData());
  }

  private getHeaderRequestData(
    headerInformationData: HeaderInformationData
  ): CreateCaseHeaderData {
    return {
      customer: {
        customerId: headerInformationData.customer.id,
        salesOrg: headerInformationData.salesOrg.id,
      },
      shipToParty: {
        customerId: headerInformationData.shipToParty.id,
        salesOrg: headerInformationData.salesOrg.id,
      },
      bindingPeriodValidityEndDate:
        headerInformationData.bindingPeriodValidityEndDate.toISOString(),
      caseName: headerInformationData.caseName,
      customCurrency: headerInformationData.currency,
      customerInquiryDate:
        headerInformationData.customerInquiryDate.toISOString(),
      offerTypeId: headerInformationData.offerType?.id,
      quotationToDate: headerInformationData.quotationToDate.toISOString(),
      quotationToManualInput: headerInformationData.quotationToManualInput,
      partnerRoleId: headerInformationData.partnerRoleType?.id,
      purchaseOrderTypeId: headerInformationData.purchaseOrderType?.id,
      requestedDeliveryDate:
        headerInformationData.requestedDeliveryDate?.toISOString(),
    };
  }
}
