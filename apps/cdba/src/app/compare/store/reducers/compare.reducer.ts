import {
  BomItem,
  Calculation,
  ReferenceType,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';
import { createReducer, on } from '@ngrx/store';

import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadProductDetails,
  loadProductDetailsFailure,
  loadProductDetailsSuccess,
  selectBomItem,
  selectCalculation,
  selectCompareItems,
} from '../actions/compare.actions';

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
  on(loadCalculationHistorySuccess, (state, { items, index }): CompareState => {
    if (!state[index]) {
      return state;
    }

    const selectedNodeId: string =
      state[index].calculations?.selectedNodeId || '0';

    return {
      ...state,
      [index]: {
        ...state[index],
        calculations: {
          ...state[index].calculations,
          items,
          selectedNodeId,
          selected: items[+selectedNodeId],
          loading: false,
        },
      },
    };
  }),
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
  )
);
