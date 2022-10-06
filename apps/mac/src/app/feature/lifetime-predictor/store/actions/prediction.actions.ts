import { createAction, props } from '@ngrx/store';

import {
  HvLimits,
  PredictionRequest,
  PredictionResult,
  StatisticalPrediction,
  StatisticalRequest,
} from '../../models';

export const postPrediction = createAction(
  '[LTP - Predict Lifetime Container Component] Post Prediction [ai_ignore]'
);

export const postMLPrediction = createAction(
  '[LTP - Predict Lifetime Container Component] Post ML Prediction [ai_ignore]'
);

export const postStatisticalPrediction = createAction(
  '[LTP - Predict Lifetime Container Component] Post Statistical Prediction [ai_ignore]'
);

export const setPredictionRequest = createAction(
  '[LTP - Input Component] Set Prediction Request [ai_ignore]',
  props<{
    predictionRequest: PredictionRequest | HvLimits;
    statisticalRequest: StatisticalRequest | HvLimits;
  }>()
);

export const setMLRequest = createAction(
  '[LTP - Input Component] Set ML Request [ai_ignore]',
  props<{ predictionRequest: PredictionRequest | HvLimits }>()
);

export const setStatisticalRequest = createAction(
  '[LTP - Input Component] Set Statistical Request [ai_ignore]',
  props<{ statisticalRequest: StatisticalRequest | HvLimits }>()
);

export const unsetPredictionRequest = createAction(
  '[LTP - Home Component] Unset Prediction Request'
);

export const unsetStatisticalRequest = createAction(
  '[LTP - Home Component] Unset Statistical Request'
);

export const setPredictionType = createAction(
  '[LTP - Predict Lifetime Container Component] Set Prediction Type',
  props<{ prediction: number }>()
);

export const setPredictionResult = createAction(
  '[LTP - Prediction Component] Set Prediction Results',
  props<{ predictionResult: PredictionResult }>()
);

export const setStatisticalResult = createAction(
  '[LTP - Prediction Component] Set Statistical Results',
  props<{ statisticalResult: StatisticalPrediction }>()
);

export const setHardness = createAction(
  '[LTP - Material Component] Set Hardness [ai_ignore]',
  props<{ selectedHardness: number }>()
);
