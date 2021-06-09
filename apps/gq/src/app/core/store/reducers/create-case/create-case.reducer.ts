/* eslint-disable max-lines */
import { Action, createReducer, on } from '@ngrx/store';

import { FilterNames } from '../../../../shared/autocomplete-input/filter-names.enum';
import { IdValue } from '../../../../shared/models/search';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../../shared/models/table';
import { MaterialTransformPipe } from '../../../../shared/pipes/material-transform/material-transform.pipe';
import { TableService } from '../../../../shared/services/table-service/table.service';
import {
  addRowDataItem,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearCreateCaseRowData,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  createCustomerCase,
  createCustomerCaseFailure,
  createCustomerCaseSuccess,
  deleteRowDataItem,
  getPLsAndSeries,
  getPLsAndSeriesFailure,
  getPLsAndSeriesSuccess,
  getSalesOrgsFailure,
  getSalesOrgsSuccess,
  importCase,
  importCaseFailure,
  importCaseSuccess,
  pasteRowDataItems,
  resetCustomerFilter,
  resetPLsAndSeries,
  resetProductLineAndSeries,
  selectAutocompleteOption,
  selectSalesOrg,
  setSelectedProductLines,
  setSelectedSeries,
  unselectAutocompleteOptions,
  validateFailure,
  validateSuccess,
} from '../../actions';
import { SalesIndication } from '../transactions/models/sales-indication.enum';
import { dummyRowData, isDummyData } from './config/dummy-row-data';
import { CreateCaseResponse, SalesOrg } from './models';
import { CaseFilterItem } from './models/case-filter-item.model';
import { PLsAndSeries } from './models/pls-and-series.model';

export interface CaseState {
  autocompleteLoading: string;
  autocompleteItems: CaseFilterItem[];
  customer: {
    customerId: string;
    salesOrgsLoading: boolean;
    salesOrgs: SalesOrg[];
    errorMessage: string;
  };
  plSeries: {
    loading: boolean;
    errorMessage: string;
    plsAndSeries: PLsAndSeries;
    materialSelection: {
      includeQuotationHistory: boolean;
      salesIndications: SalesIndication[];
    };
  };
  createdCase: CreateCaseResponse;
  createCaseLoading: boolean;
  errorMessage: string;
  rowData: MaterialTableItem[];
  validationLoading: boolean;
}
export const initialState: CaseState = {
  autocompleteLoading: undefined,
  autocompleteItems: [
    {
      filter: FilterNames.SAP_QUOTATION,
      options: [],
    },
    {
      filter: FilterNames.CUSTOMER,
      options: [],
    },
    {
      filter: FilterNames.MATERIAL,
      options: [],
    },
  ],
  customer: {
    customerId: undefined,
    salesOrgsLoading: false,
    salesOrgs: [],
    errorMessage: undefined,
  },
  plSeries: {
    loading: false,
    errorMessage: undefined,
    plsAndSeries: undefined,
    materialSelection: {
      includeQuotationHistory: undefined,
      salesIndications: [],
    },
  },
  createdCase: undefined,
  createCaseLoading: false,
  errorMessage: undefined,
  rowData: [dummyRowData],
  validationLoading: false,
};

export const createCaseReducer = createReducer(
  initialState,
  on(autocomplete, (state: CaseState, { autocompleteSearch }) => ({
    ...state,
    autocompleteLoading: autocompleteSearch.filter,
  })),
  on(autocompleteFailure, (state: CaseState) => ({
    ...state,
    autocompleteLoading: initialState.autocompleteLoading,
  })),
  on(autocompleteSuccess, (state: CaseState, { options, filter }) => ({
    ...state,
    autocompleteLoading: initialState.autocompleteLoading,
    autocompleteItems: [...state.autocompleteItems].map((it) => {
      const tmp = { ...it };
      let itemOptions = [...options];
      if (tmp.filter === filter) {
        const mergedOptions: IdValue[] = [];
        if (tmp.filter === FilterNames.MATERIAL) {
          const materialPipe = new MaterialTransformPipe();
          itemOptions = itemOptions.map((opt) => ({
            ...opt,
            id: materialPipe.transform(opt.id),
          }));
        }

        tmp.options.forEach((oldOption) => {
          const idxInNewOptions = itemOptions.findIndex(
            (newOpt) => newOpt.id === oldOption.id
          );

          // only consider selected options in old options
          if (idxInNewOptions === -1 && oldOption.selected) {
            // keep old option if it has been selected but is not part of received options
            mergedOptions.push(oldOption);
          } else if (idxInNewOptions > -1 && oldOption.selected) {
            // update received options with selected info
            itemOptions[idxInNewOptions] = {
              ...itemOptions[idxInNewOptions],
              selected: true,
            };
          }
        });
        tmp.options = [...mergedOptions, ...itemOptions];
      }

      return tmp;
    }),
  })),
  on(selectAutocompleteOption, (state: CaseState, { option, filter }) => ({
    ...state,
    autocompleteItems: [...state.autocompleteItems].map((it) => {
      const temp = { ...it };
      if (temp.filter === filter) {
        return { ...temp, options: selectOption(temp.options, option) };
      }

      return temp;
    }),
    customer: {
      ...state.customer,
      salesOrgsLoading: filter === FilterNames.CUSTOMER,
      customerId:
        filter === FilterNames.CUSTOMER ? option.id : state.customer.customerId,
    },
  })),
  on(unselectAutocompleteOptions, (state: CaseState, { filter }) => ({
    ...state,
    autocompleteItems: [...state.autocompleteItems].map((it) => {
      const temp = { ...it };
      if (temp.filter === filter) {
        temp.options = temp.options.map((opt) => ({
          ...opt,
          selected: false,
        }));
      }

      return temp;
    }),
    customer: {
      ...state.customer,
      customerId: undefined,
      salesOrgs:
        filter === FilterNames.CUSTOMER ? [] : state.customer.salesOrgs,
    },
  })),
  on(addRowDataItem, (state: CaseState, { items }) => ({
    ...state,
    rowData: [
      ...TableService.removeDashesFromTableItems(items),
      ...state.rowData.filter((val) => !isDummyData(val)),
    ],
  })),
  on(pasteRowDataItems, (state: CaseState, { items, pasteDestination }) => ({
    ...state,
    rowData: TableService.pasteItems(items, pasteDestination, [
      ...state.rowData,
    ]),
    validationLoading: true,
  })),
  on(clearCreateCaseRowData, (state: CaseState) => ({
    ...state,
    rowData: [dummyRowData],
  })),
  on(deleteRowDataItem, (state: CaseState, { materialNumber, quantity }) => ({
    ...state,
    rowData: TableService.deleteItem(materialNumber, quantity, [
      ...state.rowData,
    ]),
  })),
  on(validateSuccess, (state: CaseState, { materialValidations }) => ({
    ...state,
    rowData: [...state.rowData].map((el) =>
      TableService.validateData({ ...el }, materialValidations)
    ),
    validationLoading: false,
  })),
  on(validateFailure, (state: CaseState) => ({
    ...state,
    rowData: [...state.rowData].map((el) => {
      if (el.info.description[0] === ValidationDescription.Valid) {
        return el;
      }

      return {
        ...el,
        info: {
          ...el.info,
          description: [ValidationDescription.ValidationFailure],
        },
      };
    }),
    validationLoading: false,
  })),
  on(createCase, (state: CaseState) => ({
    ...state,
    createCaseLoading: true,
  })),
  on(createCaseSuccess, (state: CaseState, { createdCase }) => ({
    ...state,
    createdCase,
    createCaseLoading: false,
    autocompleteItems: initialState.autocompleteItems,
    customer: initialState.customer,
    rowData: initialState.rowData,
  })),
  on(createCaseFailure, (state: CaseState, { errorMessage }) => ({
    ...state,
    errorMessage,
    createCaseLoading: false,
  })),
  on(importCase, (state: CaseState) => ({
    ...state,
    createCaseLoading: true,
    errorMessage: initialState.errorMessage,
  })),
  on(importCaseSuccess, (state: CaseState) => ({
    ...state,
    createCaseLoading: false,
    autocompleteItems: initialState.autocompleteItems,
  })),
  on(importCaseFailure, (state: CaseState, { errorMessage }) => ({
    ...state,
    errorMessage,
    createCaseLoading: false,
  })),
  on(getSalesOrgsSuccess, (state: CaseState, { salesOrgs }) => ({
    ...state,
    customer: {
      ...state.customer,
      salesOrgs,
      salesOrgsLoading: false,
    },
  })),
  on(getSalesOrgsFailure, (state: CaseState, { errorMessage }) => ({
    ...state,
    customer: {
      ...state.customer,
      errorMessage,
      salesOrgsLoading: false,
    },
  })),
  on(selectSalesOrg, (state: CaseState, { salesOrgId }) => ({
    ...state,
    customer: {
      ...state.customer,
      salesOrgs: [...state.customer.salesOrgs].map((el) => ({
        ...el,
        selected: el.id === salesOrgId,
      })),
    },
  })),
  on(getPLsAndSeries, (state: CaseState, { customerFilters }) => ({
    ...state,
    plSeries: {
      errorMessage: initialState.plSeries.errorMessage,
      plsAndSeries: initialState.plSeries.plsAndSeries,
      loading: true,
      materialSelection: {
        includeQuotationHistory: customerFilters.includeQuotationHistory,
        salesIndications: customerFilters.salesIndications,
      },
    },
  })),
  on(getPLsAndSeriesSuccess, (state: CaseState, { plsAndSeries }) => ({
    ...state,
    plSeries: {
      ...state.plSeries,
      plsAndSeries,
      loading: false,
    },
  })),
  on(getPLsAndSeriesFailure, (state: CaseState, { errorMessage }) => ({
    ...state,
    plSeries: {
      ...state.plSeries,
      errorMessage,
      loading: false,
    },
  })),
  on(setSelectedProductLines, (state: CaseState, { selectedProductLines }) => ({
    ...state,
    plSeries: {
      ...state.plSeries,
      plsAndSeries: {
        ...state.plSeries.plsAndSeries,
        pls: state.plSeries.plsAndSeries.pls.map((pl) => ({
          ...pl,
          selected: selectedProductLines.includes(pl.value),
        })),
      },
    },
  })),
  on(setSelectedSeries, (state: CaseState, { selectedSeries }) => ({
    ...state,
    plSeries: {
      ...state.plSeries,
      plsAndSeries: {
        ...state.plSeries.plsAndSeries,
        series: state.plSeries.plsAndSeries.series.map((series) => ({
          ...series,
          selected: selectedSeries.includes(series.value),
        })),
      },
    },
  })),
  on(resetProductLineAndSeries, (state: CaseState) => ({
    ...state,
    plSeries: initialState.plSeries,
  })),
  on(
    createCustomerCase,
    (state: CaseState): CaseState => ({
      ...state,
      createCaseLoading: true,
    })
  ),
  on(
    createCustomerCaseSuccess,
    (state: CaseState): CaseState => ({
      ...state,
      createCaseLoading: false,
      autocompleteItems: initialState.autocompleteItems,
      plSeries: initialState.plSeries,
      customer: initialState.customer,
    })
  ),
  on(
    createCustomerCaseFailure,
    (state: CaseState, { errorMessage }): CaseState => ({
      ...state,
      createCaseLoading: false,
      errorMessage,
    })
  ),
  on(
    resetCustomerFilter,
    (state: CaseState): CaseState => ({
      ...state,
      customer: initialState.customer,
      autocompleteItems: initialState.autocompleteItems,
    })
  ),
  on(
    resetPLsAndSeries,
    (state: CaseState): CaseState => ({
      ...state,
      plSeries: initialState.plSeries,
    })
  )
);

const selectOption = (options: IdValue[], option: IdValue): IdValue[] => {
  const itemOptions = [...options];
  const index = itemOptions.findIndex((idValue) => idValue.id === option.id);

  itemOptions.map((opt) => ({ ...opt, selected: true }));

  // if option already in Array
  if (index > -1) {
    itemOptions[index] = { ...itemOptions[index], selected: true };
  } else {
    itemOptions.push({ ...option, selected: true });
  }

  return itemOptions;
};
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: CaseState, action: Action): CaseState {
  return createCaseReducer(state, action);
}
