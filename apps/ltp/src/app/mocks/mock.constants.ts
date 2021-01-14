import { EChartsOption } from 'echarts';

import { LTPState } from '../core/store';
import { initialState } from '../core/store/reducers/input.reducer';
import { PredictionState } from '../core/store/reducers/prediction.reducer';
import {
  BurdeningType,
  Material,
  Prediction,
  PredictionResult,
} from '../shared/models';

export const mockedMaterials: Material[] = [
  { name: 'Plastik', heatTreatment: 'volleHitze', hardness: 90001 },
  { name: 'Holz', heatTreatment: 'halbeHitze', hardness: 1 },
];

export const mockedPredictions: Prediction[] = [
  { id: 0, name: 'Arnold Strong' },
  { id: 1, name: 'Silvester Stallone' },
];

export const mockedBurdeningTypes: BurdeningType[] = [
  { id: 0, name: 'Jet Lee' },
  { id: 1, name: 'Tyson Fury' },
];

export const mockedLoadsResult = {
  loads: {
    x: [96.0, 214.0],
    y: [1050.0, 1000.0],
  },
  woehler: {
    case: 1,
    fatigue_strength: 129.60351058284022,
    line_percentile_1: [
      [
        [1158691.4165629777, 129.60351058284027],
        [10000, 301.21165055865276],
      ],
      [
        [1158691.4165629777, 129.60351058284027],
        [10000000, 129.60351058284027],
      ],
    ],
    line_percentile_10: [
      [
        [1158691.4165629777, 129.60351058284027],
        [10000, 301.21165055865276],
      ],
      [
        [1158691.4165629777, 129.60351058284027],
        [10000000, 129.60351058284027],
      ],
    ],
    line_percentile_50: [
      [
        [1158691.4165629777, 129.60351058284027],
        [460.9834219198255, 519.9999999999998],
      ],
      [
        [1158691.4165629777, 129.60351058284027],
        [10000000, 129.60351058284027],
      ],
    ],
    line_percentile_90: [
      [
        [1158691.4165629777, 129.60351058284027],
        [10000, 301.21165055865276],
      ],
      [
        [1158691.4165629777, 129.60351058284027],
        [10000000, 129.60351058284027],
      ],
    ],
    line_percentile_99: [
      [
        [1158691.4165629777, 129.60351058284027],
        [10000, 301.21165055865276],
      ],
      [
        [1158691.4165629777, 129.60351058284027],
        [10000000, 129.60351058284027],
      ],
    ],
    percentile_1: 2022,
    percentile_10: 2022,
    percentile_50: 2022,
    percentile_90: 2022,
    percentile_99: 2022,
    plot1: [
      [10000, 400],
      [2022, 400],
      [2022, 103.68280846627218],
      [2022, 400],
    ],
    plot2: [
      [10000, 301.21165055865265],
      [460.9834219198255, 520],
      [1158691.4165629777, 129.60351058284022],
      [10000000, 129.60351058284022],
    ],
    slope: 5.635329994802062,
    stress_amplitude: 400,
    x0: 460.9834219198255,
    xlim0: 10000,
    xlim1: 10000000,
    y0: 520,
  },
};

export const mockedPredictionResult: PredictionResult = {
  woehler: {
    snCurve: {
      '0': {
        x: 460.9834219198255,
        y: 520,
      },
      '1': {
        x: 1158691.4165629777,
        y: 129.60351058284022,
      },
      '2': {
        x: 10000000,
        y: 129.60351058284022,
      },
    },
    snCurveLow: {
      '0': {
        x: 460.9834219198255,
        y: 520,
      },
      '1': {
        x: 1158691.4165629777,
        y: 129.60351058284022,
      },
      '2': {
        x: 10000000,
        y: 129.60351058284022,
      },
    },
    snCurveHigh: {
      '0': {
        x: 460.9834219198255,
        y: 520,
      },
      '1': {
        x: 1158691.4165629777,
        y: 129.60351058284022,
      },
      '2': {
        x: 10000000,
        y: 129.60351058284022,
      },
    },
    appliedStress: {
      '0': {
        x: 2022,
        y: 400,
      },
      '1': {
        x: 2022,
        y: 103.68280846627218,
      },
      '2': {
        x: 10000,
        y: 400,
      },
    },
    percentile1: {
      '0': {
        x: 460.9834219198255,
        y: 519.9999999999998,
      },
      '1': {
        x: 1158691.4165629777,
        y: 129.60351058284027,
      },
      '2': {
        x: 10000000,
        y: 129.60351058284027,
      },
    },
    percentile10: {
      '0': {
        x: 460.9834219198255,
        y: 519.9999999999998,
      },
      '1': {
        x: 1158691.4165629777,
        y: 129.60351058284027,
      },
      '2': {
        x: 10000000,
        y: 129.60351058284027,
      },
    },
    percentile90: {
      '0': {
        x: 460.9834219198255,
        y: 519.9999999999998,
      },
      '1': {
        x: 1158691.4165629777,
        y: 129.60351058284027,
      },
      '2': {
        x: 10000000,
        y: 129.60351058284027,
      },
    },
    percentile99: {
      '0': {
        x: 460.9834219198255,
        y: 519.9999999999998,
      },
      '1': {
        x: 1158691.4165629777,
        y: 129.60351058284027,
      },
      '2': {
        x: 10000000,
        y: 129.60351058284027,
      },
    },
  },
  haigh: {
    snCurve: {
      '0': {
        x: 0,
        y: 129.60351058284022,
      },
      '1': {
        x: 127.48671337634478,
        y: 127.48671337634478,
      },
    },
    appliedStress: {
      '0': {
        x: 0,
        y: 0,
      },
      '1': {
        x: 229.60351058284022,
        y: 229.60351058284022,
      },
    },
  },
  kpi: {
    fatigue: {
      '0': 127.48671337634478,
      '1': 129.60351058284022,
    },
    slope: 5.635329994802062,
  },
};

export const mockedStatisticalResult = {
  woehler: {
    analytical: {
      sa_fkm: 267.29999999999995,
      sa_murakami: 357.89106194324967,
    },
    statistical_sn_curve: {
      percentile_50: {
        '0': { x: 10000, y: 255.3071591874725 },
        '1': { x: 329718.17701544514, y: 122.46499412533268 },
        '2': { x: 10000000, y: 122.46499412533268 },
      },
      percentile_10: {
        '0': { x: 10000, y: 342.9400049487193 },
        '1': { x: 329718.17701544514, y: 164.50046220814025 },
        '2': { x: 10000000, y: 164.50046220814025 },
      },
      percentile_90: {
        '0': { x: 10000, y: 190.06748874959695 },
        '1': { x: 329718.17701544514, y: 91.1710191254138 },
        '2': { x: 10000000, y: 91.1710191254138 },
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
};

export const mockedPredictionRequestWithKpi: PredictionState = {
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
  predictionResult: {
    haigh: undefined,
    woehler: undefined,
    kpi: {
      fatigue: {
        0: 10,
        1: 20,
      },
      slope: 120,
    },
  },
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

export const mockedPredictionRequestWithLimits: LTPState = {
  input: {
    ...initialState,
    display: {
      ...initialState.display,
      showFKM: true,
      showMurakami: true,
      showStatistical: true,
    },
  },
  prediction: {
    ...mockedPredictionRequestWithKpi,
    predictionResult: {
      ...mockedPredictionResult,
    },
  },
};

export const mockedPredictionResultGraphData: EChartsOption = {
  dataset: {
    source: [
      {
        x: 10000,
        y7: 169.04995684059463,
      },
      {
        x: 1000000,
        y7: 67.29999999999995,
      },
      {
        x: 10000000,
        y7: 67.29999999999995,
      },
      {
        x: 10000,
        y8: 738.2209708371904,
      },
      {
        x: 1000000,
        y8: 293.89106194324967,
      },
      {
        x: 10000000,
        y8: 293.89106194324967,
      },
      {
        x: 10000,
        y9: 255.3071591874725,
      },
      {
        x: 329718.17701544514,
        y9: 122.46499412533268,
      },
      {
        x: 10000000,
        y9: 122.46499412533268,
      },
      {
        x: 10000000,
        yHigh: 129.60351058284022,
        yLow: 129.60351058284022,
      },
      {
        x: 1158691.4165629777,
        yHigh: 129.60351058284022,
        yLow: 129.60351058284022,
      },
      {
        x: 10000,
        y2: 301.21165055865265,
      },
      {
        x: 1158691.4165629777,
        y2: 129.60351058284022,
      },
      {
        x: 10000000,
        y2: 129.60351058284022,
      },
      {
        x: 10000,
        y3: 301.21165055865254,
      },
      {
        x: 1158691.4165629777,
        y3: 129.60351058284027,
      },
      {
        x: 10000000,
        y3: 129.60351058284027,
      },
      {
        x: 10000,
        y5: 301.21165055865254,
      },
      {
        x: 1158691.4165629777,
        y5: 129.60351058284027,
      },
      {
        x: 10000000,
        y5: 129.60351058284027,
      },
      {
        x: 10000,
        y6: 301.21165055865254,
      },
      {
        x: 1158691.4165629777,
        y6: 129.60351058284027,
      },
      {
        x: 10000000,
        y6: 129.60351058284027,
      },
      {
        x: 10000,
        y4: 301.21165055865254,
      },
      {
        x: 1158691.4165629777,
        y4: 129.60351058284027,
      },
      {
        x: 10000000,
        y4: 129.60351058284027,
      },
    ],
  },
  xAxis: {
    max: 10000000,
    min: 10000,
  },
  yAxis: {
    max: 812.0430679209095,
    min: 60.56999999999996,
  },
  // tslint:disable-next-line: max-file-line-count
};
