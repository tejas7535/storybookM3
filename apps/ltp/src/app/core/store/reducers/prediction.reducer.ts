import { Action, createReducer, on } from '@ngrx/store';

import * as PredictionActions from '../actions/prediction.actions';

import {
  LoadsRequest,
  PredictionRequest,
  PredictionResult
} from '../../../shared/models';

export interface PredictionState {
  predictionRequest: PredictionRequest;
  predictionResult: PredictionResult;
  loadsRequest: LoadsRequest;
  loads: any;
}

export const initialState: PredictionState = {
  predictionRequest: {
    prediction: 0,
    mpa: 400,
    v90: 0,
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
    multiaxiality: 0
  },
  predictionResult: undefined,
  loadsRequest: {
    status: 0, // 0 initial, 1 pending, 2 success, 3 error
    error: undefined,
    data: undefined
  },
  loads: undefined
};

export const predictionReducer = createReducer(
  initialState,
  on(PredictionActions.setPredictionRequest, (state, { predictionRequest }) => {
    const {
      mpa,
      v90,
      hv,
      hv_lower,
      hv_upper,
      rrelation,
      burdeningType,
      model,
      spreading,
      rArea,
      es,
      rz,
      hv_core,
      a90,
      gradient,
      multiaxiality
    } = predictionRequest;

    return {
      ...state,
      predictionRequest: {
        ...state.predictionRequest,
        mpa,
        v90,
        hv,
        hv_lower,
        hv_upper,
        rrelation,
        burdeningType,
        model,
        spreading,
        rArea,
        es,
        rz,
        hv_core,
        a90,
        gradient,
        multiaxiality
      }
    };
  }),
  on(PredictionActions.unsetPredictionRequest, state => ({
    ...state,
    predictionRequest: initialState.predictionRequest
  })),
  on(PredictionActions.setPredictionType, (state, { prediction }) => ({
    ...state,
    predictionRequest: {
      ...state.predictionRequest,
      prediction
    }
  })),
  on(PredictionActions.setPredictionResult, (state, { predictionResult }) => ({
    ...state,
    predictionResult
  })),
  on(PredictionActions.postLoadsData, (state, { loadsRequest }) => ({
    ...state,
    loadsRequest
  })),
  on(PredictionActions.setLoadsResult, (state, { loads, status, error }) => ({
    ...state,
    loads,
    loadsRequest: {
      ...state.loadsRequest,
      status,
      error
    }
  })),
  on(PredictionActions.setHardness, (state, { selectedHardness }) => ({
    ...state,
    predictionRequest: {
      ...state.predictionRequest,
      hv: selectedHardness
    }
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(
  state: PredictionState,
  action: Action
): PredictionState {
  return predictionReducer(state, action);
}
