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
} from '../models';
import { calculationParametersReducer } from './calculation-parameters/calculation-parameters.reducer';
import { calculationResultReducer } from './calculation-result/calculation-result.reducer';
import { productSelectionReducer } from './product-selection/product-selection.reducer';

export interface AppState {
  calculationParameters: CalculationParametersState;
  calculationResult: CalculationResultState;
  productSelection: ProductSelectionState;
}

export const reducers: ActionReducerMap<AppState> = {
  calculationParameters: calculationParametersReducer,
  calculationResult: calculationResultReducer,
  productSelection: productSelectionReducer,
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
