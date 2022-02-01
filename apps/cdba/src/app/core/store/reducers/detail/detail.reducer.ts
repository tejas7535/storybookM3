import {
  BomItem,
  Calculation,
  Drawing,
  ExcludedCalculations,
  ReferenceType,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';
import { createReducer, on } from '@ngrx/store';

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
    errorMessage: string;
  };
  calculations: {
    loading: boolean;
    items: Calculation[];
    excludedItems: ExcludedCalculations;
    selectedNodeIds: string[];
    selectedCalculation: { nodeId: string; calculation: Calculation };
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
    excludedItems: undefined,
    selectedNodeIds: undefined,
    selectedCalculation: undefined,
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
    (state: DetailState, { errorMessage }): DetailState => ({
      ...state,
      detail: {
        ...state.detail,
        errorMessage,
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
    (
      state: DetailState,
      { calculations, excludedCalculations, referenceTypeIdentifier }
    ): DetailState => {
      const selectedCalculation = referenceTypeIdentifier
        ? calculations.find(
            (calculation) => calculation.plant === referenceTypeIdentifier.plant
          )
        : calculations[0];

      const nodeId: string = (
        calculations.indexOf(selectedCalculation) || 0
      ).toString();

      return {
        ...state,
        calculations: {
          ...state.calculations,
          items: calculations,
          excludedItems: excludedCalculations,
          selectedNodeIds: [nodeId],
          selectedCalculation: {
            nodeId,
            calculation: selectedCalculation,
          },
          loading: false,
        },
      };
    }
  ),
  on(
    loadCalculationsFailure,
    (state: DetailState, { errorMessage }): DetailState => ({
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
    (state: DetailState, { errorMessage }): DetailState => ({
      ...state,
      drawings: {
        ...state.drawings,
        errorMessage,
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
    (state: DetailState, { errorMessage }): DetailState => ({
      ...state,
      bom: {
        ...state.bom,
        errorMessage,
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
