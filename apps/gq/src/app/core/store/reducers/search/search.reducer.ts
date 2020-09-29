import { Action, createReducer, on } from '@ngrx/store';

import {
  addOption,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  createQueries,
  removeOption,
  selectedFilterChange,
} from '../../actions';
import { FilterItem, IdValue, QueryItem } from '../../models';

export interface SearchState {
  filters: {
    autocompleteLoading: string;
    items: FilterItem[];
    selected: string;
    queryInputs: string[];
  };
  queryList: QueryItem[];
}

export const initialState: SearchState = {
  filters: {
    autocompleteLoading: undefined,
    items: [
      {
        filter: 'customer',
        options: [],
        hasAutoComplete: true,
        optionalParents: ['quotation'],
        multiSelect: true,
      },
      {
        filter: 'quotation',
        options: [],
        hasAutoComplete: true,
        optionalParents: [],
        multiSelect: false,
      },
      {
        filter: 'keyAccount',
        options: [],
        hasAutoComplete: true,
        optionalParents: [],
        multiSelect: true,
      },
      {
        filter: 'subKeyAccount',
        options: [],
        hasAutoComplete: true,
        optionalParents: [],
        multiSelect: true,
      },
      {
        filter: 'country',
        options: [],
        hasAutoComplete: false,
        optionalParents: [],
        multiSelect: true,
      },
      {
        filter: 'subSector',
        options: [],
        hasAutoComplete: false,
        optionalParents: [
          'customer',
          'quotation',
          'keyAccount',
          'subKeyAccount',
          'country',
        ],
        multiSelect: true,
      },
      {
        filter: 'sectorGPSD',
        options: [],
        hasAutoComplete: false,
        optionalParents: [
          'customer',
          'quotation',
          'keyAccount',
          'subKeyAccount',
        ],
        multiSelect: true,
      },
      {
        filter: 'soldToParty',
        options: [],
        hasAutoComplete: false,
        optionalParents: [
          'customer',
          'quotation',
          'keyAccount',
          'subKeyAccount',
        ],
        multiSelect: true,
      },
      {
        filter: 'subRegion',
        options: [],
        hasAutoComplete: false,
        optionalParents: ['keyAccount', 'subkeyAccount'],
        multiSelect: true,
      },
      {
        filter: 'sectorManagement',
        options: [],
        hasAutoComplete: false,
        optionalParents: ['keyAccount', 'subkeyAccount'],
        multiSelect: true,
      },
      {
        filter: 'mainSector',
        options: [],
        hasAutoComplete: false,
        optionalParents: ['keyAccount', 'subkeyAccount'],
        multiSelect: true,
      },
      {
        filter: 'materialNumber',
        options: [],
        hasAutoComplete: true,
        optionalParents: [],
        multiSelect: true,
      },
      {
        filter: 'quantity',
        options: [],
        hasAutoComplete: false,
        optionalParents: [],
        multiSelect: true,
      },
    ],
    selected: 'customer',
    queryInputs: [
      'customer',
      'quotation',
      'keyAccount',
      'subKeyAccount',
      'country',
    ],
  },
  queryList: [],
};

export const searchReducer = createReducer(
  initialState,
  on(autocomplete, (state: SearchState, { autocompleteSearch }) => ({
    ...state,
    filters: {
      ...state.filters,
      autocompleteLoading: autocompleteSearch.filter,
    },
  })),
  on(autocompleteSuccess, (state: SearchState, { filter, options }) => ({
    ...state,
    filters: {
      ...state.filters,
      autocompleteLoading: undefined,
      items: [...state.filters.items].map((it) => {
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
  on(autocompleteFailure, (state: SearchState) => ({
    ...state,
    filters: { ...state.filters, autocompleteLoading: undefined },
  })),
  on(addOption, (state: SearchState, { option, filterName }) => ({
    ...state,
    filters: {
      ...state.filters,
      items: [...state.filters.items].map((it) => {
        const temp = { ...it };
        if (temp.filter === filterName) {
          const index = temp.options.findIndex(
            (idValue) => idValue.id === option.id
          );
          if (index > -1) {
            temp.options = [...temp.options];
            temp.options[index] = { ...temp.options[index], selected: true };
          } else {
            temp.options = [...temp.options, option];
          }
        }

        return temp;
      }),
    },
  })),
  on(removeOption, (state: SearchState, { option, filterName }) => ({
    ...state,
    filters: {
      ...state.filters,
      items: [...state.filters.items].map((it) => {
        const temp = { ...it };

        if (temp.filter === filterName) {
          const index = temp.options.findIndex((x) => x.id === option.id);

          if (index > -1) {
            temp.options = [...temp.options];
            temp.options[index] = { ...temp.options[index], selected: false };
          }
        }

        return temp;
      }),
    },
  })),
  on(selectedFilterChange, (state: SearchState, { filterName }) => ({
    ...state,
    filters: {
      ...state.filters,
      items: [...state.filters.items].map((item) => ({ ...item, options: [] })),
      selected: filterName,
    },
  })),
  on(createQueries, (state: SearchState) => ({
    ...state,
    queryList: createQueryList(state),
  }))
);

const createQueryList = (state: SearchState): QueryItem[] => {
  const queryList: QueryItem[] = [];
  const { items } = state.filters;

  let customers: IdValue[] = [];
  let quantities: IdValue[] = [];
  let materialNumber: IdValue[] = [];

  items.forEach((item) => {
    if (item.filter === 'customer') {
      customers = item.options.filter((opt) => opt.selected);
    }
    if (item.filter === 'quantity') {
      quantities = item.options.filter((opt) => opt.selected);
    }
    if (item.filter === 'materialNumber') {
      materialNumber = item.options.filter((opt) => opt.selected);
    }
  });

  customers.forEach((cust) => {
    quantities.forEach((quant) => {
      materialNumber.forEach((mat) => {
        const queryItem = new QueryItem(cust.id, quant.id, mat.id);
        queryList.push(queryItem);
      });
    });
  });

  return queryList;
};

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: SearchState, action: Action): SearchState {
  return searchReducer(state, action);
}
