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
          sa_fkm: 67.299_999_999_999_95,
          sa_murakami: 293.891_061_943_249_67,
        },
        statistical_sn_curve: {
          percentile_50: {
            0: { x: 10_000, y: 255.307_159_187_472_5 },
            1: { x: 329_718.177_015_445_14, y: 122.464_994_125_332_68 },
            2: { x: 10_000_000, y: 122.464_994_125_332_68 },
          },
          percentile_10: {
            0: { x: 10_000, y: 342.940_004_948_719_3 },
            1: { x: 329_718.177_015_445_14, y: 164.500_462_208_140_25 },
            2: { x: 10_000_000, y: 164.500_462_208_140_25 },
          },
          percentile_90: {
            0: { x: 10_000, y: 190.067_488_749_596_95 },
            1: { x: 329_718.177_015_445_14, y: 91.171_019_125_413_8 },
            2: { x: 10_000_000, y: 91.171_019_125_413_8 },
          },
        },
      },
      haigh: {
        analytical: {
          r0_fkm: 267.299_999_999_999_95,
          r1_fkm: 241.267_262_388_302_19,
          r0_murakami: 357.891_061_943_249_67,
          r1_murakami: 302.203_530_305_919_74,
        },
        statistical: { r0: 108.093_165_672_033_12, r1: 122.464_994_125_332_68 },
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
              x: 10_000,
              y: 169.049_956_840_594_63,
            },
            1: {
              x: 1_000_000,
              y: 67.299_999_999_999_95,
            },
            2: {
              x: 10_000_000,
              y: 67.299_999_999_999_95,
            },
          },
          murakami: {
            0: {
              x: 10_000,
              y: 738.220_970_837_190_4,
            },
            1: {
              x: 1_000_000,
              y: 293.891_061_943_249_67,
            },
            2: {
              x: 10_000_000,
              y: 293.891_061_943_249_67,
            },
          },
        },
        statistical_sn_curve: {
          percentile_50: {
            0: {
              x: 10_000,
              y: 255.307_159_187_472_5,
            },
            1: {
              x: 329_718.177_015_445_14,
              y: 122.464_994_125_332_68,
            },
            2: {
              x: 10_000_000,
              y: 122.464_994_125_332_68,
            },
          },
          percentile_10: {
            0: {
              x: 10_000,
              y: 342.940_004_948_719_3,
            },
            1: {
              x: 329_718.177_015_445_14,
              y: 164.500_462_208_140_25,
            },
            2: {
              x: 10_000_000,
              y: 164.500_462_208_140_25,
            },
          },
          percentile_90: {
            0: {
              x: 10_000,
              y: 190.067_488_749_596_95,
            },
            1: {
              x: 329_718.177_015_445_14,
              y: 91.171_019_125_413_8,
            },
            2: {
              x: 10_000_000,
              y: 91.171_019_125_413_8,
            },
          },
        },
      },
      haigh: {
        analytical: {
          fkm: {
            0: {
              x: 0,
              y: 267.299_999_999_999_95,
            },
            1: {
              x: 241.267_262_388_302_19,
              y: 241.267_262_388_302_19,
            },
          },
          murakami: {
            0: {
              x: 0,
              y: 357.891_061_943_249_67,
            },
            1: {
              x: 302.203_530_305_919_74,
              y: 302.203_530_305_919_74,
            },
          },
        },
        statistical: {
          0: {
            x: 0,
            y: 108.093_165_672_033_12,
          },
          1: {
            x: 122.464_994_125_332_68,
            y: 122.464_994_125_332_68,
          },
        },
      },
    });
  });
});
