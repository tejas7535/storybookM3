import { environment } from '@ea/environments/environment';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import {
  CalculationParametersState,
  CalculationResultState,
  ProductSelectionState,
  SettingsState,
} from '../models';
import { calculationParametersReducer } from './calculation-parameters/calculation-parameters.reducer';
import { calculationResultReducer } from './calculation-result/calculation-result.reducer';
import { productSelectionReducer } from './product-selection/product-selection.reducer';
import { settingsReducer } from './settings/settings.reducer';

export interface AppState {
  calculationParameters: CalculationParametersState;
  calculationResult: CalculationResultState;
  productSelection: ProductSelectionState;
  settings: SettingsState;
}

export const reducers: ActionReducerMap<AppState> = {
  calculationParameters: calculationParametersReducer,
  calculationResult: calculationResultReducer,
  productSelection: productSelectionReducer,
  settings: settingsReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getCalculationParametersState =
  createFeatureSelector<CalculationParametersState>('calculationParameters');

export const getCalculationResultState =
  createFeatureSelector<CalculationResultState>('calculationResult');

export const getProductSelectionState =
  createFeatureSelector<ProductSelectionState>('productSelection');

export const getSettingsState =
  createFeatureSelector<SettingsState>('settings');
