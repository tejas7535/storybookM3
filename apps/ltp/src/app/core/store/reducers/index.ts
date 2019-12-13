import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { BannerReducer, BannerState } from '@schaeffler/shared/ui-components';

import * as fromInput from './input.reducer';
import * as fromPrediction from './prediction.reducer';

export const getInputState = createFeatureSelector<fromInput.InputState>(
  'input'
);
export const getPredictionState = createFeatureSelector<
  fromPrediction.PredictionState
>('prediction');

export interface LTPState {
  input: fromInput.InputState;
  prediction: fromPrediction.PredictionState;
  banner: BannerState;
}

export const reducers: ActionReducerMap<LTPState> = {
  input: fromInput.reducer,
  prediction: fromPrediction.reducer,
  banner: BannerReducer
};

export const getLTPState = createFeatureSelector<LTPState>('LTP');

export const getBannerState = createFeatureSelector<BannerState>('banner');
