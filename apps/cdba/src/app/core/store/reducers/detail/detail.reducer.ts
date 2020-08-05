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
} from '../../actions';
import { ReferenceType } from '../shared/models';
import { Calculation } from '../shared/models/calculation.model';
import { BomItem } from './models';

export interface DetailState {
  detail: {
    loading: boolean;
    referenceType: ReferenceType;
    errorMessage: string;
  };
  calculations: {
    loading: boolean;
    items: Calculation[];
    errorMessage: string;
  };
  bom: {
    loading: boolean;
    items: BomItem[];
    errorMessage: string;
  };
}

export const initialState: DetailState = {
  detail: {
    loading: false,
    referenceType: undefined,
    errorMessage: undefined,
  },
  calculations: {
    loading: false,
    items: undefined,
    errorMessage: undefined,
  },
  bom: {
    loading: false,
    items: undefined,
    errorMessage: undefined,
  },
};

export const detailReducer = createReducer(
  initialState,
  on(loadReferenceType, (state: DetailState) => ({
    ...state,
    detail: { ...state.detail, loading: true, errorMessage: undefined },
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
      ...state.calculations,
      loading: true,
      errorMessage: undefined,
    },
  })),
  on(loadCalculationsSuccess, (state: DetailState, { items }) => ({
    ...state,
    calculations: {
      ...state.calculations,
      items,
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
  })),
  on(loadBom, (state: DetailState) => ({
    ...state,
    bom: {
      ...state.bom,
      loading: true,
      errorMessage: undefined,
    },
  })),
  on(loadBomSuccess, (state: DetailState, { items }) => ({
    ...state,
    bom: {
      ...state.bom,
      items,
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
  }))
);
