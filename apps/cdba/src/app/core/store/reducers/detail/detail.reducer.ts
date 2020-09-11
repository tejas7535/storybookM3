import { createReducer, on } from '@ngrx/store';

import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  loadReferenceType,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
  selectBomItem,
  selectCalculation,
  selectReferenceType,
} from '../../actions';
import { Calculation, ReferenceType } from '../shared/models';
import { BomItem, ReferenceTypeIdentifier } from './models';

export interface DetailState {
  selectedReferenceType: ReferenceTypeIdentifier;
  detail: {
    loading: boolean;
    referenceType: ReferenceType;
    errorMessage: string;
  };
  calculations: {
    loading: boolean;
    items: Calculation[];
    selected: { nodeId: string; calculation: Calculation };
    errorMessage: string;
  };
  bom: {
    loading: boolean;
    items: BomItem[];
    selectedItem: BomItem;
    errorMessage: string;
  };
}

export const initialState: DetailState = {
  selectedReferenceType: undefined,
  detail: {
    loading: false,
    referenceType: undefined,
    errorMessage: undefined,
  },
  calculations: {
    loading: false,
    items: undefined,
    selected: undefined,
    errorMessage: undefined,
  },
  bom: {
    loading: false,
    items: undefined,
    selectedItem: undefined,
    errorMessage: undefined,
  },
};

export const detailReducer = createReducer(
  initialState,
  on(
    selectReferenceType,
    (state: DetailState, { referenceTypeIdentifier }) => ({
      ...state,
      selectedReferenceType: referenceTypeIdentifier,
    })
  ),
  on(loadReferenceType, (state: DetailState) => ({
    ...state,
    detail: {
      referenceType: undefined,
      loading: true,
      errorMessage: undefined,
    },
  })),
  on(loadReferenceTypeSuccess, (state: DetailState, { item }) => ({
    ...state,
    detail: {
      ...state.detail,
      loading: false,
      referenceType: item.referenceTypeDto,
      errorMessage: undefined,
    },
  })),
  on(loadReferenceTypeFailure, (state: DetailState, { errorMessage }) => ({
    ...state,
    detail: {
      ...state.detail,
      errorMessage,
      loading: false,
    },
  })),
  on(loadCalculations, (state: DetailState) => ({
    ...state,
    calculations: {
      items: undefined,
      selected: undefined,
      loading: true,
      errorMessage: undefined,
    },
    bom: {
      items: undefined,
      loading: true,
      selectedItem: undefined,
      errorMessage: undefined,
    },
  })),
  on(loadCalculationsSuccess, (state: DetailState, { items }) => ({
    ...state,
    calculations: {
      ...state.calculations,
      items,
      selected: {
        nodeId: '0',
        calculation: items[0],
      },
      loading: false,
    },
  })),
  on(loadCalculationsFailure, (state: DetailState, { errorMessage }) => ({
    ...state,
    calculations: {
      ...state.calculations,
      errorMessage,
      items: [],
      loading: false,
    },
    bom: {
      ...state.bom,
      errorMessage,
      items: [],
      loading: false,
    },
  })),
  on(selectCalculation, (state: DetailState, { nodeId, calculation }) => ({
    ...state,
    calculations: { ...state.calculations, selected: { nodeId, calculation } },
  })),
  on(loadBom, (state: DetailState) => ({
    ...state,
    bom: {
      items: undefined,
      loading: true,
      selectedItem: undefined,
      errorMessage: undefined,
    },
  })),
  on(loadBomSuccess, (state: DetailState, { items }) => ({
    ...state,
    bom: {
      ...state.bom,
      items,
      selectedItem: items[0],
      loading: false,
    },
  })),
  on(loadBomFailure, (state: DetailState, { errorMessage }) => ({
    ...state,
    bom: {
      ...state.bom,
      errorMessage,
      items: [],
      loading: false,
    },
  })),
  on(selectBomItem, (state: DetailState, { item }) => ({
    ...state,
    bom: { ...state.bom, selectedItem: item },
  }))
);
