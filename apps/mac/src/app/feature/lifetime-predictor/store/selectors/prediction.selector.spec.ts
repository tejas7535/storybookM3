import {
  mockedPredictionRequestWithKpi,
  mockedPredictionRequestWithLimits,
} from '../../mock/mock.constants';
import { PredictionState } from '../reducers/prediction.reducer';
import * as PredictionSelectors from './prediction.selectors';

describe('PredictionSelectors', () => {
  let mockedPredictionRequest: PredictionState;
  const mockedPredictionRequestConst: PredictionState = {
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
    statisticalResult: {
      woehler: {
        analytical: {
          sa_fkm: 67.29999999999995,
          sa_murakami: 293.89106194324967,
        },
        statistical_sn_curve: {
          percentile_50: {
            0: { x: 10000, y: 255.3071591874725 },
            1: { x: 329718.17701544514, y: 122.46499412533268 },
            2: { x: 10000000, y: 122.46499412533268 },
          },
          percentile_10: {
            0: { x: 10000, y: 342.9400049487193 },
            1: { x: 329718.17701544514, y: 164.50046220814025 },
            2: { x: 10000000, y: 164.50046220814025 },
          },
          percentile_90: {
            0: { x: 10000, y: 190.06748874959695 },
            1: { x: 329718.17701544514, y: 91.1710191254138 },
            2: { x: 10000000, y: 91.1710191254138 },
          },
        },
      },
      haigh: {
        analytical: {
          r0_fkm: 267.29999999999995,
          r1_fkm: 241.26726238830219,
          r0_murakami: 357.89106194324967,
          r1_murakami: 302.20353030591974,
        },
        statistical: { r0: 108.09316567203312, r1: 122.46499412533268 },
      },
    },
    predictionResult: undefined,
    loadsRequest: {
      data: [0, 1, 2, 3],
      status: 1,
      error: undefined,
      conversionFactor: 1,
      repetitionFactor: 1,
      method: 'FKM',
    },
    loads: undefined,
  };

  beforeAll(() => {
    mockedPredictionRequest = mockedPredictionRequestConst;
  });

  it('should getLoadsRequest', () => {
    const { data, conversionFactor, repetitionFactor, method } =
      mockedPredictionRequestWithKpi.loadsRequest;
    const { kpi } = mockedPredictionRequestWithKpi.predictionResult;
    const expected = {
      conversionFactor,
      repetitionFactor,
      method,
      loads: data,
      fatigue_strength1: kpi.fatigue[1],
      fatigue_strength0: kpi.fatigue[0],
    };

    expect(
      PredictionSelectors.getLoadsRequest.projector(
        mockedPredictionRequestWithKpi.loadsRequest,
        mockedPredictionRequestWithKpi
      )
    ).toEqual(expected);
  });

  it('should getPredictionRequest', () => {
    expect(
      PredictionSelectors.getPredictionRequest.projector(
        mockedPredictionRequest
      )
    ).toEqual({
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
      multiaxiality: 0,
    });
  });

  it('should getStatisticalRequest', () => {
    expect(
      PredictionSelectors.getStatisticalRequest.projector(
        mockedPredictionRequest
      )
    ).toEqual({
      rz: 0,
      es: 0,
      hardness: 180,
      r: -1,
      rArea: 5,
      v90: 1,
      loadingType: 0,
    });
  });

  it('should getLoads', () => {
    expect(
      PredictionSelectors.getLoads.projector(mockedPredictionRequest)
    ).toEqual({
      data: [0, 1, 2, 3],
      status: 1,
      error: undefined,
      conversionFactor: 1,
      repetitionFactor: 1,
      method: 'FKM',
    });
  });

  it('should getLoadsRequest and return undefined if loads are not defined', () => {
    const data: number[] = undefined;
    const mockedRequest = {
      ...mockedPredictionRequest,
      loadsRequest: {
        ...mockedPredictionRequest.loadsRequest,
        data,
      },
    };

    expect(
      PredictionSelectors.getLoadsRequest.projector(
        mockedRequest.loadsRequest,
        mockedRequest.predictionRequest
      )
    ).toEqual(undefined);
  });

  it('should getLoadsPoints', () => {
    const mockedLoads = {
      x: [1, 2, 3],
      y: [4, 5, 6],
    };

    expect(PredictionSelectors.getLoadsPoints.projector(mockedLoads)).toEqual([
      { x: 1, y: 4 },
      { x: 2, y: 5 },
      { x: 3, y: 6 },
    ]);
  });

  it('should getLoadsResults', () => {
    expect(
      PredictionSelectors.getLoadsResults.projector(mockedPredictionRequest)
    ).toEqual(undefined);
  });

  it('should getLoadsStatus', () => {
    expect(
      PredictionSelectors.getLoadsStatus.projector(mockedPredictionRequest)
    ).toEqual({
      error: undefined,
      status: 1,
    });
  });

  it('should getKpis', () => {
    expect(
      PredictionSelectors.getKpis.projector(mockedPredictionRequest)
    ).toEqual(undefined);
  });

  it('should getPredictionResult', () => {
    expect(
      PredictionSelectors.getPredictionResult.projector(
        mockedPredictionRequestWithLimits
      )
    ).toEqual({ kpi: undefined });
  });

  // TODO: enable this test again
  // it('should getPredictionResultGraphData', () => {
  //   expect(
  //     PredictionSelectors.getPredictionResultGraphData.projector(
  //       PredictionSelectors.getPredictionResult({
  //         ltp: {
  //           prediction: mockedPredictionRequestWithLimits,
  //           input: initialInputState,
  //         },
  //       })
  //     )
  //   ).toEqual(mockedPredictionResultGraphData);
  // });

  it('should getStatisticalResult', () => {
    expect(
      PredictionSelectors.getStatisticalResult.projector(
        mockedPredictionRequest
      )
    ).toEqual({
      woehler: {
        analytical: {
          fkm: {
            0: {
              x: 10000,
              y: 169.04995684059463,
            },
            1: {
              x: 1000000,
              y: 67.29999999999995,
            },
            2: {
              x: 10000000,
              y: 67.29999999999995,
            },
          },
          murakami: {
            0: {
              x: 10000,
              y: 738.2209708371904,
            },
            1: {
              x: 1000000,
              y: 293.89106194324967,
            },
            2: {
              x: 10000000,
              y: 293.89106194324967,
            },
          },
        },
        statistical_sn_curve: {
          percentile_50: {
            0: {
              x: 10000,
              y: 255.3071591874725,
            },
            1: {
              x: 329718.17701544514,
              y: 122.46499412533268,
            },
            2: {
              x: 10000000,
              y: 122.46499412533268,
            },
          },
          percentile_10: {
            0: {
              x: 10000,
              y: 342.9400049487193,
            },
            1: {
              x: 329718.17701544514,
              y: 164.50046220814025,
            },
            2: {
              x: 10000000,
              y: 164.50046220814025,
            },
          },
          percentile_90: {
            0: {
              x: 10000,
              y: 190.06748874959695,
            },
            1: {
              x: 329718.17701544514,
              y: 91.1710191254138,
            },
            2: {
              x: 10000000,
              y: 91.1710191254138,
            },
          },
        },
      },
      haigh: {
        analytical: {
          fkm: {
            0: {
              x: 0,
              y: 267.29999999999995,
            },
            1: {
              x: 241.26726238830219,
              y: 241.26726238830219,
            },
          },
          murakami: {
            0: {
              x: 0,
              y: 357.89106194324967,
            },
            1: {
              x: 302.20353030591974,
              y: 302.20353030591974,
            },
          },
        },
        statistical: {
          0: {
            x: 0,
            y: 108.09316567203312,
          },
          1: {
            x: 122.46499412533268,
            y: 122.46499412533268,
          },
        },
      },
    });
  });
});
