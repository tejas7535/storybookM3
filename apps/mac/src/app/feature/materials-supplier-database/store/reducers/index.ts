import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromData from './data.reducer';

export interface MSDState {
  data: fromData.DataState;
}

export const reducers: ActionReducerMap<MSDState> = {
  data: fromData.reducer,
};

export const getMSDState = createFeatureSelector<MSDState>('msd');
