import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromData from './data/data.reducer';
import * as fromDialog from './dialog/dialog.reducer';
import * as fromQuickfilter from './quickfilter/quickfilter.reducer';

export interface MSDState {
  data: fromData.DataState;
  dialog: fromDialog.DialogState;
  quickfilter: fromQuickfilter.QuickFilterState;
}

export const reducers: ActionReducerMap<MSDState> = {
  data: fromData.reducer,
  dialog: fromDialog.reducer,
  quickfilter: fromQuickfilter.reducer,
};

export const getMSDState = createFeatureSelector<MSDState>('msd');
