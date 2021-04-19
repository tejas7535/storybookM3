import { createReducer, on } from '@ngrx/store';

import {
  BomItem,
  Calculation,
  Drawing,
  ReferenceType,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';

import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  loadDrawings,
  loadDrawingsFailure,
  loadDrawingsSuccess,
  loadReferenceType,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
  selectBomItem,
  selectCalculation,
  selectDrawing,
  selectReferenceType,
} from '../../actions';

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
  drawings: {
    loading: boolean;
    items: Drawing[];
    selected: { nodeId: string; drawing: Drawing };
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
  drawings: {
    loading: false,
    items: undefined,
    selected: undefined,
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
      ...initialState.detail,
      loading: true,
    },
  })),
  on(loadReferenceTypeSuccess, (state: DetailState, { item }) => ({
    ...state,
    detail: {
      ...initialState.detail,
      referenceType: item.referenceTypeDto,
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
      ...initialState.calculations,
      loading: true,
    },
    bom: {
      ...initialState.bom,
      loading: true,
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
  on(loadDrawings, (state: DetailState) => ({
    ...state,
    drawings: {
      ...initialState.drawings,
      loading: true,
    },
  })),
  on(loadDrawingsSuccess, (state: DetailState, { items }) => ({
    ...state,
    drawings: {
      ...state.drawings,
      items,
      selected: {
        nodeId: '0',
        drawing: items[0],
      },
      loading: false,
    },
  })),
  on(loadDrawingsFailure, (state: DetailState, { errorMessage }) => ({
    ...state,
    drawings: {
      ...state.drawings,
      errorMessage,
      items: [],
      loading: false,
    },
  })),
  on(selectDrawing, (state: DetailState, { nodeId, drawing }) => ({
    ...state,
    drawings: { ...state.drawings, selected: { nodeId, drawing } },
  })),
  on(loadBom, (state: DetailState) => ({
    ...state,
    bom: {
      ...initialState.bom,
      loading: true,
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
