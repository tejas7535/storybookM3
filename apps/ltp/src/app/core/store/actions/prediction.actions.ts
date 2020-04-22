import { createAction, props } from '@ngrx/store';

import {
  LoadsRequest,
  PredictionRequest,
  PredictionResult
} from '../../../shared/models';

export const postPrediction = createAction(
  '[Predict Lifetime Container Component] Post Prediction'
);

export const setPredictionRequest = createAction(
  '[Input Component] Set Prediction Request',
  props<{ predictionRequest: PredictionRequest }>()
);

export const unsetPredictionRequest = createAction(
  '[Home Component] Unset Prediction Request'
);

export const setPredictionType = createAction(
  '[Predict Lifetime Container Component] Set Prediction Type',
  props<{ prediction: number }>()
);

export const setPredictionResult = createAction(
  '[Prediction Component] Set Prediction Results',
  props<{ predictionResult: PredictionResult }>()
);

export const postLoadsData = createAction(
  '[Ouput Wohler Chart Component] Get Load Data',
  props<{ loadsRequest: LoadsRequest }>()
);

export const setLoadsResult = createAction(
  '[Ouput Wohler Chart Component] Set Loads Result',
  props<{ loads: any; status: number; error: string }>()
);

export const setHardness = createAction(
  '[Material Component] Set Hardness',
  props<{ selectedHardness: number }>()
);
