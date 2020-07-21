import { createReducer, on } from '@ngrx/store';

import {
  getCalculationsSuccess,
  getReferenceTypeItem,
  getReferenceTypeItemSuccess,
} from '../../actions';
import { ReferenceType } from '../shared/models';
import { Calculation } from '../shared/models/calculation.model';

export interface DetailState {
  detail: {
    loading: boolean;
    referenceType: ReferenceType;
  };
  calculations: {
    loading: boolean;
    items: Calculation[];
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
};

export const detailReducer = createReducer(
  initialState,
  on(getReferenceTypeItem, (state: DetailState) => ({
    ...state,
    detail: { ...state.detail, loading: true },
    calculations: { ...state.calculations, loading: true },
  })),
  on(getReferenceTypeItemSuccess, (state: DetailState, { item }) => ({
    ...state,
    detail: {
      ...state.detail,
      loading: false,
      referenceType: item.referenceTypeDto,
    },
  })),
  on(getCalculationsSuccess, (state: DetailState, { item }) => ({
    ...state,
    calculations: {
      ...state.calculations,
      loading: false,
      items: item.items,
    },
  }))
);
