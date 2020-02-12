import * as PredictionActions from '../actions/prediction.actions';

import { predictionReducer } from './prediction.reducer';

import { mockedPredictionResult } from '../../../mocks/mock.constants';

import { LoadsRequest } from '../../../shared/models';

describe('predictionReducer', () => {
  describe('reducer', () => {
    let state: any;
    beforeEach(() => {
      state = {
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
          data: undefined,
          status: 0,
          error: undefined
        },
        loads: undefined
      };
    });

    it('should return initial state on unknown action / state', () => {
      const action: any = {};
      const newState = predictionReducer(undefined, action);

      expect(newState).toEqual(state);
    });

    it('should set state on setPredictionRequest', () => {
      const mockedPredictionRequest = {
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
      };
      const newState = predictionReducer(
        state,
        PredictionActions.setPredictionRequest({
          predictionRequest: mockedPredictionRequest
        })
      );
      expect(newState.predictionRequest).toEqual({
        ...state.prediction,
        ...mockedPredictionRequest
      });
    });

    it('should set state on unsetPredictionRequest', () => {
      const newState = predictionReducer(
        state,
        PredictionActions.unsetPredictionRequest()
      );
      expect(newState.predictionRequest).toEqual(state.predictionRequest);
    });

    it('should set state on setPredictionType', () => {
      const mockedPredictionType = { prediction: 1 };
      const newState = predictionReducer(
        state,
        PredictionActions.setPredictionType({
          prediction: mockedPredictionType.prediction
        })
      );
      expect(newState.predictionRequest).toEqual({
        ...state.predictionRequest,
        ...mockedPredictionType
      });
    });

    it('should set state on setLoadsData', () => {
      const mockedLoadsRequest: LoadsRequest = {
        data: [1, 2],
        status: 1,
        error: undefined
      };

      const newState = predictionReducer(
        state,
        PredictionActions.postLoadsData({ loadsRequest: mockedLoadsRequest })
      );
      expect(newState.loadsRequest).toEqual(mockedLoadsRequest);
    });

    it('should set state on setLoadsResult', () => {
      const mockedLoads = {};

      const mockedStatus = 2;

      const newState = predictionReducer(
        state,
        PredictionActions.setLoadsResult({
          loads: mockedLoads,
          status: mockedStatus,
          error: undefined
        })
      );
      expect(newState.loadsRequest.status).toEqual(mockedStatus);
      expect(newState.loads).toEqual(mockedLoads);
    });

    it('should set state on setHardness', () => {
      const mockedHardness = 10;

      const newState = predictionReducer(
        state,
        PredictionActions.setHardness({ selectedHardness: mockedHardness })
      );
      expect(newState.predictionRequest.hv).toEqual(mockedHardness);
    });

    it('should set state on setPredictionResult', () => {
      const predictionResult = mockedPredictionResult;

      const newState = predictionReducer(
        state,
        PredictionActions.setPredictionResult({ predictionResult })
      );
      expect(newState.predictionResult).toEqual(mockedPredictionResult);
    });
  });
});
