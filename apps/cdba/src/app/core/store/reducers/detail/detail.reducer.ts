import { createReducer } from '@ngrx/store';

export interface DetailState {
  detail: any;
}

export const initialState: DetailState = {
  detail: '',
};

export const detailReducer = createReducer(initialState);
