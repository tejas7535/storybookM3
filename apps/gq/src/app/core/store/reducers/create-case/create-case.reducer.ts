import { Action, createReducer, on } from '@ngrx/store';

import { FilterNames } from '../../../../shared/autocomplete-input/filter-names.enum';
import { MaterialTransformPipe } from '../../../../shared/pipes/material-transform.pipe';
import { TableService } from '../../../../shared/services/tableService/table.service';
import {
  addRowDataItem,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearRowData,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  deleteRowDataItem,
  getSalesOrgsFailure,
  getSalesOrgsSuccess,
  pasteRowDataItems,
  selectAutocompleteOption,
  selectSalesOrg,
  unselectAutocompleteOptions,
  validateFailure,
  validateSuccess,
} from '../../actions';
import {
  CaseFilterItem,
  CreateCaseResponse,
  IdValue,
  MaterialTableItem,
  SalesOrg,
  ValidationDescription,
} from '../../models';
import { dummyRowData, isDummyData } from './config/dummy-row-data';

export interface CaseState {
  createCase: {
    autocompleteLoading: string;
    autocompleteItems: CaseFilterItem[];
    customer: {
      customerId: string;
      salesOrgsLoading: boolean;
      salesOrgs: SalesOrg[];
      errorMessage: string;
    };
    createdCase: CreateCaseResponse;
    createCaseLoading: boolean;
    rowData: MaterialTableItem[];
    validationLoading: boolean;
  };
}
export const initialState: CaseState = {
  createCase: {
    autocompleteLoading: undefined,
    autocompleteItems: [
      {
        filter: FilterNames.QUOTATION,
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
    createdCase: undefined,
    createCaseLoading: false,
    rowData: [dummyRowData],
    validationLoading: false,
  },
};

export const createCaseReducer = createReducer(
  initialState,
  on(autocomplete, (state: CaseState, { autocompleteSearch }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      autocompleteLoading: autocompleteSearch.filter,
    },
  })),
  on(autocompleteFailure, (state: CaseState) => ({
    ...state,
    createCase: {
      ...state.createCase,
      autocompleteLoading: undefined,
    },
  })),
  on(autocompleteSuccess, (state: CaseState, { options, filter }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      autocompleteLoading: undefined,
      autocompleteItems: [...state.createCase.autocompleteItems].map((it) => {
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
    },
  })),
  on(selectAutocompleteOption, (state: CaseState, { option, filter }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      autocompleteItems: [...state.createCase.autocompleteItems].map((it) => {
        const temp = { ...it };
        if (temp.filter === filter) {
          return { ...temp, options: selectOption(temp.options, option) };
        }

        return temp;
      }),
      customer: {
        ...state.createCase.customer,
        salesOrgsLoading: filter === FilterNames.CUSTOMER,
        customerId:
          filter === FilterNames.CUSTOMER
            ? option.id
            : state.createCase.customer.customerId,
      },
    },
  })),
  on(unselectAutocompleteOptions, (state: CaseState, { filter }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      autocompleteItems: [...state.createCase.autocompleteItems].map((it) => {
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
        ...state.createCase.customer,
        salesOrgs:
          filter === FilterNames.CUSTOMER
            ? []
            : state.createCase.customer.salesOrgs,
      },
    },
  })),
  on(addRowDataItem, (state: CaseState, { items }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      rowData: [
        ...TableService.removeDashesFromTableItems(items),
        ...state.createCase.rowData.filter((val) => !isDummyData(val)),
      ],
    },
  })),
  on(pasteRowDataItems, (state: CaseState, { items, pasteDestination }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      rowData: TableService.pasteItems(items, pasteDestination, [
        ...state.createCase.rowData,
      ]),
      validationLoading: true,
    },
  })),
  on(clearRowData, (state: CaseState) => ({
    ...state,
    createCase: {
      ...state.createCase,
      rowData: [dummyRowData],
    },
  })),
  on(deleteRowDataItem, (state: CaseState, { materialNumber }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      rowData: TableService.deleteItem(materialNumber, [
        ...state.createCase.rowData,
      ]),
    },
  })),
  on(validateSuccess, (state: CaseState, { materialValidations }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      rowData: [...state.createCase.rowData].map((el) => {
        return TableService.validateData({ ...el }, materialValidations);
      }),
      validationLoading: false,
    },
  })),
  on(validateFailure, (state: CaseState) => ({
    ...state,
    createCase: {
      ...state.createCase,
      rowData: [...state.createCase.rowData].map((el) => {
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
    },
  })),
  on(createCase, (state: CaseState) => ({
    ...state,
    createCase: {
      ...state.createCase,
      createCaseLoading: true,
    },
  })),
  on(createCaseSuccess, (state: CaseState, { createdCase }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      createdCase,
      createCaseLoading: false,
    },
  })),
  on(createCaseFailure, (state: CaseState) => ({
    ...state,
    createCase: {
      ...state.createCase,
      createCaseLoading: false,
    },
  })),
  on(getSalesOrgsSuccess, (state: CaseState, { salesOrgs }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      customer: {
        ...state.createCase.customer,
        salesOrgs,
        salesOrgsLoading: false,
      },
    },
  })),
  on(getSalesOrgsFailure, (state: CaseState, { errorMessage }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      customer: {
        ...state.createCase.customer,
        errorMessage,
        salesOrgsLoading: false,
      },
    },
  })),
  on(selectSalesOrg, (state: CaseState, { salesOrgId }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      customer: {
        ...state.createCase.customer,
        salesOrgs: [...state.createCase.customer.salesOrgs].map((el) => ({
          ...el,
          selected: el.id === salesOrgId ? true : false,
        })),
      },
    },
  }))
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

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: CaseState, action: Action): CaseState {
  return createCaseReducer(state, action);
}
