import { environment } from '@ea/environments/environment';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import {
  CalculationParametersState,
  CatalogCalculationResultState,
  CO2UpstreamCalculationResultState,
  ProductSelectionState,
  SettingsState,
} from '../models';
import { calculationParametersReducer } from './calculation-parameters/calculation-parameters.reducer';
import { catalogCalculationResultReducer } from './calculation-result/catalog-calculation-result.reducer';
import { co2UpstreamCalculationResultReducer } from './calculation-result/co2-upstream-calculation-result.reducer';
import { productSelectionReducer } from './product-selection/product-selection.reducer';
import { settingsReducer } from './settings/settings.reducer';

export interface AppState {
  calculationParameters: CalculationParametersState;
  productSelection: ProductSelectionState;
  settings: SettingsState;
  co2UpstreamCalculationResult: CO2UpstreamCalculationResultState;
  catalogCalculationResult: CatalogCalculationResultState;
}

export const reducers: ActionReducerMap<AppState> = {
  calculationParameters: calculationParametersReducer,
  productSelection: productSelectionReducer,
  settings: settingsReducer,
  co2UpstreamCalculationResult: co2UpstreamCalculationResultReducer,
  catalogCalculationResult: catalogCalculationResultReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getCalculationParametersState =
  createFeatureSelector<CalculationParametersState>('calculationParameters');

export const getProductSelectionState =
  createFeatureSelector<ProductSelectionState>('productSelection');

export const getSettingsState =
  createFeatureSelector<SettingsState>('settings');

export const getCO2UpstreamCalculationResultState =
  createFeatureSelector<CO2UpstreamCalculationResultState>(
    'co2UpstreamCalculationResult'
  );

export const getCatalogCalculationResultState =
  createFeatureSelector<CatalogCalculationResultState>(
    'catalogCalculationResult'
  );
