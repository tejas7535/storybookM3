import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import { CalculationOptionsState } from '../models/calculation-options-state.model';
import { CalculationResultState } from '../models/calculation-result-state.model';
import { CalculationSelectionState } from '../models/calculation-selection-state.model';
import { GlobalState } from '../models/global-state.model';
import { calculationOptionsReducer } from './calculation-options/calculation-options.reducer';
import { calculationResultReducer } from './calculation-result/calculation-result.reducer';
import { calculationSelectionReducer } from './calculation-selection/calculation-selection.reducer';
import { globalReducer } from './global/global.reducer';

export interface AppState {
  calculationSelection: CalculationSelectionState;
  calculationResult: CalculationResultState;
  calculationOptions: CalculationOptionsState;
  global: GlobalState;
}

export const reducers: ActionReducerMap<AppState> = {
  calculationSelection: calculationSelectionReducer,
  calculationResult: calculationResultReducer,
  calculationOptions: calculationOptionsReducer,
  global: globalReducer,
};

// eslint-disable-next-line unicorn/no-negated-condition
export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getCalculationSelectionState =
  createFeatureSelector<CalculationSelectionState>('calculationSelection');

export const getCalculationOptionsSelectionState =
  createFeatureSelector<CalculationOptionsState>('calculationOptions');

export const getCalculationResultState =
  createFeatureSelector<CalculationResultState>('calculationResult');

export const getGlobalState = createFeatureSelector<GlobalState>('global');
