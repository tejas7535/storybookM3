import { AutocompleteRequestDialog } from '@gq/shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { PurchaseOrderType } from '@gq/shared/models';
import { OfferType } from '@gq/shared/models/offer-type.interface';
import { IdValue } from '@gq/shared/models/search';
import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import { MaterialQuantities, MaterialTableItem } from '@gq/shared/models/table';
import { CreateCustomerCase } from '@gq/shared/services/rest/search/models/create-customer-case.model';
import { TableService } from '@gq/shared/services/table/table.service';
import { createSelector } from '@ngrx/store';

import { getCaseState } from '../../reducers';
import { CreateCaseState } from '../../reducers/create-case/create-case.reducer';
import {
  CaseFilterItem,
  CreateCase,
  CreateCaseResponse,
  SalesOrg,
} from '../../reducers/create-case/models';
import { PLsAndSeries } from '../../reducers/create-case/models/pls-and-series.model';

export const getCaseQuotation = createSelector(
  getCaseState,
  (state: CreateCaseState): CaseFilterItem =>
    state.autocompleteItems.find(
      (it) => it.filter === FilterNames.SAP_QUOTATION
    )
);

export const getSelectedQuotation = createSelector(
  getCaseState,
  (state: CreateCaseState): IdValue => {
    const quotationOptions = state.autocompleteItems.find(
      (it) => it.filter === FilterNames.SAP_QUOTATION
    )?.options;
    for (const item of quotationOptions) {
      if (item.selected) {
        return item;
      }
    }

    return undefined;
  }
);

export const getCaseCustomer = (dialog: AutocompleteRequestDialog) =>
  createSelector(
    getCaseState,
    (state: CreateCaseState): CaseFilterItem =>
      getAutocompleteItems(state, dialog, FilterNames.CUSTOMER)
  );

export const getCaseCustomerAndShipToParty = (
  dialog: AutocompleteRequestDialog
) =>
  createSelector(
    getCaseState,
    (state: CreateCaseState): CaseFilterItem =>
      getAutocompleteItems(
        state,
        dialog,
        FilterNames.CUSTOMER_AND_SHIP_TO_PARTY
      )
  );

export const getCaseMaterialNumber = (dialog: AutocompleteRequestDialog) =>
  createSelector(
    getCaseState,
    (state: CreateCaseState): CaseFilterItem =>
      getAutocompleteItems(state, dialog, FilterNames.MATERIAL_NUMBER)
  );

export const getCaseMaterialDesc = (dialog: AutocompleteRequestDialog) =>
  createSelector(
    getCaseState,
    (state: CreateCaseState): CaseFilterItem =>
      getAutocompleteItems(state, dialog, FilterNames.MATERIAL_DESCRIPTION)
  );

export const getCaseMaterialNumberOrDesc = (
  dialog: AutocompleteRequestDialog
) =>
  createSelector(
    getCaseState,
    (state: CreateCaseState): CaseFilterItem =>
      getAutocompleteItems(
        state,
        dialog,
        FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION
      )
  );

const getAutocompleteItems = (
  state: CreateCaseState,
  dialog: AutocompleteRequestDialog,
  filter: FilterNames
): CaseFilterItem => {
  if (!dialog || dialog === AutocompleteRequestDialog.EMPTY) {
    return state.autocompleteItems.find((it) => it.filter === filter);
  }

  return state.requestingDialog === dialog
    ? state.autocompleteItems.find((it) => it.filter === filter)
    : { filter, options: [] };
};

export const getCaseAutocompleteLoading = (filter: FilterNames) =>
  createSelector(
    getCaseState,
    (state: CreateCaseState): boolean => state.autocompleteLoading === filter
  );
export const getCaseRowData = createSelector(
  getCaseState,
  (state: CreateCaseState): MaterialTableItem[] => state.rowData
);

export const getAutoSelectMaterial = createSelector(
  getCaseState,
  (state: CreateCaseState): CaseFilterItem => state.autoSelectMaterial
);

export const getCustomerConditionsValid = createSelector(
  getCaseState,
  (state: CreateCaseState): boolean => {
    const rowData = state ? [...state.rowData] : [];
    let rowDataValid = rowData.length > 0;
    for (const row of rowData) {
      if (row.materialNumber || row.quantity) {
        const error =
          !row.quantity ||
          (row.materialNumber && row.materialNumber.length === 0) ||
          !row.materialNumber ||
          !row.info.valid;

        if (error) {
          rowDataValid = false;
          break;
        }
      }
    }

    const customerValid = state
      ? state.autocompleteItems
          .find((el) => el.filter === FilterNames.CUSTOMER)
          .options.find((opt: IdValue) => opt.selected)
      : undefined;

    return customerValid === undefined ? false : rowDataValid;
  }
);
export const getCreateCaseData = (userHasOfferTypeAccess: boolean = false) =>
  createSelector(getCaseState, (state: CreateCaseState): CreateCase => {
    const { customerId, salesOrgs } = state.customer;
    const salesOrg = salesOrgs.find((org) => org.selected)?.id;
    const purchaseOrderType = state.purchaseOrderType;
    const sectorGpsd = state.sectorGpsd;
    const offerType = state.offerType;

    const materialQuantities: MaterialQuantities[] =
      TableService.createMaterialQuantitiesFromTableItems(state.rowData, 0);

    return {
      materialQuantities,
      customer: {
        customerId,
        salesOrg,
      },
      purchaseOrderTypeId: purchaseOrderType?.id,
      partnerRoleId: sectorGpsd?.id,
      offerTypeId: userHasOfferTypeAccess ? offerType?.id : undefined,
    };
  });

export const getCreatedCase = createSelector(
  getCaseState,
  (state: CreateCaseState): CreateCaseResponse => state.createdCase
);

export const getSalesOrgs = createSelector(
  getCaseState,
  (state: CreateCaseState): SalesOrg[] => state.customer.salesOrgs
);

export const getSalesOrgsOfShipToParty = createSelector(
  getCaseState,
  (state: CreateCaseState): SalesOrg[] => state.shipToParty.salesOrgs
);

export const getSelectedSalesOrg = createSelector(
  getCaseState,
  (state: CreateCaseState): SalesOrg =>
    state.customer.salesOrgs.find((salesOrg) => salesOrg.selected)
);

export const getCreateCaseLoading = createSelector(
  getCaseState,
  (state: CreateCaseState): boolean => state.createCaseLoading
);

export const getSelectedCustomerId = createSelector(
  getCaseState,
  (state: CreateCaseState): string => state.customer.customerId
);

export const getProductLinesAndSeries = createSelector(
  getCaseState,
  (state: CreateCaseState): PLsAndSeries => state.plSeries.plsAndSeries
);

export const getProductLinesAndSeriesLoading = createSelector(
  getCaseState,
  (state: CreateCaseState): boolean => state.plSeries.loading
);

export const getCreateCustomerCaseDisabled = createSelector(
  getCaseState,
  (state: CreateCaseState): boolean => {
    const customer =
      state.customer.customerId &&
      state.customer.salesOrgs.find((salesOrg) => salesOrg.selected) !== null;

    const materialSelection =
      state.plSeries.materialSelection.salesIndications.length > 0 ||
      state.plSeries.materialSelection.includeQuotationHistory;

    const plAndSeries =
      state.plSeries.plsAndSeries?.pls.filter((el) => el.selected).length > 0 &&
      state.plSeries.plsAndSeries?.series.filter((el) => el.selected).length >
        0 &&
      state.plSeries.plsAndSeries?.gpsdGroupIds.filter((el) => el.selected)
        .length;

    return !(customer && materialSelection && plAndSeries);
  }
);

export const getCreateCustomerCasePayload = createSelector(
  getCaseState,
  (state: CreateCaseState): CreateCustomerCase => ({
    customer: {
      customerId: state.customer.customerId,
      salesOrg: state.customer.salesOrgs.find((salesOrg) => salesOrg.selected)
        ?.id,
    },
    includeQuotationHistory:
      state.plSeries.materialSelection.includeQuotationHistory,
    salesIndications: state.plSeries.materialSelection.salesIndications,
    series: state.plSeries.plsAndSeries?.series
      .filter((el) => el.selected)
      .map((el) => el.value),
    productLines: state.plSeries.plsAndSeries?.pls
      .filter((el) => el.selected)
      .map((el) => el.value),
    gpsdGroupIds: state.plSeries.plsAndSeries?.gpsdGroupIds
      .filter((el) => el.selected)
      .map((el) => el.value),
    historicalDataLimitInYear: state.plSeries.historicalDataLimitInYear,
  })
);

export const getSelectedPurchaseOrderTypeFromCreateCase = createSelector(
  getCaseState,
  (state: CreateCaseState): PurchaseOrderType => state.purchaseOrderType
);

export const getSelectedSectorGpsdFromCreateCase = createSelector(
  getCaseState,
  (state: CreateCaseState): SectorGpsd => state.sectorGpsd
);

export const getSelectedOfferTypeFromCreateCase = createSelector(
  getCaseState,
  (state: CreateCaseState): OfferType => state.offerType
);
