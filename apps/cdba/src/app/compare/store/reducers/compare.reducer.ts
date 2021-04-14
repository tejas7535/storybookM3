import { createReducer, on } from '@ngrx/store';

import { BomItem } from '@cdba/core/store/reducers/detail/models';

import { ReferenceTypeIdentifier } from '../../../core/store/reducers/detail/models';
import { Calculation } from '../../../core/store/reducers/shared/models';
import {
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  selectBomItem,
  selectCalculation,
  selectReferenceTypes,
} from '../actions/compare.actions';

export interface CompareState {
  [index: number]: {
    referenceType?: ReferenceTypeIdentifier;
    calculations?: {
      items: Calculation[];
      selected: Calculation;
      selectedNodeId: string;
      loading: boolean;
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
  on(selectReferenceTypes, (_state, { referenceTypeIdentifiers }) => {
    const state: CompareState = {};

    referenceTypeIdentifiers.forEach((identifier, index: number) => {
      state[index] = { referenceType: identifier };
    });

    return state;
  }),
  on(loadBomSuccess, (state, { items, index }) =>
    state[index]
      ? {
          ...state,
          [index]: {
            ...state[index],
            billOfMaterial: {
              ...state[index].billOfMaterial,
              items,
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
              selectedNodeId: undefined,
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
  on(loadCalculationHistorySuccess, (state, { items, index }) =>
    state[index]
      ? {
          ...state,
          [index]: {
            ...state[index],
            calculations: {
              ...state[index].calculations,
              items,
              selected: items[0],
              selectedNodeId: '0',
              loading: false,
            },
          },
        }
      : state
  ),
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
