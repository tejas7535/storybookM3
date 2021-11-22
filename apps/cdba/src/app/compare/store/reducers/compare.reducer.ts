import { createReducer, on } from '@ngrx/store';

import {
  BomItem,
  Calculation,
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
      error: string;
    };
    calculations?: {
      items?: Calculation[];
      selected?: Calculation;
      selectedNodeId?: string;
      loading?: boolean;
      error?: string;
    };
    billOfMaterial?: {
      items?: BomItem[];
      selected?: BomItem;
      loading?: boolean;
      error?: string;
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
                error: undefined,
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
    (state, { error, index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              details: {
                ...state[index].details,
                error,
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
    (state, { error, index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              billOfMaterial: {
                error,
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
    (state, { error, index }): CompareState =>
      state[index]
        ? {
            ...state,
            [index]: {
              ...state[index],
              calculations: {
                ...state[index].calculations,
                error,
                items: [],
                loading: false,
              },
              billOfMaterial: {
                ...state[index].billOfMaterial,
                error,
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
