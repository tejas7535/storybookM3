import {
  mockedPredictionResult,
  mockedStatisticalResult,
} from '../../mock/mock.constants';
import * as PredictionActions from '../actions/prediction.actions';
import { predictionReducer } from './prediction.reducer';

describe('predictionReducer', () => {
  describe('reducer', () => {
    let state: any;
    beforeEach(() => {
      state = {
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
      };

      const mockedStatisticalRequest = {
        rz: 0,
        es: 0,
        hardness: 180,
        r: -1,
        rArea: 5,
        v90: 1,
        loadingType: 0,
      };

      const newState = predictionReducer(
        state,
        PredictionActions.setPredictionRequest({
          predictionRequest: mockedPredictionRequest,
          statisticalRequest: mockedStatisticalRequest,
        })
      );
      expect(newState.predictionRequest).toEqual({
        ...state.prediction,
        ...mockedPredictionRequest,
      });
      expect(newState.statisticalRequest).toEqual({
        ...state.prediction,
        ...mockedStatisticalRequest,
      });
    });

    it('should set state on setMLRequest with incomplete params', () => {
      const mockedHvLimitsPredictionRequest = {
        hv_lower: 200,
        hv_upper: 300,
      };
      const newState = predictionReducer(
        state,
        PredictionActions.setMLRequest({
          predictionRequest: mockedHvLimitsPredictionRequest,
        })
      );
      expect(newState.predictionRequest).toEqual({
        ...state.predictionRequest,
        ...mockedHvLimitsPredictionRequest,
      });
    });

    it('should set state on setStatisticalRequest', () => {
      const mockedStatisticalRequest = {
        rz: 1,
        es: 1,
        hardness: 200,
        r: 0,
        rArea: 15,
        v90: 10,
        loadingType: 1,
      };
      const newState = predictionReducer(
        state,
        PredictionActions.setStatisticalRequest({
          statisticalRequest: mockedStatisticalRequest,
        })
      );
      expect(newState.statisticalRequest).toEqual({
        ...state.statisticalRequest,
        ...mockedStatisticalRequest,
      });
    });

    it('should set state on unsetPredictionRequest', () => {
      const newState = predictionReducer(
        state,
        PredictionActions.unsetPredictionRequest()
      );
      expect(newState.predictionRequest).toEqual(state.predictionRequest);
    });

    it('should set state on unsetStatisticalRequest', () => {
      const newState = predictionReducer(
        state,
        PredictionActions.unsetStatisticalRequest()
      );
      expect(newState.statisticalRequest).toEqual(state.statisticalRequest);
    });

    it('should set state on setPredictionType', () => {
      const mockedPredictionType = { prediction: 1 };
      const newState = predictionReducer(
        state,
        PredictionActions.setPredictionType({
          prediction: mockedPredictionType.prediction,
        })
      );
      expect(newState.predictionRequest).toEqual({
        ...state.predictionRequest,
        ...mockedPredictionType,
      });
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

    it('should set state on setStatisticalResult', () => {
      const statisticalResult = mockedStatisticalResult;

      const newState = predictionReducer(
        state,
        PredictionActions.setStatisticalResult({ statisticalResult })
      );
      expect(newState.statisticalResult).toEqual(mockedStatisticalResult);
    });
  });
});
