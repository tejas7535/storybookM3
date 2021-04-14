import {
  DetailState,
  initialState,
} from '@cdba/core/store/reducers/detail/detail.reducer';

import {
  BOM_MOCK,
  CALCULATIONS_MOCK,
  DRAWINGS_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
  REFERENCE_TYPE_MOCK,
} from '../models';

export const DETAIL_STATE_MOCK: DetailState = {
  ...initialState,
  selectedReferenceType: REFERENCE_TYPE_IDENTIFIER_MOCK,
  detail: {
    ...initialState.detail,
    loading: true,
    referenceType: REFERENCE_TYPE_MOCK,
  },
  calculations: {
    ...initialState.calculations,
    loading: true,
    items: CALCULATIONS_MOCK,
    selected: {
      nodeId: '3',
      calculation: CALCULATIONS_MOCK[2],
    },
  },
  bom: {
    loading: true,
    items: BOM_MOCK,
    selectedItem: BOM_MOCK[0],
    errorMessage: 'Error',
  },
  drawings: {
    loading: true,
    items: DRAWINGS_MOCK,
    selected: {
      nodeId: '3',
      drawing: DRAWINGS_MOCK[2],
    },
    errorMessage: '404',
  },
};
