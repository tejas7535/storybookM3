import { PredictionState } from '../reducers/prediction.reducer';
import * as PredictionSelectors from './prediction.selectors';

describe('PredictionSelectors', () => {
  it('should getLoads', () => {
    const mockedPredictionRequest: PredictionState = {
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
      // prediction: undefined,
      predictionResult: undefined,
      loadsRequest: {
        data: [0, 1, 2, 3],
        status: 1,
        error: undefined,
        conversionFactor: 0,
        repetitionFactor: 0,
        method: 'FKM'
      },
      loads: undefined
    };

    expect(
      PredictionSelectors.getLoads.projector(mockedPredictionRequest)
    ).toEqual({
      data: [0, 1, 2, 3],
      status: 1,
      error: undefined,
      conversionFactor: 0,
      repetitionFactor: 0,
      method: 'FKM'
    });
  });

  it('should getLoadsPoints', () => {
    const mockedLoads = {
      x: [1, 2, 3],
      y: [4, 5, 6]
    };

    expect(PredictionSelectors.getLoadsPoints.projector(mockedLoads)).toEqual([
      { x: 1, y: 4 },
      { x: 2, y: 5 },
      { x: 3, y: 6 }
    ]);
  });
});
