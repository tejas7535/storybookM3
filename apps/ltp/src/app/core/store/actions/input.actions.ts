import { createAction, props } from '@ngrx/store';

import { ChartType } from '../../../shared/enums';
import {
  BurdeningType,
  Display,
  Material,
  Prediction,
} from '../../../shared/models';

export const getFormOptions = createAction(
  '[Input Component] Get Form Options'
);

export const setPredictionOptions = createAction(
  '[Predict Lifetime Container Component] Set Prediction Options',
  props<{ predictions: Prediction[] }>()
);

export const getPredictionsFailure = createAction(
  '[Predict Lifetime Container Component] Get Predictions Failure'
);

export const setBurdeningTypeOptions = createAction(
  '[Predict Lifetime Container Component] Set BurdeningType Options',
  props<{ burdeningTypes: BurdeningType[] }>()
);

export const getBurdeningTypesFailure = createAction(
  '[Predict Lifetime Container Component] Get Burdening Types Failure'
);

export const setMaterialOptions = createAction(
  '[Material Component] Set Material Options',
  props<{ materials: Material[] }>()
);

export const getMaterialsFailure = createAction(
  '[Predict Lifetime Container Component] Get Materials Failure'
);

export const setChartType = createAction(
  '[Prediction Component] Set Chart Type',
  props<{ chartType: ChartType }>()
);

export const setMaterial = createAction(
  '[Material Component] Set Material',
  props<{ selectedMaterial: string }>()
);
export const unsetMaterial = createAction(
  '[Material Component] Unset Material'
);

export const setDisplay = createAction(
  '[Input Component] Set Display',
  props<{ display: Display }>()
);
export const unsetDisplay = createAction('[Home Component] Unset Display');

export const setBannerVisible = createAction(
  '[Home Component] Set Banner Visible',
  props<{ bannerOpen: boolean }>()
);
