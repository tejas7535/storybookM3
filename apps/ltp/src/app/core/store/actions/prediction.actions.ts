import { createAction, props } from '@ngrx/store';

import {
  HvLimits,
  Loads,
  LoadsRequest,
  PredictionRequest,
  PredictionResult,
  StatisticalPrediction,
  StatisticalRequest,
} from '../../../shared/models';

export const postPrediction = createAction(
  '[Predict Lifetime Container Component] Post Prediction'
);

export const postMLPrediction = createAction(
  '[Predict Lifetime Container Component] Post ML Prediction'
);

export const postStatisticalPrediction = createAction(
  '[Predict Lifetime Container Component] Post Statistical Prediction'
);

export const setPredictionRequest = createAction(
  '[Input Component] Set Prediction Request',
  props<{
    predictionRequest: PredictionRequest | HvLimits;
    statisticalRequest: StatisticalRequest | HvLimits;
  }>()
);

export const setMLRequest = createAction(
  '[Input Component] Set ML Request',
  props<{ predictionRequest: PredictionRequest | HvLimits }>()
);

export const setStatisticalRequest = createAction(
  '[Input Component] Set Statistical Request',
  props<{ statisticalRequest: StatisticalRequest | HvLimits }>()
);

export const unsetPredictionRequest = createAction(
  '[Home Component] Unset Prediction Request'
);

export const unsetStatisticalRequest = createAction(
  '[Home Component] Unset Statistical Request'
);

export const setPredictionType = createAction(
  '[Predict Lifetime Container Component] Set Prediction Type',
  props<{ prediction: number }>()
);

export const setPredictionResult = createAction(
  '[Prediction Component] Set Prediction Results',
  props<{ predictionResult: PredictionResult }>()
);

export const setStatisticalResult = createAction(
  '[Prediction Component] Set Statistical Results',
  props<{ statisticalResult: StatisticalPrediction }>()
);

export const setLoadsRequest = createAction(
  '[Ouput Wohler Chart Component] Set Loads Request',
  props<{ loadsRequest: LoadsRequest }>()
);

export const postLoadsData = createAction(
  '[Ouput Wohler Chart Component] Get Load Data'
);

export const setLoadsResult = createAction(
  '[Ouput Wohler Chart Component] Set Loads Result',
  props<{
    loads: Loads;
    status: number;
    error: string;
  }>()
);

export const setHardness = createAction(
  '[Material Component] Set Hardness',
  props<{ selectedHardness: number }>()
);
