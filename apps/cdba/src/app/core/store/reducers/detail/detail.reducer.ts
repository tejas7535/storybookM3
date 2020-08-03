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
  };
  calculations: {
    loading: boolean;
    items: Calculation[];
  };
  bom: {
    loading: boolean;
    items: BomItem[];
  };
}

export const initialState: DetailState = {
  detail: {
    loading: false,
    referenceType: undefined,
  },
  calculations: {
    loading: false,
    items: undefined,
  },
  bom: {
    loading: false,
    items: undefined,
  },
};

export const detailReducer = createReducer(
  initialState,
  on(loadReferenceType, (state: DetailState) => ({
    ...state,
    detail: { ...state.detail, loading: true },
    calculations: { ...state.calculations, loading: true },
  })),
  on(loadReferenceTypeSuccess, (state: DetailState, { item }) => ({
    ...state,
    detail: {
      ...state.detail,
      loading: false,
      referenceType: item.referenceTypeDto,
    },
  })),
  on(loadReferenceTypeFailure, (state: DetailState) => ({
    ...state,
    detail: {
      ...state.detail,
      loading: false,
    },
  })),
  on(loadCalculations, (state: DetailState) => ({
    ...state,
    calculations: {
      ...state.calculations,
      loading: true,
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
  on(loadCalculationsFailure, (state: DetailState) => ({
    ...state,
    calculations: {
      ...state.calculations,
      items: [],
      loading: false,
    },
  })),
  on(loadBom, (state: DetailState) => ({
    ...state,
    bom: {
      ...state.bom,
      loading: true,
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
  on(loadBomFailure, (state: DetailState) => ({
    ...state,
    bom: {
      ...state.bom,
      items: [],
      loading: false,
    },
  }))
);
