import {
  CHART_SETTINGS_HAIGH,
  CHART_SETTINGS_WOEHLER
} from '../../shared/constants';
import { ChartType } from '../../shared/enums';
import {
  Display,
  Graph,
  KpiParsedHaigh,
  KpiParsedWoehler,
  Limits,
  Line,
  Point,
  PredictionRequest,
  PredictionResult,
  PredictionResultParsed
} from '../../shared/models';

export class HelpersService {
  /**
   * Calculates Lines
   */
  public calculateLines(limits: Limits): Line[] {
    let start: number = limits['y_min'] + 50 - (limits['y_min'] % 50);
    start = Math.round(start);
    const newLines: Line[] = [];
    while (start <= limits['y_max']) {
      newLines.push({
        color: '#dddddd',
        value: start,
        displayBehindSeries: true,
        label: {
          horizontalAlignment: 'left',
          position: 'outside',
          verticalAlignment: 'center'
        }
      });
      start = start < 800 ? start + 50 : start + 100;
    }

    return newLines;
  }

  /**
   * Returns only Points that are within the graph dimensions
   */
  public relevantLoadPoints(loadPoints, limits: Limits): Point[] {
    return loadPoints.filter(entry => {
      const { x, y } = entry;
      const { x_max, x_min, y_max, y_min } = limits;

      return x <= x_max && x >= x_min && y <= y_max && y >= y_min;
    });
  }

  /**
   * Prepares the Kpis for the currently selected chart type
   */
  public prepareKpis(
    predictionResult: PredictionResult,
    display: Display,
    request: PredictionRequest
  ): KpiParsedHaigh | KpiParsedWoehler {
    if (!predictionResult) {
      return undefined;
    }

    if (display.chartType === ChartType.Woehler) {
      return {
        fatigue:
          request.rrelation === 0
            ? predictionResult.kpi.fatigue[0]
            : predictionResult.kpi.fatigue[1],
        slope: predictionResult.kpi.slope,
        count:
          predictionResult.woehler.appliedStress[1].x < 10000000
            ? predictionResult.woehler.appliedStress[1].x
            : -1,
        mpa: request.mpa
      };
    }

    return {
      fatigue: predictionResult.kpi.fatigue[0],
      fatigue1: predictionResult.kpi.fatigue[1],
      meanStress:
        predictionResult.kpi.fatigue[1] / predictionResult.kpi.fatigue[0] - 1
    };
  }

  /**
   * Calculates all required values to display the selected chart correctly from the given state
   */
  public preparePredictionResult(
    predictionResult: PredictionResult,
    display: Display,
    request: PredictionRequest
  ): PredictionResultParsed {
    if (!predictionResult) {
      return undefined;
    }

    let data = [];
    let limits: Limits;
    let lines = [];
    // calculate FKM and Murakami
    // rz Shieberegler Rauheit 0 - 25 step 0.1
    const krs =
      request.rz !== 0
        ? 1 -
          Math.log10(request.rz) *
            Math.log10((2 * 3.3 * request.hv) / 400) *
            0.22
        : 1;

    if (display.chartType === ChartType.Woehler) {
      if (display.showFKM) {
        const fkm = this.calculateFKMWoehler(krs, request);
        data = [
          ...data,
          ...this.transformGraph(
            fkm,
            CHART_SETTINGS_WOEHLER.sources.find(src => src.identifier === 'fkm')
              .value
          )
        ];
      }
      if (display.showMurakami) {
        const murakami = this.calculateMurakamiWoehler(krs, request);
        data = [
          ...data,
          ...this.transformGraph(
            murakami,
            CHART_SETTINGS_WOEHLER.sources.find(
              src => src.identifier === 'murakami'
            ).value
          )
        ];
      }
      // parse display
      Object.keys(predictionResult.woehler).map(key => {
        const source = CHART_SETTINGS_WOEHLER.sources.find(
          src => src.identifier === key
        );
        data = [
          ...data,
          ...this.transformGraph(
            this.calculateStartPoint(
              predictionResult.woehler[key],
              predictionResult.kpi.slope
            ),
            source.value
          )
        ];
      });
      limits = this.calculateLimitsWoehler(data);
      data.map(point => {
        const keys = Object.keys(point);
        if (point[keys[1]] === 0) {
          point[keys[1]] = limits.y_min;
        }

        return point;
      });

      lines = this.calculateLines(limits);
    }

    if (display.chartType === ChartType.Haigh) {
      const fkm = this.calculateFKMHaigh(request);
      const murakami = this.calculateMurakamiHaigh(request);
      if (display.showFKM) {
        data = [
          ...data,
          ...this.transformGraph(
            fkm,
            CHART_SETTINGS_HAIGH.sources.find(src => src.identifier === 'fkm')
              .value
          )
        ];
      }
      if (display.showMurakami) {
        data = [
          ...data,
          ...this.transformGraph(
            murakami,
            CHART_SETTINGS_HAIGH.sources.find(
              src => src.identifier === 'murakami'
            ).value
          )
        ];
      }
      limits = this.calculateLimitsHaigh(data);

      // parse display
      Object.keys(predictionResult.haigh).map(key => {
        const source = CHART_SETTINGS_HAIGH.sources.find(
          src => src.identifier === key
        );
        // TODO: see if that can be solved better...
        if (source.identifier === 'appliedStress') {
          data = [
            ...data,
            ...this.transformGraph(
              this.extendGraphHaigh(predictionResult.haigh[key], limits),
              source.value
            )
          ];
        } else {
          data = [
            ...data,
            ...this.transformGraph(predictionResult.haigh[key], source.value)
          ];
        }
      });
      limits = this.calculateLimitsHaigh(data);
    }

    return { data, limits, lines, kpi: undefined };
  }

  /**
   * Calculates the starting point of a graph
   */
  public calculateStartPoint(graph: Graph, slope: number): Graph {
    if (graph[0] && this.isSNShape(graph) && graph[0].x !== 10000) {
      const newY = Math.pow(graph[0].x / 10000, 1 / slope) * graph[0].y;

      return {
        ...graph,
        0: {
          x: 10000,
          y: newY
        }
      };
    }

    if (graph[0] && !this.isSNShape(graph) && graph[2]) {
      // if becomes unnecessary as soon as graphs which are out of range are projected correctly by the backend
      if (graph[2].x === 10000) {
        return ({} as unknown) as Graph;
      }

      return {
        ...graph,
        2: {
          ...graph[2],
          y: 0
        }
      };
    }

    return graph;
  }

  /**
   * Returns true if the shape of the graph is fitting the shape of a sn curve in general
   */
  public isSNShape(graph: Graph): boolean {
    return graph[0] &&
      graph[2] &&
      graph[0].y > graph[1].y &&
      graph[0].y > graph[2].y &&
      graph[1].y === graph[2].y
      ? true
      : false;
  }

  /**
   * Transforms a graph object into an Array of Objects, each with the specified key for the y-value
   */
  public transformGraph(graph: Graph, argumentKey: string): Object[] {
    return Object.keys(graph).map(key => ({
      x: graph[key].x,
      [argumentKey]: graph[key].y
    }));
  }

  /**
   * Returns all points of a graph object as Arraye
   */
  public graphToArray(graph: Graph): Point[] {
    return Object.keys(graph).map(point => graph[point]);
  }

  /**
   * Calculates the graph for the FKM guideline in the Woehler chart and returns its data points
   */
  public calculateFKMWoehler(krs: number, request: PredictionRequest): Graph {
    // add FKM graph
    let saFKM =
      krs * 3.3 * 0.45 * request.hv - request.es < 700
        ? krs * 3.3 * 0.45 * request.hv - request.es
        : 700;
    if (request.rrelation === 0) {
      // recalc
      const m = (0.35 * 3.3 * request.hv) / 1000 - 0.1;
      saFKM = saFKM / (m + 1);
    }
    const startFKM = Math.pow(1000000 / 10000, 1 / 5) * saFKM;

    return this.createGraphObjectWoehler(startFKM, saFKM);
  }

  /**
   * Returns a graph object which matches the basic shape of a sn curve calculated by the analytic models
   */
  public createGraphObjectWoehler(start: number, sa: number): Graph {
    return {
      0: { x: 10000, y: start },
      1: { x: 1000000, y: sa },
      2: { x: 10000000, y: sa }
    };
  }

  /**
   * Calculates the graph for the Murakami model in the Woehler chart and returns its data points
   */
  public calculateFKMHaigh(request: PredictionRequest): Graph {
    // add FKM graph
    const r0FKM = 3.3 * 0.45 * request.hv;
    const m = (0.35 * 3.3 * request.hv) / 1000 - 0.1;
    const r1FKM = r0FKM / (m + 1);

    return this.createGraphObjectHaigh(r0FKM, r1FKM);
  }

  /**
   * Calculates the graph for the FKM guideline in the Woehler chart and returns its data points
   */
  public calculateMurakamiWoehler(
    krs: number,
    request: PredictionRequest
  ): Graph {
    let saMurakami =
      (krs * 1.56 * (request.hv + 120)) / Math.pow(request.rArea, 1 / 6) -
      request.es * 0.32;
    if (request.rrelation === 0) {
      // recalc
      saMurakami =
        saMurakami * Math.pow(0.5, request.hv * Math.pow(10, -4) + 0.226);
    }
    const startMurakami = Math.pow(1000000 / 10000, 1 / 5) * saMurakami;

    return this.createGraphObjectWoehler(startMurakami, saMurakami);
  }

  /**
   * Calculates the graph for the Murakami model in the Haigh chart and returns its data points
   */
  public calculateMurakamiHaigh(request: PredictionRequest): Graph {
    const r0Murakami =
      ((request.hv + 120) * 1.56) / Math.pow(request.rArea, 1 / 6);
    const r1Murakami =
      r0Murakami * Math.pow(0.5, request.hv * Math.pow(10, -4) + 0.226);

    return this.createGraphObjectHaigh(r0Murakami, r1Murakami);
  }

  /**
   * Returns a graph object which matches the basic shape of the applied stress visualization in the Haigh chart
   */
  public createGraphObjectHaigh(rrelation0, rrelation1): Graph {
    return {
      0: { x: 0, y: rrelation0 },
      1: { x: rrelation1, y: rrelation1 }
    };
  }

  /**
   * Increases the length of the applied stress graph in a Haigh chart based on the current calculated limits
   */
  public extendGraphHaigh(graph: Graph, limits): Graph {
    if (limits.x_max > graph[1].x || limits.y_max > graph[1].y) {
      return {
        0: {
          x: 0,
          y: 0
        },
        1: {
          x: this.increase10Percent(limits.x_max),
          y: this.increase10Percent(limits.y_max)
        }
      };
    }

    return graph;
  }

  /**
   * Calculates the limits for the chart axis based on the displayed data points
   */
  public calculateLimitsWoehler(points: Object[]): Limits {
    const yVals: number[] = points
      .map(p => {
        const keys = Object.keys(p);

        return Number(p[keys[1]]);
      })
      .filter(val => val && val !== 0);

    return {
      x_max: 10000000,
      x_min: 10000,
      y_max: this.increase10Percent(Math.max(...yVals)),
      y_min: this.reduce10Percent(Math.min(...yVals))
    };
  }

  /**
   * Calculates the limits for the chart axis based on the displayed data points
   */
  public calculateLimitsHaigh(points: Object[]): Limits {
    const yVals: number[] = points.map(p => {
      const keys = Object.keys(p);

      return Number(p[keys[1]]);
    });
    const xVals: number[] = points.map(p => {
      const keys = Object.keys(p);

      return Number(p[keys[0]]);
    });

    const max = Math.max(Math.max(...yVals), Math.max(...xVals));

    return {
      x_max: max,
      x_min: 0,
      y_max: max,
      y_min: 0
    };
  }

  /**
   * Decreases a given number by 10% and returns the value
   */
  public reduce10Percent(value: number): number {
    return value - value / 10;
  }

  /**
   * Increases a given number by 10% and returns the value
   */
  public increase10Percent(value: number): number {
    return value + value / 10;
  }
  // tslint:disable-next-line: max-file-line-count
}
