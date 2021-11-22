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
  REFERENCE_TYPE_MOCK_WITHOUT_SALES_INFORMATION,
} from '../models';

export const DETAIL_STATE_MOCK: DetailState = {
  ...initialState,
  selectedReferenceType: REFERENCE_TYPE_IDENTIFIER_MOCK,
  detail: {
    ...initialState.detail,
    loading: true,
    referenceType: REFERENCE_TYPE_MOCK,
    error: 'Error',
  },
  calculations: {
    ...initialState.calculations,
    loading: true,
    items: CALCULATIONS_MOCK,
    selectedCalculation: {
      nodeId: '3',
      calculation: CALCULATIONS_MOCK[2],
    },
    selectedNodeIds: ['3', '4'],
  },
  bom: {
    loading: true,
    items: BOM_MOCK,
    selectedItem: BOM_MOCK[0],
    error: 'Error',
  },
  drawings: {
    loading: true,
    items: DRAWINGS_MOCK,
    selected: {
      nodeId: '3',
      drawing: DRAWINGS_MOCK[2],
    },
    error: '404',
  },
};

export const DETAIL_STATE_MISSING_SALES_INFORMATION_MOCK: DetailState = {
  ...initialState,
  selectedReferenceType: REFERENCE_TYPE_IDENTIFIER_MOCK,
  detail: {
    ...initialState.detail,
    loading: true,
    referenceType: REFERENCE_TYPE_MOCK_WITHOUT_SALES_INFORMATION,
    error: 'Error',
  },
  calculations: {
    ...initialState.calculations,
    loading: true,
    items: CALCULATIONS_MOCK,
    selectedCalculation: {
      nodeId: '3',
      calculation: CALCULATIONS_MOCK[2],
    },
    selectedNodeIds: ['3', '4'],
  },
  bom: {
    loading: true,
    items: BOM_MOCK,
    selectedItem: BOM_MOCK[0],
    error: 'Error',
  },
  drawings: {
    loading: true,
    items: DRAWINGS_MOCK,
    selected: {
      nodeId: '3',
      drawing: DRAWINGS_MOCK[2],
    },
    error: '404',
  },
};
