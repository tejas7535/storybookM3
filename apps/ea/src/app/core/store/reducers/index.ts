import { environment } from '@ea/environments/environment';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { CalculationParametersState, CalculationResultState } from '../models';
import { calculationParametersReducer } from './calculation-parameters/calculation-parameters.reducer';
import { calculationResultReducer } from './calculation-result/calculation-result.reducer';

export interface AppState {
  calculationParameters: CalculationParametersState;
  calculationResult: CalculationResultState;
}

export const reducers: ActionReducerMap<AppState> = {
  calculationParameters: calculationParametersReducer,
  calculationResult: calculationResultReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getCalculationParametersState =
  createFeatureSelector<CalculationParametersState>('calculationParameters');

export const getCalculationResultState =
  createFeatureSelector<CalculationResultState>('calculationResult');
