import { createSelector } from '@ngrx/store';

import { AutocompleteRequestDialog } from '../../../../shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../../../shared/components/autocomplete-input/filter-names.enum';
import { IdValue } from '../../../../shared/models/search';
import {
  MaterialQuantities,
  MaterialTableItem,
} from '../../../../shared/models/table';
import { CreateCustomerCase } from '../../../../shared/services/rest-services/search-service/models/create-customer-case.model';
import { TableService } from '../../../../shared/services/table-service/table.service';
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

export const getCaseCustomer = createSelector(
  getCaseState,
  (state: CreateCaseState): CaseFilterItem =>
    state.autocompleteItems.find((it) => it.filter === FilterNames.CUSTOMER)
);

export const getCaseMaterialNumber = (dialog: AutocompleteRequestDialog) =>
  createSelector(getCaseState, (state: CreateCaseState): CaseFilterItem => {
    if (!dialog || dialog === AutocompleteRequestDialog.EMPTY) {
      return state.autocompleteItems.find(
        (it) => it.filter === FilterNames.MATERIAL_NUMBER
      );
    }

    return state.requestingDialog === dialog
      ? state.autocompleteItems.find(
          (it) => it.filter === FilterNames.MATERIAL_NUMBER
        )
      : { filter: FilterNames.MATERIAL_NUMBER, options: [] };
  });

export const getCaseMaterialDesc = (dialog: AutocompleteRequestDialog) =>
  createSelector(getCaseState, (state: CreateCaseState): CaseFilterItem => {
    if (!dialog || dialog === AutocompleteRequestDialog.EMPTY) {
      return state.autocompleteItems.find(
        (it) => it.filter === FilterNames.MATERIAL_DESCRIPTION
      );
    }

    return state.requestingDialog === dialog
      ? state.autocompleteItems.find(
          (it) => it.filter === FilterNames.MATERIAL_DESCRIPTION
        )
      : { filter: FilterNames.MATERIAL_DESCRIPTION, options: [] };
  });

export const getCaseMaterialNumberOrDesc = (
  dialog: AutocompleteRequestDialog
) =>
  createSelector(getCaseState, (state: CreateCaseState): CaseFilterItem => {
    if (!dialog || dialog === AutocompleteRequestDialog.EMPTY) {
      return state.autocompleteItems.find(
        (it) => it.filter === FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION
      );
    }

    return state.requestingDialog === dialog
      ? state.autocompleteItems.find(
          (it) => it.filter === FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION
        )
      : { filter: FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION, options: [] };
  });
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

    return customerValid !== undefined ? rowDataValid : false;
  }
);
export const getCreateCaseData = createSelector(
  getCaseState,
  (state: CreateCaseState): CreateCase => {
    const { customerId, salesOrgs } = state.customer;
    const salesOrg = salesOrgs.find((org) => org.selected)?.id;

    const materialQuantities: MaterialQuantities[] =
      TableService.createMaterialQuantitiesFromTableItems(state.rowData, 0);

    return {
      materialQuantities,
      customer: {
        customerId,
        salesOrg,
      },
    };
  }
);

export const getCreatedCase = createSelector(
  getCaseState,
  (state: CreateCaseState): CreateCaseResponse => state.createdCase
);

export const getSalesOrgs = createSelector(
  getCaseState,
  (state: CreateCaseState): SalesOrg[] => state.customer.salesOrgs
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
