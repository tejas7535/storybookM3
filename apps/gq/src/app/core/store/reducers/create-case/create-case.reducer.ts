import { Action, createReducer, on } from '@ngrx/store';
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
  pasteRowDataItems,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
  validateFailure,
  validateSuccess,
} from '../../actions';
import {
  CaseFilterItem,
  MaterialTableItem,
  CreateCaseResponse,
  IdValue,
  ValidationDescription,
} from '../../models';
import { dummyRowData, isDummyData } from './config/dummy-row-data';

export interface CaseState {
  createCase: {
    autocompleteLoading: string;
    autocompleteItems: CaseFilterItem[];
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
        filter: 'quotation',
        options: [],
      },
      {
        filter: 'customer',
        options: [],
      },
      {
        filter: 'materialNumber',
        options: [],
      },
    ],
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
        const itemOptions = [...options];
        if (tmp.filter === filter) {
          const mergedOptions: IdValue[] = [];

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
    },
  })),
  on(addRowDataItem, (state: CaseState, { items }) => ({
    ...state,
    createCase: {
      ...state.createCase,
      rowData: [
        ...items,
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
