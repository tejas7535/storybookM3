import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromInput from './input.reducer';
import * as fromPrediction from './prediction.reducer';

export interface LTPState {
  input: fromInput.InputState;
  prediction: fromPrediction.PredictionState;
}

export const reducers: ActionReducerMap<LTPState> = {
  input: fromInput.reducer,
  prediction: fromPrediction.reducer,
};

export const getLTPState = createFeatureSelector<LTPState>('ltp');
