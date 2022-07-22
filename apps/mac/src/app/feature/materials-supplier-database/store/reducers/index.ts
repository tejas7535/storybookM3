import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromData from './data/data.reducer';
import * as fromDialog from './dialog/dialog.reducer';

export interface MSDState {
  data: fromData.DataState;
  dialog: fromDialog.DialogState;
}

export const reducers: ActionReducerMap<MSDState> = {
  data: fromData.reducer,
  dialog: fromDialog.reducer,
};

export const getMSDState = createFeatureSelector<MSDState>('msd');
