import { createReducer, on } from '@ngrx/store';

import {
  getReferenceTypeDetails,
  getReferenceTypeItemSuccess,
} from '../../actions';
import { ReferenceType } from '../shared/models';

export interface DetailState {
  detail: {
    loading: boolean;
    referenceType: ReferenceType;
  };
}

export const initialState: DetailState = {
  detail: {
    loading: false,
    referenceType: undefined,
  },
};

export const detailReducer = createReducer(
  initialState,
  on(getReferenceTypeDetails, (state: DetailState) => ({
    ...state,
    detail: { ...state.detail, loading: true },
  })),
  on(getReferenceTypeItemSuccess, (state: DetailState, { item }) => ({
    ...state,
    detail: {
      ...state.detail,
      loading: false,
      referenceType: item.referenceTypeDto,
    },
  }))
);
