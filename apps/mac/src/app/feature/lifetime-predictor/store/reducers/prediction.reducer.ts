import { Action, createReducer, on } from '@ngrx/store';

import {
  PredictionRequest,
  PredictionResult,
  StatisticalPrediction,
  StatisticalRequest,
} from '../../models';
import * as PredictionActions from '../actions/prediction.actions';

export interface PredictionState {
  predictionRequest: PredictionRequest;
  predictionResult: PredictionResult;
  statisticalRequest: StatisticalRequest;
  statisticalResult: StatisticalPrediction;
}

export const initialState: PredictionState = {
  predictionRequest: {
    prediction: 0,
    mpa: 400,
    v90: 1,
    hv: 180,
    hv_lower: 180,
    hv_upper: 180,
    rrelation: -1,
    burdeningType: 0,
    model: 5,
    spreading: 0,
    rArea: 5,
    es: 0,
    rz: 0,
    hv_core: 500,
    a90: 100,
    gradient: 1,
    multiaxiality: 0,
  },
  statisticalRequest: {
    rz: 0,
    es: 0,
    hardness: 180,
    r: -1,
    rArea: 5,
    v90: 1,
    loadingType: 0,
  },
  predictionResult: undefined,
  statisticalResult: undefined,
};

export const predictionReducer = createReducer(
  initialState,
  on(
    PredictionActions.setMLRequest,
    (state, { predictionRequest }): PredictionState => ({
      ...state,
      predictionRequest: {
        ...state.predictionRequest,
        ...predictionRequest,
      },
    })
  ),
  on(
    PredictionActions.setStatisticalRequest,
    (state, { statisticalRequest }): PredictionState => ({
      ...state,
      statisticalRequest: {
        ...state.statisticalRequest,
        ...statisticalRequest,
      },
    })
  ),
  on(
    PredictionActions.unsetPredictionRequest,
    (state): PredictionState => ({
      ...state,
      predictionRequest: initialState.predictionRequest,
    })
  ),
  on(
    PredictionActions.unsetStatisticalRequest,
    (state): PredictionState => ({
      ...state,
      statisticalRequest: initialState.statisticalRequest,
    })
  ),
  on(
    PredictionActions.setPredictionType,
    (state, { prediction }): PredictionState => ({
      ...state,
      predictionRequest: {
        ...state.predictionRequest,
        prediction,
      },
    })
  ),
  on(
    PredictionActions.setPredictionResult,
    (state, { predictionResult }): PredictionState => ({
      ...state,
      predictionResult,
    })
  ),
  on(
    PredictionActions.setStatisticalResult,
    (state, { statisticalResult }): PredictionState => ({
      ...state,
      statisticalResult,
    })
  ),
  on(
    PredictionActions.setHardness,
    (state, { selectedHardness }): PredictionState => ({
      ...state,
      predictionRequest: {
        ...state.predictionRequest,
        hv: selectedHardness,
      },
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: PredictionState,
  action: Action
): PredictionState {
  return predictionReducer(state, action);
}
