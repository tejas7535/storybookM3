import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer
} from '@ngrx/store';

import * as fromBannerReducer from './banner/banner.reducer';

export interface AppState {
  banner: fromBannerReducer.BannerState;
}

export const reducers: ActionReducerMap<AppState> = {
  banner: fromBannerReducer.reducer
};

export const metaReducers: MetaReducer<AppState>[] = [];

export const getBannerState = createFeatureSelector<
  fromBannerReducer.BannerState
>('banner');
