import { createReducer, on } from '@ngrx/store';

import {
  BomItem,
  Calculation,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';

import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  selectBomItem,
  selectCalculation,
  selectCompareItems,
} from '../actions/compare.actions';

export interface CompareState {
  [index: number]: {
    referenceType?: ReferenceTypeIdentifier;
    calculations?: {
      items?: Calculation[];
      selected?: Calculation;
      selectedNodeId?: string;
      loading?: boolean;
      error?: Error;
    };
    billOfMaterial?: {
      items?: BomItem[];
      selected?: BomItem;
      loading?: boolean;
      error?: Error;
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
  on(loadBom, (state, { index }) =>
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
  on(loadBomSuccess, (state, { items, index }) =>
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
  on(loadBomFailure, (state, { error, index }) =>
    state[index]
      ? {
          ...state,
          [index]: {
            ...state[index],
            billOfMaterial: { error, items: [], loading: false },
          },
        }
      : state
  ),
  on(selectBomItem, (state, { item, index }) =>
    state[index]
      ? {
          ...state,
          [index]: {
            ...state[index],
            billOfMaterial: { ...state[index].billOfMaterial, selected: item },
          },
        }
      : state
  ),
  on(loadCalculationHistory, (state, { index }) =>
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
  on(loadCalculationHistorySuccess, (state, { items, index }) => {
    if (!state[index]) {
      return state;
    }

    const selectedNodeId: string =
      // tslint:disable-next-line: strict-boolean-expressions
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
  on(loadCalculationHistoryFailure, (state, { error, index }) =>
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
  on(selectCalculation, (state, { nodeId, calculation, index }) =>
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
