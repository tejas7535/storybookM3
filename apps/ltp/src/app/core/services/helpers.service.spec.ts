import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import {
  mockedPredictionRequestWithKpi,
  mockedPredictionResult,
  mockedStatisticalResult,
} from '../../mocks/mock.constants';
import { CHART_SETTINGS_HAIGH } from '../../shared/constants';
import { ChartType } from '../../shared/enums';
import {
  Display,
  Graph,
  KpiParsedHaigh,
  KpiParsedWoehler,
  Limits,
  PredictionRequest,
  PredictionResult,
  PredictionResultParsed,
} from '../../shared/models';
import { CHART_SETTINGS_WOEHLER } from './../../shared/constants/chart-settings-woehler';
import { HelpersService } from './helpers.service';

// Constants
const getDefaultConstants = {
  defaultPredictionRequest: ({
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
  } as unknown) as PredictionRequest,
  loads: [
    { x: 1, y: 2 },
    { x: 3, y: 4 },
  ],
  defaultPredictionResult: ({
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
      percentile1: ({} as unknown) as Graph,
      percentile10: ({} as unknown) as Graph,
      percentile90: ({} as unknown) as Graph,
      percentile99: ({} as unknown) as Graph,
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
  } as unknown) as PredictionResult,

  defaultPredictionResultParsedWoehler: ({
    data: [
      { x: 10000, y7: 671.4272431425106 },
      { x: 1000000, y7: 267.29999999999995 },
      { x: 10000000, y7: 267.29999999999995 },
      { x: 10000, y8: 898.9817024538035 },
      { x: 1000000, y8: 357.89106194324967 },
      { x: 10000000, y8: 357.89106194324967 },
      { x: 10000, y2: 301.21165055865265 },
      { x: 1158691.4165629777, y2: 129.60351058284022 },
      { x: 10000000, y2: 129.60351058284022 },
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ],
    kpi: undefined,
    limits: {
      x_max: 10000000,
      x_min: 10000,
      y_max: 988.8798726991838,
      y_min: 116.6431595245562,
    },
    lines: [
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 150,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 200,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 250,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 300,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 350,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 400,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 450,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 500,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 550,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 600,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 650,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 700,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 750,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 800,
      },
      {
        color: '#dddddd',
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center',
        },
        value: 900,
      },
    ],
  } as unknown) as PredictionResultParsed,

  defaultPredictionResultParsedHaigh: ({
    data: [
      { x: 0, y3: 267.29999999999995 },
      { x: 241.26726238830219, y3: 241.26726238830219 },
      { x: 0, y4: 357.89106194324967 },
      { x: 302.20353030591974, y4: 302.20353030591974 },
      { x: 0, y2: 129.60351058284022 },
      { x: 127.48671337634478, y2: 127.48671337634478 },
      { x: 0, y1: 0 },
      { x: 393.68016813757464, y1: 393.68016813757464 },
    ],
    kpi: undefined,
    limits: {
      x_max: 393.68016813757464,
      x_min: 0,
      y_max: 393.68016813757464,
      y_min: 0,
    },
    lines: [],
  } as unknown) as PredictionResultParsed,

  defaultStatisticalResult: mockedStatisticalResult,
};

describe('HelpersService', () => {
  let helpersService: HelpersService;
  const defaults = getDefaultConstants;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [HelpersService],
    });
    helpersService = TestBed.inject(HelpersService);
  });

  it('should have a calculateLines helper method', () => {
    expect(helpersService.calculateLines).toBeDefined();
  });

  it('should have a relevantLoadPoints helper method', () => {
    const mockLoad = [
      { x: 1, y: 1 },
      { x: 10, y: 10 },
    ];
    const mockLimit = { x_min: 0, x_max: 2, y_min: 0, y_max: 2 };

    expect(helpersService.relevantLoadPoints).toBeDefined();
    expect(helpersService.relevantLoadPoints(mockLoad, mockLimit).length).toBe(
      1
    );
  });

  it('should calculate lines from limits', () => {
    const limits: Limits = {
      x_max: 500,
      x_min: 0,
      y_max: 501,
      y_min: 0,
    };

    const lineBase = {
      color: '#dddddd',
      displayBehindSeries: true,
      label: {
        horizontalAlignment: 'left',
        position: 'outside',
        verticalAlignment: 'center',
      },
    };

    const expectedLines = [
      { ...lineBase, value: 50 },
      { ...lineBase, value: 100 },
      { ...lineBase, value: 150 },
      { ...lineBase, value: 200 },
      { ...lineBase, value: 250 },
      { ...lineBase, value: 300 },
      { ...lineBase, value: 350 },
      { ...lineBase, value: 400 },
      { ...lineBase, value: 450 },
      { ...lineBase, value: 500 },
    ];

    const lines = helpersService.calculateLines(limits);

    expect(lines).toEqual(expectedLines);
  });

  it('calculated lines should have a gap of 50 below a value of 800', () => {
    const limits: Limits = {
      x_max: 500,
      x_min: 0,
      y_max: 800,
      y_min: 0,
    };

    const lines = helpersService.calculateLines(limits);

    let before;
    for (const line of lines) {
      if (before) {
        expect(line.value - before.value).toEqual(50);
      }
      before = line;
    }
  });

  it('calculated lines should have a gap of 100 above a value of 800', () => {
    const limits: Limits = {
      x_max: 500,
      x_min: 0,
      y_max: 1500,
      y_min: 801,
    };

    const lines = helpersService.calculateLines(limits);

    let before;
    for (const line of lines) {
      if (before) {
        expect(line.value - before.value).toEqual(100);
      }
      before = line;
    }
  });

  it('should filter points according to the limits', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 0, y: 100 },
      { x: 0, y: 1000 },
      { x: 0, y: 10000 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 100, y: 1000 },
      { x: 100, y: 10000 },
      { x: 1000, y: 0 },
      { x: 1000, y: 100 },
      { x: 1000, y: 1000 },
      { x: 1000, y: 10000 },
      { x: 10000, y: 0 },
      { x: 10000, y: 100 },
      { x: 10000, y: 1000 },
      { x: 10000, y: 10000 },
    ];

    let limits: Limits = {
      x_max: 10000,
      x_min: 0,
      y_max: 10000,
      y_min: 0,
    };

    let filteredPoints = helpersService.relevantLoadPoints(points, limits);
    expect(filteredPoints).toEqual(points);

    limits = { ...limits, x_max: 1000 };

    let expectedPoints = [
      { x: 0, y: 0 },
      { x: 0, y: 100 },
      { x: 0, y: 1000 },
      { x: 0, y: 10000 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 100, y: 1000 },
      { x: 100, y: 10000 },
      { x: 1000, y: 0 },
      { x: 1000, y: 100 },
      { x: 1000, y: 1000 },
      { x: 1000, y: 10000 },
    ];

    filteredPoints = helpersService.relevantLoadPoints(points, limits);
    expect(filteredPoints).toEqual(expectedPoints);

    limits = { ...limits, y_max: 1000 };

    expectedPoints = [
      { x: 0, y: 0 },
      { x: 0, y: 100 },
      { x: 0, y: 1000 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 100, y: 1000 },
      { x: 1000, y: 0 },
      { x: 1000, y: 100 },
      { x: 1000, y: 1000 },
    ];

    filteredPoints = helpersService.relevantLoadPoints(points, limits);
    expect(filteredPoints).toEqual(expectedPoints);

    limits = { ...limits, x_min: 100 };

    expectedPoints = [
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 100, y: 1000 },
      { x: 1000, y: 0 },
      { x: 1000, y: 100 },
      { x: 1000, y: 1000 },
    ];

    filteredPoints = helpersService.relevantLoadPoints(points, limits);
    expect(filteredPoints).toEqual(expectedPoints);

    limits = { ...limits, y_min: 100 };

    expectedPoints = [
      { x: 100, y: 100 },
      { x: 100, y: 1000 },
      { x: 1000, y: 100 },
      { x: 1000, y: 1000 },
    ];

    filteredPoints = helpersService.relevantLoadPoints(points, limits);
    expect(filteredPoints).toEqual(expectedPoints);
  });

  it('should return undefined if predictionResult is empty', () => {
    const kpiResult = helpersService.prepareKpis(
      undefined,
      undefined,
      undefined
    );
    expect(kpiResult).toEqual(undefined);
  });

  it('should return kpis for woehler if selected', () => {
    let predictionResult: PredictionResult = {
      woehler: {
        snCurve: undefined,
        snCurveLow: undefined,
        snCurveHigh: undefined,
        appliedStress: {
          0: {
            x: 2022,
            y: 400,
          },
          1: {
            x: 2022,
            y: 103.68280846627218,
          },
          2: {
            x: 10000,
            y: 400,
          },
        },
        percentile1: undefined,
        percentile10: undefined,
        percentile90: undefined,
        percentile99: undefined,
      },
      haigh: {
        snCurve: undefined,
        appliedStress: undefined,
      },
      kpi: {
        fatigue: {
          0: 127.48671337634478,
          1: 129.60351058284022,
        },
        slope: 5.635329994802062,
      },
    };

    let request = ({
      rrelation: 0,
      mpa: 400,
    } as unknown) as PredictionRequest;

    const display = ({
      chartType: ChartType.Woehler,
    } as unknown) as Display;

    let expectedKpis: KpiParsedWoehler = {
      fatigue: 127.48671337634478,
      slope: 5.635329994802062,
      count: 2022,
      mpa: 400,
    };

    let kpis = helpersService.prepareKpis(predictionResult, display, request);
    expect(kpis).toEqual(expectedKpis);

    request = { ...request, rrelation: -1 };
    predictionResult = {
      ...predictionResult,
      woehler: {
        ...predictionResult.woehler,
        appliedStress: {
          0: {
            x: 2022,
            y: 400,
          },
          1: {
            x: 100000000,
            y: 103.68280846627218,
          },
          2: {
            x: 10000,
            y: 400,
          },
        },
      },
    };

    expectedKpis = {
      ...expectedKpis,
      fatigue: 129.60351058284022,
      count: -1,
    };

    kpis = helpersService.prepareKpis(predictionResult, display, request);
    expect(kpis).toEqual(expectedKpis);
  });

  it('should return kpis for haigh if selected', () => {
    const predictionResult: PredictionResult = {
      woehler: {
        snCurve: undefined,
        snCurveLow: undefined,
        snCurveHigh: undefined,
        appliedStress: undefined,
        percentile1: undefined,
        percentile10: undefined,
        percentile90: undefined,
        percentile99: undefined,
      },
      haigh: {
        snCurve: undefined,
        appliedStress: undefined,
      },
      kpi: {
        fatigue: {
          0: 127.48671337634478,
          1: 129.60351058284022,
        },
        slope: 5.635329994802062,
      },
    };

    const display = ({
      chartType: ChartType.Haigh,
    } as unknown) as Display;

    const expectedKpis: KpiParsedHaigh = {
      fatigue: 127.48671337634478,
      fatigue1: 129.60351058284022,
      meanStress: 0.016604061320857566,
    };

    const kpis = helpersService.prepareKpis(
      predictionResult,
      display,
      undefined
    );
    expect(kpis).toEqual(expectedKpis);
  });

  it('should return undefined if predictionResult is empty', () => {
    const predictionResult = helpersService.preparePredictionResult(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(predictionResult).toEqual(undefined);
  });

  it('should prepare prediction result for woehler', () => {
    const display: Display = {
      chartType: ChartType.Woehler,
      showFKM: true,
      showMurakami: true,
      bannerOpen: false,
      showStatistical: false,
    };

    const expectedResult = defaults.defaultPredictionResultParsedWoehler;
    const result = helpersService.preparePredictionResult(
      defaults.defaultPredictionResult,
      defaults.defaultStatisticalResult,
      display,
      defaults.loads,
      mockedPredictionRequestWithKpi.predictionRequest
    );
    expect(result).toEqual(expectedResult);
  });

  it('should prepare prediction result for haigh', () => {
    const display: Display = {
      chartType: ChartType.Haigh,
      showFKM: true,
      showMurakami: true,
      bannerOpen: false,
      showStatistical: false,
    };

    const expectedResult = defaults.defaultPredictionResultParsedHaigh;
    const result = helpersService.preparePredictionResult(
      defaults.defaultPredictionResult,
      defaults.defaultStatisticalResult,
      display,
      defaults.loads,
      mockedPredictionRequestWithKpi.predictionRequest
    );
    expect(result).toEqual(expectedResult);
  });

  it('should calculate correct start point for graph in sn shape', () => {
    const graph = {
      0: {
        x: 100,
        y: 100,
      },
      1: {
        x: 1000000,
        y: 50,
      },
      2: {
        x: 10000000,
        y: 50,
      },
    };

    const calculatedGraph = helpersService.calculateStartPoint(graph, 5, -1);
    expect(calculatedGraph).not.toEqual(graph);
    expect(calculatedGraph[0].x).toEqual(10000);
  });

  it('should return empty graph for a graph without sn shape that only has points until x = 10000', () => {
    const graph = {
      0: {
        x: 100,
        y: 100,
      },
      1: {
        x: 10000,
        y: 100,
      },
      2: {
        x: 10000,
        y: 0,
      },
    };

    const calculatedGraph = helpersService.calculateStartPoint(graph, 5, -1);
    expect(calculatedGraph).toEqual(({} as unknown) as Graph);
  });

  it('should calculate correct graph for applied stress shape', () => {
    const graph = {
      0: {
        x: 10000,
        y: 100,
      },
      1: {
        x: 100000,
        y: 50,
      },
      2: {
        x: 100000,
        y: 20,
      },
    };

    const calculatedGraph = helpersService.calculateStartPoint(graph, 5, -1);
    expect(calculatedGraph).not.toEqual(graph);
    expect(calculatedGraph[2].y).toEqual(0);
  });

  it('should return true for a graph in sn shape', () => {
    const graph = {
      0: {
        x: 0,
        y: 100,
      },
      1: {
        x: 100,
        y: 50,
      },
      2: {
        x: 1000,
        y: 50,
      },
    };

    const result = helpersService.isSNShape(graph);
    expect(result).toEqual(true);
  });

  it('should return false for a graph which is not in sn shape', () => {
    const graph = {
      0: {
        x: 0,
        y: 100,
      },
      1: {
        x: 1000,
        y: 100,
      },
    };

    const result = helpersService.isSNShape(graph);
    expect(result).toEqual(false);
  });

  it('should return an object array with each an x and a given attribute', () => {
    const graph = {
      0: {
        x: 100,
        y: 100,
      },
      1: {
        x: 1000000,
        y: 50,
      },
      2: {
        x: 10000000,
        y: 50,
      },
    };

    const expectedArray = [
      { x: 100, definitelyNotY: 100 },
      { x: 1000000, definitelyNotY: 50 },
      { x: 10000000, definitelyNotY: 50 },
    ];
    const transformedGraph = helpersService.transformGraph(
      graph,
      'definitelyNotY'
    );
    expect(transformedGraph).toEqual(expectedArray);
  });

  it('should return a point array of the given graph', () => {
    const graph = {
      0: {
        x: 100,
        y: 100,
      },
      1: {
        x: 1000000,
        y: 50,
      },
      2: {
        x: 10000000,
        y: 50,
      },
    };

    const expectedArray = [
      { x: 100, y: 100 },
      { x: 1000000, y: 50 },
      { x: 10000000, y: 50 },
    ];
    const transformedGraph = helpersService.graphToArray(graph);
    expect(transformedGraph).toEqual(expectedArray);
  });

  it('should return a valid sn graph', () => {
    const start = 1000;
    const sa = 100;

    const expectedGraph = {
      0: { x: 10000, y: 1000 },
      1: { x: 1000000, y: 100 },
      2: { x: 10000000, y: 100 },
    };
    const sn = helpersService.createGraphObjectWoehler(start, sa, -1);
    expect(sn).toEqual(expectedGraph);
  });

  it('should return a graph object', () => {
    const rrelation0 = 300;
    const rrelation1 = 350;
    const haighGraph = helpersService.createGraphObjectHaigh(
      rrelation0,
      rrelation1
    );
    expect(haighGraph[0].x).toEqual(0);
    expect(haighGraph[0].y).toEqual(rrelation0);
    expect(haighGraph[1].x).toEqual(rrelation1);
    expect(haighGraph[1].y).toEqual(rrelation1);
  });

  it('should extend a haigh graph if the limits have higher values', () => {
    const limits: Limits = {
      x_max: 700,
      x_min: 0,
      y_max: 700,
      y_min: 0,
    };

    const graph = {
      0: {
        x: 0,
        y: 0,
      },
      1: {
        x: 600,
        y: 600,
      },
    };

    const expectedGraph = {
      0: {
        x: 0,
        y: 0,
      },
      1: {
        x: 770,
        y: 770,
      },
    };

    const extendedGraph = helpersService.extendGraphHaigh(graph, limits);
    expect(extendedGraph).toEqual(expectedGraph);
  });

  it('should return the same graph if the limits do not have higher values', () => {
    const limits: Limits = {
      x_max: 500,
      x_min: 0,
      y_max: 500,
      y_min: 0,
    };

    const graph = {
      0: {
        x: 0,
        y: 0,
      },
      1: {
        x: 600,
        y: 600,
      },
    };

    const extendedGraph = helpersService.extendGraphHaigh(graph, limits);
    expect(extendedGraph).toEqual(graph);
  });

  it('should calculate the woehler limits', () => {
    const points = [
      { x: 0, y: 100 },
      { x: 0, y: 1000 },
      { x: 0, y: 10000 },
    ];

    const expectedLimits: Limits = {
      x_max: 10000000,
      x_min: 10000,
      y_max: 11000,
      y_min: 90,
    };
    const limits = helpersService.calculateLimitsWoehler(points);
    expect(limits).toEqual(expectedLimits);
  });

  it('should calculate the haigh limits', () => {
    const points = [
      { x: 0, y: 100 },
      { x: 0, y: 1000 },
      { x: 0, y: 10000 },
      { y: 0, x: 100 },
      { y: 0, x: 1000 },
      { y: 0, x: 10000 },
    ];

    const expectedLimits: Limits = {
      x_max: 10000,
      x_min: 0,
      y_max: 10000,
      y_min: 0,
    };
    const limits = helpersService.calculateLimitsHaigh(points);
    expect(limits).toEqual(expectedLimits);
  });

  it('should reduce a value by ten percent', () => {
    const val = 100;
    const reduced = helpersService.reduce10Percent(val);
    expect(reduced).toEqual(90);
  });

  it('should increase a value by ten percent', () => {
    const val = 100;
    const reduced = helpersService.increase10Percent(val);
    expect(reduced).toEqual(110);
  });

  it('should return empty result for corrupted chart settings in haigh', () => {
    const mockedChartSettingsHaigh = CHART_SETTINGS_HAIGH;
    mockedChartSettingsHaigh.sources[0].value = undefined;
    mockedChartSettingsHaigh.sources[0].identifier = undefined;
    mockedChartSettingsHaigh.sources[1].value = undefined;
    mockedChartSettingsHaigh.sources[2].value = undefined;
    mockedChartSettingsHaigh.sources[3].value = undefined;
    mockedChartSettingsHaigh.sources[4].value = undefined;
    CHART_SETTINGS_HAIGH.sources = mockedChartSettingsHaigh.sources;

    const result = helpersService.preparePredictionResult(
      mockedPredictionResult,
      mockedStatisticalResult,
      {
        showFKM: true,
        showMurakami: true,
        showStatistical: true,
        chartType: 1,
      },
      [],
      mockedPredictionRequestWithKpi.predictionRequest
    );

    expect(result).toEqual({
      data: [],
      kpi: undefined,
      limits: {
        x_max: -Infinity,
        x_min: 0,
        y_max: -Infinity,
        y_min: 0,
      },
      lines: [],
    });
  });

  it('tranformGraph should return empty array if argumentKey is not defined', () => {
    const mockedGraph: Graph = {
      0: { x: 0, y: 1 },
      1: { x: 0, y: 1 },
    };

    const result = helpersService.transformGraph(mockedGraph, undefined);

    expect(result).toEqual([]);
  });

  it('tranformGraph should return undefined if argumentKey is not defined', () => {
    const mockedGraph: Graph = {
      0: undefined,
      1: { x: 0, y: 1 },
    };

    const result = helpersService.transformGraph(mockedGraph, 'myKey');

    expect(result).toEqual([
      { myKey: undefined, x: undefined },
      { myKey: 1, x: 0 },
    ]);
  });

  it('should return empty result for corrupted chart settings in woehler', () => {
    const mockedChartSettingsWoehler = CHART_SETTINGS_WOEHLER;
    mockedChartSettingsWoehler.sources[2].value = undefined;
    mockedChartSettingsWoehler.sources[3].value = undefined;
    mockedChartSettingsWoehler.sources[4].value = undefined;
    CHART_SETTINGS_WOEHLER.sources = mockedChartSettingsWoehler.sources;

    const result = helpersService.preparePredictionResult(
      mockedPredictionResult,
      mockedStatisticalResult,
      { showFKM: true, showMurakami: true, showStatistical: true },
      [],
      mockedPredictionRequestWithKpi.predictionRequest
    );

    expect(result).toEqual({
      data: [],
      kpi: undefined,
      limits: undefined,
      lines: [],
    });
  });

  it('should calculate hardness diversivication range coordinates', () => {
    const mockPredictionResultWoehler = {
      ...getDefaultConstants.defaultPredictionResult,
      snCurveLow: {
        '0': {
          x: 123,
          y: 456,
        },
        '1': {
          x: 789,
          y: 135,
        },
        '2': {
          x: 791,
          y: 147,
        },
      },
      snCurveHigh: {
        '0': {
          x: 258,
          y: 369,
        },
        '1': {
          x: 963,
          y: 852,
        },
        '2': {
          x: 741,
          y: 159,
        },
      },
    };
    const hardnessCoordinates = helpersService.constructHardnessGraph(
      mockPredictionResultWoehler
    );
    expect(hardnessCoordinates).toEqual([
      {
        x: 791,
        yLow: 147,
        yHigh: 159,
      },
      {
        x: 789,
        yLow: 135,
        yHigh: 852,
      },
    ]);
  });
  // tslint:disable-next-line: max-file-line-count
});
