import { Action, createReducer, on } from '@ngrx/store';

import { AutocompleteRequestDialog } from '../../../../shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../../../shared/components/autocomplete-input/filter-names.enum';
import { IdValue } from '../../../../shared/models/search';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../../shared/models/table';
import { TableService } from '../../../../shared/services/table-service/table.service';
import {
  addRowDataItems,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearCreateCaseRowData,
  clearCustomer,
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
  resetAllAutocompleteOptions,
  resetAutocompleteMaterials,
  resetCustomerFilter,
  resetPLsAndSeries,
  resetProductLineAndSeries,
  resetRequestingAutoCompleteDialog,
  selectAutocompleteOption,
  selectSalesOrg,
  setRequestingAutoCompleteDialog,
  setSelectedAutocompleteOption,
  setSelectedGpsdGroups,
  setSelectedProductLines,
  setSelectedSeries,
  unselectAutocompleteOptions,
  updateRowDataItem,
  validateMaterialsOnCustomerAndSalesOrg,
  validateMaterialsOnCustomerAndSalesOrgFailure,
  validateMaterialsOnCustomerAndSalesOrgSuccess,
} from '../../actions';
import { SalesIndication } from '../transactions/models/sales-indication.enum';
import { CreateCaseResponse, SalesOrg } from './models';
import { CaseFilterItem } from './models/case-filter-item.model';
import { PLsAndSeries } from './models/pls-and-series.model';
/* eslint-disable max-lines */
export interface CreateCaseState {
  autocompleteLoading: string;
  autocompleteItems: CaseFilterItem[];
  autoSelectMaterial: CaseFilterItem;
  requestingDialog: AutocompleteRequestDialog;
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
    historicalDataLimitInYear: number;
  };
  createdCase: CreateCaseResponse;
  createCaseLoading: boolean;
  errorMessage: string;
  rowData: MaterialTableItem[];
  validationLoading: boolean;
}
export const initialState: CreateCaseState = {
  autocompleteLoading: undefined,
  autoSelectMaterial: undefined,
  requestingDialog: AutocompleteRequestDialog.EMPTY,
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
      filter: FilterNames.MATERIAL_NUMBER,
      options: [],
    },
    {
      filter: FilterNames.MATERIAL_DESCRIPTION,
      options: [],
    },
    {
      filter: FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION,
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
    historicalDataLimitInYear: undefined,
  },
  createdCase: undefined,
  createCaseLoading: false,
  errorMessage: undefined,
  rowData: [],
  validationLoading: false,
};

const isOnlyOptionForMaterial = (options: any, filter: any): boolean =>
  options.length === 1 &&
  (filter === FilterNames.MATERIAL_NUMBER ||
    filter === FilterNames.MATERIAL_DESCRIPTION);

export const createCaseReducer = createReducer(
  initialState,
  on(
    autocomplete,
    (state: CreateCaseState, { autocompleteSearch }): CreateCaseState => ({
      ...state,
      autocompleteLoading: autocompleteSearch.filter,
    })
  ),
  on(
    autocompleteFailure,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      autocompleteLoading: initialState.autocompleteLoading,
    })
  ),
  on(
    autocompleteSuccess,
    (state: CreateCaseState, { options, filter }): CreateCaseState => ({
      ...state,
      autocompleteLoading: initialState.autocompleteLoading,
      // TODO: map the only option
      autoSelectMaterial: isOnlyOptionForMaterial(options, filter)
        ? { options, filter }
        : undefined,
      autocompleteItems: [...state.autocompleteItems].map((it) => {
        const tmp = { ...it };
        let itemOptions = [...options];
        if (tmp.filter === filter) {
          const mergedOptions: IdValue[] = [];

          if (tmp.filter === FilterNames.MATERIAL_NUMBER) {
            itemOptions = itemOptions.map((opt) => ({
              ...opt,
              id: opt.id,
            }));
          } else if (tmp.filter === FilterNames.MATERIAL_DESCRIPTION) {
            itemOptions = itemOptions.map((opt) => ({
              ...opt,
              value: opt.value,
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
    })
  ),
  on(
    selectAutocompleteOption,
    (state: CreateCaseState, { option, filter }): CreateCaseState => ({
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
          filter === FilterNames.CUSTOMER
            ? option.id
            : state.customer.customerId,
      },
    })
  ),
  on(
    setSelectedAutocompleteOption,
    (state: CreateCaseState, { filter, option }): CreateCaseState => ({
      ...state,
      autocompleteItems: [...state.autocompleteItems].map((it) => {
        const temp = { ...it };
        const setFor =
          filter === FilterNames.MATERIAL_NUMBER
            ? FilterNames.MATERIAL_DESCRIPTION
            : FilterNames.MATERIAL_NUMBER;

        if (temp.filter === filter) {
          return { ...temp, options: selectOption(temp.options, option) };
        } else if (temp.filter === setFor) {
          return {
            ...temp,
            options: selectOption(temp.options, {
              selected: true,
              id: option.value,
              value: option.id,
              value2: option.value2,
            }),
          };
        }

        return temp;
      }),
    })
  ),
  on(
    unselectAutocompleteOptions,
    (state: CreateCaseState, { filter }): CreateCaseState => ({
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
        customerId:
          filter === FilterNames.CUSTOMER
            ? undefined
            : state.customer.customerId,
        salesOrgs:
          filter === FilterNames.CUSTOMER ? [] : state.customer.salesOrgs,
      },
    })
  ),
  on(
    resetAllAutocompleteOptions,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      autocompleteItems: initialState.autocompleteItems,
    })
  ),
  on(
    resetAutocompleteMaterials,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      autocompleteItems: state.autocompleteItems.map((autocompleteItem, i) =>
        [FilterNames.CUSTOMER, FilterNames.SAP_QUOTATION].includes(
          autocompleteItem.filter
        )
          ? state.autocompleteItems[i]
          : initialState.autocompleteItems[i]
      ),
    })
  ),
  on(
    setRequestingAutoCompleteDialog,
    (state: CreateCaseState, { dialog }): CreateCaseState => ({
      ...state,
      requestingDialog: dialog,
    })
  ),
  on(
    resetRequestingAutoCompleteDialog,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      requestingDialog: AutocompleteRequestDialog.EMPTY,
    })
  ),
  on(addRowDataItems, (state: CreateCaseState, { items }) => ({
    ...state,
    rowData: TableService.pasteItems(items, [...state.rowData]),
    validationLoading: true,
  })),
  on(updateRowDataItem, (state: CreateCaseState, { item }) => ({
    ...state,
    rowData: TableService.updateItem(item, state.rowData),
  })),
  on(
    clearCreateCaseRowData,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      rowData: initialState.rowData,
    })
  ),
  on(deleteRowDataItem, (state: CreateCaseState, { id }) => ({
    ...state,
    rowData: TableService.deleteItem(id, [...state.rowData]),
  })),
  on(
    validateMaterialsOnCustomerAndSalesOrg,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      validationLoading: true,
    })
  ),
  on(
    validateMaterialsOnCustomerAndSalesOrgSuccess,
    (state: CreateCaseState, { materialValidations }) => ({
      ...state,
      rowData: [...state.rowData].map((el) =>
        TableService.validateData(
          { ...el },
          materialValidations.find(
            (item) => item.materialNumber15 === el.materialNumber
          )
        )
      ),
      validationLoading: false,
    })
  ),
  on(
    validateMaterialsOnCustomerAndSalesOrgFailure,
    (state: CreateCaseState) => ({
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
    })
  ),
  on(
    createCase,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      createCaseLoading: true,
    })
  ),
  on(
    createCaseSuccess,
    (state: CreateCaseState, { createdCase }): CreateCaseState => ({
      ...state,
      createdCase,
      createCaseLoading: false,
      autocompleteItems: initialState.autocompleteItems,
      customer: initialState.customer,
      rowData: initialState.rowData,
    })
  ),
  on(
    createCaseFailure,
    (state: CreateCaseState, { errorMessage }): CreateCaseState => ({
      ...state,
      errorMessage,
      createCaseLoading: false,
    })
  ),
  on(
    importCase,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      createCaseLoading: true,
      errorMessage: initialState.errorMessage,
    })
  ),
  on(
    importCaseSuccess,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      createCaseLoading: false,
      autocompleteItems: initialState.autocompleteItems,
    })
  ),
  on(
    importCaseFailure,
    (state: CreateCaseState, { errorMessage }): CreateCaseState => ({
      ...state,
      errorMessage,
      createCaseLoading: false,
    })
  ),
  on(
    getSalesOrgsSuccess,
    (state: CreateCaseState, { salesOrgs }): CreateCaseState => ({
      ...state,
      customer: {
        ...state.customer,
        salesOrgs,
        salesOrgsLoading: false,
      },
      rowData: TableService.updateStatusOnCustomerChanged([...state.rowData]),
    })
  ),
  on(
    getSalesOrgsFailure,
    (state: CreateCaseState, { errorMessage }): CreateCaseState => ({
      ...state,
      customer: {
        ...state.customer,
        errorMessage,
        salesOrgsLoading: false,
      },
    })
  ),
  on(
    selectSalesOrg,
    (state: CreateCaseState, { salesOrgId }): CreateCaseState => ({
      ...state,
      customer: {
        ...state.customer,
        salesOrgs: [...state.customer.salesOrgs].map((el) => ({
          ...el,
          selected: el.id === salesOrgId,
        })),
      },
      rowData: TableService.updateStatusOnCustomerChanged([...state.rowData]),
    })
  ),
  on(
    clearCustomer,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      customer: initialState.customer,
    })
  ),
  on(
    getPLsAndSeries,
    (state: CreateCaseState, { customerFilters }): CreateCaseState => ({
      ...state,
      plSeries: {
        errorMessage: initialState.plSeries.errorMessage,
        plsAndSeries: initialState.plSeries.plsAndSeries,
        loading: true,
        materialSelection: {
          includeQuotationHistory: customerFilters.includeQuotationHistory,
          salesIndications: customerFilters.salesIndications,
        },
        historicalDataLimitInYear: customerFilters.historicalDataLimitInYear,
      },
    })
  ),
  on(
    getPLsAndSeriesSuccess,
    (state: CreateCaseState, { plsAndSeries }): CreateCaseState => ({
      ...state,
      plSeries: {
        ...state.plSeries,
        plsAndSeries,
        loading: false,
      },
    })
  ),
  on(
    getPLsAndSeriesFailure,
    (state: CreateCaseState, { errorMessage }): CreateCaseState => ({
      ...state,
      plSeries: {
        ...state.plSeries,
        errorMessage,
        loading: false,
      },
    })
  ),
  on(
    setSelectedProductLines,
    (state: CreateCaseState, { selectedProductLines }): CreateCaseState => ({
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
    })
  ),
  on(
    setSelectedSeries,
    (state: CreateCaseState, { selectedSeries }): CreateCaseState => ({
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
    })
  ),
  on(
    setSelectedGpsdGroups,
    (state: CreateCaseState, { selectedGpsdGroups }): CreateCaseState => ({
      ...state,
      plSeries: {
        ...state.plSeries,
        plsAndSeries: {
          ...state.plSeries.plsAndSeries,
          gpsdGroupIds: state.plSeries.plsAndSeries.gpsdGroupIds.map(
            (gpsdGroups) => ({
              ...gpsdGroups,
              selected: selectedGpsdGroups.includes(gpsdGroups.value),
            })
          ),
        },
      },
    })
  ),
  on(
    resetProductLineAndSeries,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      plSeries: initialState.plSeries,
    })
  ),
  on(
    createCustomerCase,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      createCaseLoading: true,
    })
  ),
  on(
    createCustomerCaseSuccess,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      createCaseLoading: false,
      autocompleteItems: initialState.autocompleteItems,
      plSeries: initialState.plSeries,
      customer: initialState.customer,
    })
  ),
  on(
    createCustomerCaseFailure,
    (state: CreateCaseState, { errorMessage }): CreateCaseState => ({
      ...state,
      createCaseLoading: false,
      errorMessage,
    })
  ),
  on(
    resetCustomerFilter,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      customer: initialState.customer,
      autocompleteItems: initialState.autocompleteItems,
    })
  ),
  on(
    resetPLsAndSeries,
    (state: CreateCaseState): CreateCaseState => ({
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
export function reducer(
  state: CreateCaseState,
  action: Action
): CreateCaseState {
  return createCaseReducer(state, action);
}
