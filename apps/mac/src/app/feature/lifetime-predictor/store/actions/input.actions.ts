import { createAction, props } from '@ngrx/store';

import { ChartType } from '../../enums';
import { BurdeningType, Display, Material, Prediction } from '../../models';

export const getFormOptions = createAction(
  '[LTP - Input Component] Get Form Options [ai_ignore]'
);

export const setPredictionOptions = createAction(
  '[LTP - Predict Lifetime Container Component] Set Prediction Options [ai_ignore]',
  props<{ predictions: Prediction[] }>()
);

export const getPredictionsFailure = createAction(
  '[LTP - Predict Lifetime Container Component] Get Predictions Failure'
);

export const setBurdeningTypeOptions = createAction(
  '[LTP - Predict Lifetime Container Component] Set BurdeningType Options [ai_ignore]',
  props<{ burdeningTypes: BurdeningType[] }>()
);

export const getBurdeningTypesFailure = createAction(
  '[LTP - Predict Lifetime Container Component] Get Burdening Types Failure'
);

export const setMaterialOptions = createAction(
  '[LTP - Material Component] Set Material Options [ai_ignore]',
  props<{ materials: Material[] }>()
);

export const getMaterialsFailure = createAction(
  '[LTP - Predict Lifetime Container Component] Get Materials Failure'
);

export const setChartType = createAction(
  '[LTP - Prediction Component] Set Chart Type',
  props<{ chartType: ChartType }>()
);

export const setMaterial = createAction(
  '[LTP - Material Component] Set Material',
  props<{ selectedMaterial: string }>()
);
export const unsetMaterial = createAction(
  '[LTP - Material Component] Unset Material'
);

export const setDisplay = createAction(
  '[LTP - Input Component] Set Display',
  props<{ display: Display }>()
);
export const unsetDisplay = createAction(
  '[LTP - Home Component] Unset Display'
);

export const setBannerVisible = createAction(
  '[LTP - Home Component] Set Banner Visible',
  props<{ bannerOpen: boolean }>()
);
