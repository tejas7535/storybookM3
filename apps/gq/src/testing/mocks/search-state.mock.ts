import { SearchState } from '../../app/core/store/reducers/search/search.reducer';

export const SEARCH_STATE_MOCK: SearchState = {
  filters: {
    autocompleteLoading: undefined,
    items: [
      {
        filter: 'customer',
        options: [],
        hasAutoComplete: false,
        optionalParents: [],
        multiSelect: true,
      },
      {
        filter: 'quotation',
        options: [],
        hasAutoComplete: false,
        optionalParents: [],
        multiSelect: false,
      },
      {
        filter: 'keyAccount',
        options: [{ id: 'key', value: 'key', selected: true }],
        hasAutoComplete: false,
        optionalParents: [],
        multiSelect: true,
      },
      {
        filter: 'subKeyAccount',
        options: [],
        hasAutoComplete: false,
        optionalParents: [],
        multiSelect: true,
      },
      {
        filter: 'sector',
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
      'keyaccount',
      'subkeyaccount',
      'sector',
    ],
  },
  queryList: [],
};
