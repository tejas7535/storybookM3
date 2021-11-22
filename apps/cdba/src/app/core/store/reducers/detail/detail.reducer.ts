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
  selectCalculations,
  selectDrawing,
  selectReferenceType,
} from '../../actions';

export interface DetailState {
  selectedReferenceType: ReferenceTypeIdentifier;
  detail: {
    loading: boolean;
    referenceType: ReferenceType;
    error: string;
  };
  calculations: {
    loading: boolean;
    items: Calculation[];
    selectedNodeIds: string[];
    selectedCalculation: { nodeId: string; calculation: Calculation };
    error: string;
  };
  bom: {
    loading: boolean;
    items: BomItem[];
    selectedItem: BomItem;
    error: string;
  };
  drawings: {
    loading: boolean;
    items: Drawing[];
    selected: { nodeId: string; drawing: Drawing };
    error: string;
  };
}

export const initialState: DetailState = {
  selectedReferenceType: undefined,
  detail: {
    loading: false,
    referenceType: undefined,
    error: undefined,
  },
  calculations: {
    loading: false,
    items: undefined,
    selectedNodeIds: undefined,
    selectedCalculation: undefined,
    error: undefined,
  },
  bom: {
    loading: false,
    items: undefined,
    selectedItem: undefined,
    error: undefined,
  },
  drawings: {
    loading: false,
    items: undefined,
    selected: undefined,
    error: undefined,
  },
};

export const detailReducer = createReducer(
  initialState,
  on(
    selectReferenceType,
    (state: DetailState, { referenceTypeIdentifier }): DetailState => ({
      ...state,
      selectedReferenceType: referenceTypeIdentifier,
    })
  ),
  on(
    loadReferenceType,
    (state: DetailState): DetailState => ({
      ...state,
      detail: {
        ...initialState.detail,
        loading: true,
      },
    })
  ),
  on(
    loadReferenceTypeSuccess,
    (state: DetailState, { item }): DetailState => ({
      ...state,
      detail: {
        ...initialState.detail,
        referenceType: item.referenceTypeDto,
      },
    })
  ),
  on(
    loadReferenceTypeFailure,
    (state: DetailState, { error }): DetailState => ({
      ...state,
      detail: {
        ...state.detail,
        error,
        loading: false,
      },
    })
  ),
  on(
    loadCalculations,
    (state: DetailState): DetailState => ({
      ...state,
      calculations: {
        ...initialState.calculations,
        loading: true,
      },
      bom: {
        ...initialState.bom,
        loading: true,
      },
    })
  ),
  on(
    loadCalculationsSuccess,
    (state: DetailState, { items }): DetailState => ({
      ...state,
      calculations: {
        ...state.calculations,
        items,
        selectedNodeIds: ['0'],
        selectedCalculation: {
          nodeId: '0',
          calculation: items[0],
        },
        loading: false,
      },
    })
  ),
  on(
    loadCalculationsFailure,
    (state: DetailState, { error }): DetailState => ({
      ...state,
      calculations: {
        ...state.calculations,
        error,
        items: [],
        loading: false,
      },
      bom: {
        ...state.bom,
        error,
        items: [],
        loading: false,
      },
    })
  ),
  on(
    selectCalculation,
    (state: DetailState, { nodeId, calculation }): DetailState => ({
      ...state,
      calculations: {
        ...state.calculations,
        selectedCalculation: { nodeId, calculation },
      },
    })
  ),
  on(
    selectCalculations,
    (state: DetailState, { nodeIds }): DetailState => ({
      ...state,
      calculations: {
        ...state.calculations,
        selectedNodeIds: nodeIds,
      },
    })
  ),
  on(
    loadDrawings,
    (state: DetailState): DetailState => ({
      ...state,
      drawings: {
        ...initialState.drawings,
        loading: true,
      },
    })
  ),
  on(
    loadDrawingsSuccess,
    (state: DetailState, { items }): DetailState => ({
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
    })
  ),
  on(
    loadDrawingsFailure,
    (state: DetailState, { error }): DetailState => ({
      ...state,
      drawings: {
        ...state.drawings,
        error,
        items: [],
        loading: false,
      },
    })
  ),
  on(
    selectDrawing,
    (state: DetailState, { nodeId, drawing }): DetailState => ({
      ...state,
      drawings: { ...state.drawings, selected: { nodeId, drawing } },
    })
  ),
  on(
    loadBom,
    (state: DetailState): DetailState => ({
      ...state,
      bom: {
        ...initialState.bom,
        loading: true,
      },
    })
  ),
  on(
    loadBomSuccess,
    (state: DetailState, { items }): DetailState => ({
      ...state,
      bom: {
        ...state.bom,
        items,
        selectedItem: items[0],
        loading: false,
      },
    })
  ),
  on(
    loadBomFailure,
    (state: DetailState, { error }): DetailState => ({
      ...state,
      bom: {
        ...state.bom,
        error,
        items: [],
        loading: false,
      },
    })
  ),
  on(
    selectBomItem,
    (state: DetailState, { item }): DetailState => ({
      ...state,
      bom: { ...state.bom, selectedItem: item },
    })
  )
);
