import { createReducer, on } from '@ngrx/store';

import {
  BomItem,
  Calculation,
  CostComponentSplit,
  CostComponentSplitType,
  ExcludedCalculations,
  ReferenceType,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';

import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadCostComponentSplit,
  loadCostComponentSplitFailure,
  loadCostComponentSplitSuccess,
  loadProductDetails,
  loadProductDetailsFailure,
  loadProductDetailsSuccess,
  selectBomItem,
  selectCalculation,
  selectCompareItems,
  toggleSplitType,
} from '../actions';

export interface CompareState {
  [index: number]: {
    referenceType?: ReferenceTypeIdentifier;
    details?: {
      item: ReferenceType;
      loading: boolean;
      errorMessage: string;
    };
    calculations?: {
      items?: Calculation[];
      excludedItems?: ExcludedCalculations;
      selected?: Calculation;
      selectedNodeId?: string;
      loading?: boolean;
      errorMessage?: string;
    };
    billOfMaterial?: {
      items?: BomItem[];
      selected?: BomItem;
      loading?: boolean;
      errorMessage?: string;
    };
    costComponentSplit?: {
      loading: boolean;
      items: CostComponentSplit[];
      selectedSplitType: CostComponentSplitType;
      errorMessage: string;
    };
  };
}

export const initialState: CompareState = {};

export const compareReducer = createReducer(
  initialState,
  on(selectCompareItems, (_state, { items }) => {
    const state: CompareState = {};

    items.forEach((item, index: number) => {
      state[index] = {
        referenceType: item[1],
        calculations: { selectedNodeId: item[0] },
      };
    });

    return state;
  }),
  on(
    loadProductDetails,
    (state, { index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              details: {
                ...state[index].details,
                item: undefined,
                errorMessage: undefined,
                loading: true,
              },
            },
          }
        : state
  ),
  on(
    loadProductDetailsSuccess,
    (state, { item, index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              details: {
                ...state[index].details,
                item,
                loading: false,
              },
            },
          }
        : state
  ),
  on(
    loadProductDetailsFailure,
    (state, { errorMessage, index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              details: {
                ...state[index].details,
                errorMessage,
                item: undefined,
                loading: false,
              },
            },
          }
        : state
  ),
  on(
    loadBom,
    (state, { index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              billOfMaterial: {
                loading: true,
              },
            },
          }
        : state
  ),
  on(
    loadBomSuccess,
    (state, { items, index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              billOfMaterial: {
                ...state[index].billOfMaterial,
                items,
                selected: items[0],
                loading: false,
              },
            },
          }
        : state
  ),
  on(
    loadBomFailure,
    (state, { errorMessage, index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              billOfMaterial: {
                errorMessage,
                items: [],
                loading: false,
              },
            },
          }
        : state
  ),
  on(
    selectBomItem,
    (state, { item, index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              billOfMaterial: {
                ...state[index].billOfMaterial,
                selected: item,
              },
            },
          }
        : state
  ),
  on(
    loadCalculationHistory,
    (state, { index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              calculations: {
                ...state[index].calculations,
                items: undefined,
                selected: undefined,
                loading: true,
              },
              billOfMaterial: {
                ...state[index].billOfMaterial,
                selected: undefined,
                items: undefined,
                loading: true,
              },
            },
          }
        : state
  ),
  on(
    loadCalculationHistorySuccess,
    (state, { items, excludedItems, plant, index }): CompareState => {
      if (!state[index]) {
        return state;
      }

      const selectedCalculation = plant
        ? items.find((calculation) => calculation.plant === plant)
        : items[0];

      const nodeId: string = (
        items.indexOf(selectedCalculation) || 0
      ).toString();

      const selectedNodeId: string =
        state[index].calculations?.selectedNodeId || nodeId;

      return {
        ...state,
        [index]: {
          ...state[index],
          calculations: {
            ...state[index].calculations,
            items,
            excludedItems,
            selectedNodeId,
            selected: items[+selectedNodeId],
            loading: false,
          },
        },
      };
    }
  ),
  on(
    loadCalculationHistoryFailure,
    (state, { errorMessage, index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              calculations: {
                ...state[index].calculations,
                errorMessage,
                items: [],
                loading: false,
              },
              billOfMaterial: {
                ...state[index].billOfMaterial,
                errorMessage,
                items: [],
                loading: false,
              },
            },
          }
        : state
  ),
  on(
    selectCalculation,
    (state, { nodeId, calculation, index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              calculations: {
                ...state[index].calculations,
                selectedNodeId: nodeId,
                selected: calculation,
              },
            },
          }
        : state
  ),
  on(
    loadCostComponentSplit,
    (state: CompareState, { index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              costComponentSplit: {
                loading: true,
                items: undefined,
                errorMessage: undefined,
                selectedSplitType: 'MAIN',
              },
            },
          }
        : state
  ),
  on(
    loadCostComponentSplitSuccess,
    (state: CompareState, { items, index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              costComponentSplit: {
                ...state[index].costComponentSplit,
                items,
                loading: false,
              },
            },
          }
        : state
  ),
  on(
    loadCostComponentSplitFailure,
    (state: CompareState, { errorMessage, index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              costComponentSplit: {
                ...state[index].costComponentSplit,
                errorMessage,
                items: [],
                loading: false,
              },
            },
          }
        : state
  ),
  on(toggleSplitType, (state: CompareState): CompareState => {
    const newState: CompareState = {};

    Object.keys(state).forEach((index) => {
      if (state[+index]?.costComponentSplit) {
        newState[+index] = {
          ...state[+index],
          costComponentSplit: {
            ...state[+index].costComponentSplit,
            selectedSplitType:
              state[+index].costComponentSplit.selectedSplitType === 'MAIN'
                ? 'AUX'
                : 'MAIN',
          },
        };
      }
    });

    return newState;
  })
);
