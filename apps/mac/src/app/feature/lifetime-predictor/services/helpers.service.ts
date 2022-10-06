/* eslint-disable max-lines */
import { CHART_SETTINGS_HAIGH, CHART_SETTINGS_WOEHLER } from '../constants';
import { ChartType } from '../enums';
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
  PredictionResultParsed,
  Series,
  StatisticalPrediction,
  StatisticalPredictionParsed,
} from '../models';

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
          verticalAlignment: 'center',
        },
      });
      start = start < 800 ? start + 50 : start + 100;
    }

    return newLines;
  }

  /**
   * Returns only Points that are within the graph dimensions
   */
  public relevantLoadPoints(loadPoints: any, limits: Limits): Point[] {
    // TODO: remove any
    return loadPoints.filter((entry: any) => {
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
        slope:
          request.rrelation === -1 || request.rrelation === 0
            ? predictionResult.kpi.slope
            : undefined,
        count:
          predictionResult.woehler.appliedStress[1].x < 10_000_000
            ? predictionResult.woehler.appliedStress[1].x
            : -1,
        mpa: request.mpa,
      };
    }

    return {
      fatigue: predictionResult.kpi.fatigue[0],
      fatigue1: predictionResult.kpi.fatigue[1],
      meanStress:
        predictionResult.kpi.fatigue[1] / predictionResult.kpi.fatigue[0] - 1,
    };
  }

  /**
   * Parses a given response from statistical backend into Graph objects
   */
  public prepareStatisticalResult(
    statisticalResult: StatisticalPrediction,
    predictionRequest: PredictionRequest
  ): StatisticalPredictionParsed {
    // woehler
    const saFKM = statisticalResult.woehler.analytical.sa_fkm;
    const saMurakami = statisticalResult.woehler.analytical.sa_murakami;
    const startFKM = Math.pow(1_000_000 / 10_000, 1 / 5) * saFKM;
    const fkmWoehler = this.createGraphObjectWoehler(
      startFKM,
      saFKM,
      predictionRequest.rrelation
    );
    const startMurakami = Math.pow(1_000_000 / 10_000, 1 / 5) * saMurakami;
    const murakamiWoehler = this.createGraphObjectWoehler(
      startMurakami,
      saMurakami,
      predictionRequest.rrelation
    );

    // haigh
    const r0FKM = statisticalResult.haigh.analytical.r0_fkm;
    const r1FKM = statisticalResult.haigh.analytical.r1_fkm;
    const r0Murakami = statisticalResult.haigh.analytical.r0_murakami;
    const r1Murakami = statisticalResult.haigh.analytical.r1_murakami;
    const r0Statistical = statisticalResult.haigh.statistical.r0;
    const r1Statistical = statisticalResult.haigh.statistical.r1;
    const fkmHaigh = this.createGraphObjectHaigh(r0FKM, r1FKM);
    const murakamiHaigh = this.createGraphObjectHaigh(r0Murakami, r1Murakami);
    const statistical = this.createGraphObjectHaigh(
      r0Statistical,
      r1Statistical
    );

    return {
      woehler: {
        analytical: {
          fkm: fkmWoehler,
          murakami: murakamiWoehler,
        },
        statistical_sn_curve: {
          ...statisticalResult.woehler.statistical_sn_curve,
        },
      },
      haigh: {
        statistical,
        analytical: {
          fkm: fkmHaigh,
          murakami: murakamiHaigh,
        },
      },
    };
  }

  /**
   * Calculates all required values to display the selected chart correctly from the given state
   */
  public preparePredictionResult(
    predictionResult: PredictionResult,
    statisticalResult: StatisticalPrediction,
    display: Display,
    predictionRequest: PredictionRequest
  ): PredictionResultParsed {
    if (!predictionResult) {
      return undefined;
    }

    // TODO: remove any
    let data: any[] = [];
    let limits: Limits;
    let lines: any[] = [];
    // calculate FKM and Murakami

    if (display.chartType === ChartType.Woehler) {
      if (display.showFKM) {
        const saFKM = statisticalResult.woehler.analytical.sa_fkm;
        const startFKM = Math.pow(1_000_000 / 10_000, 1 / 5) * saFKM;
        const fkm = this.createGraphObjectWoehler(
          startFKM,
          saFKM,
          predictionRequest.rrelation
        );
        data = [
          ...data,
          ...this.transformGraph(
            fkm,
            CHART_SETTINGS_WOEHLER.sources.find(
              (src) => src.identifier === 'fkm'
            )?.value
          ),
        ];
      }
      if (display.showMurakami) {
        const saMurakami = statisticalResult.woehler.analytical.sa_murakami;
        const startMurakami = Math.pow(1_000_000 / 10_000, 1 / 5) * saMurakami;
        const murakami = this.createGraphObjectWoehler(
          startMurakami,
          saMurakami,
          predictionRequest.rrelation
        );
        data = [
          ...data,
          ...this.transformGraph(
            murakami,
            CHART_SETTINGS_WOEHLER.sources.find(
              (src) => src.identifier === 'murakami'
            )?.value
          ),
        ];
      }
      if (display.showStatistical) {
        const statistical = this.createGraphObjectWoehler(
          statisticalResult.woehler.statistical_sn_curve.percentile_50[0].y,
          statisticalResult.woehler.statistical_sn_curve.percentile_50[1].y,
          predictionRequest.rrelation
        );
        data = [
          ...data,
          ...this.transformGraph(
            statistical,
            CHART_SETTINGS_WOEHLER.sources.find(
              (src) => src.identifier === 'statistical'
            )?.value
          ),
        ];
      }

      // for new high and low limit
      data = [
        ...data,
        ...this.constructHardnessGraph(predictionResult.woehler),
      ];

      // parse display
      Object.entries(predictionResult.woehler).map((value: [string, Graph]) => {
        const source = CHART_SETTINGS_WOEHLER.sources.find(
          (src) => src.identifier === value[0]
        );
        const ignoredGraphs = ['snCurveLow', 'snCurveHigh'];
        if (
          predictionRequest.rrelation !== -1 &&
          predictionRequest.rrelation !== 0
        ) {
          ignoredGraphs.push('appliedStress');
        }
        if (!ignoredGraphs.includes(source.identifier)) {
          data = [
            ...data,
            ...this.transformGraph(
              this.calculateStartPoint(
                value[1],
                predictionResult.kpi.slope,
                predictionRequest.rrelation
              ),
              source.value
            ),
          ];
        }
      });

      limits = this.calculateLimitsWoehler(data);
      data.map((point) => {
        const keys = Object.keys(point);
        if (point[keys[1]] === 0) {
          point[keys[1]] = limits.y_min;
        }

        return point;
      });

      lines = this.calculateLines(limits);
    }

    if (display.chartType === ChartType.Haigh) {
      const r0FKM = statisticalResult.haigh.analytical.r0_fkm;
      const r1FKM = statisticalResult.haigh.analytical.r1_fkm;
      const r0Murakami = statisticalResult.haigh.analytical.r0_murakami;
      const r1Murakami = statisticalResult.haigh.analytical.r1_murakami;
      const r0Statistical = statisticalResult.haigh.statistical.r0;
      const r1Statistical = statisticalResult.haigh.statistical.r1;
      const fkm = this.createGraphObjectHaigh(r0FKM, r1FKM);
      const murakami = this.createGraphObjectHaigh(r0Murakami, r1Murakami);
      const statistical = this.createGraphObjectHaigh(
        r0Statistical,
        r1Statistical
      );
      if (display.showFKM) {
        data = [
          ...data,
          ...this.transformGraph(
            fkm,
            CHART_SETTINGS_HAIGH.sources.find((src) => src.identifier === 'fkm')
              ?.value
          ),
        ];
      }
      if (display.showMurakami) {
        data = [
          ...data,
          ...this.transformGraph(
            murakami,
            CHART_SETTINGS_HAIGH.sources.find(
              (src) => src.identifier === 'murakami'
            )?.value
          ),
        ];
      }
      if (display.showStatistical) {
        data = [
          ...data,
          ...this.transformGraph(
            statistical,
            CHART_SETTINGS_HAIGH.sources.find(
              (src) => src.identifier === 'statistical'
            )?.value
          ),
        ];
      }

      limits = this.calculateLimitsHaigh(data);

      // parse display
      Object.entries(predictionResult.haigh).map((value: [string, Graph]) => {
        const source = CHART_SETTINGS_HAIGH.sources.find(
          (src: Series) => src.identifier === value[0]
        );
        data =
          source?.identifier === 'appliedStress'
            ? [
                ...data,
                ...this.transformGraph(
                  this.extendGraphHaigh(value[1], limits),
                  source.value
                ),
              ]
            : [...data, ...this.transformGraph(value[1], source?.value)];
      });
      limits = this.calculateLimitsHaigh(data);
    }

    return { data, limits, lines, kpi: undefined };
  }

  /**
   * Calculates hardness diversivication range coordinates
   */
  public constructHardnessGraph({
    snCurveLow,
    snCurveHigh,
  }: {
    snCurveLow?: Graph;
    snCurveHigh?: Graph;
  }): { x: number; yLow: number; yHigh: number }[] {
    return snCurveLow &&
      snCurveHigh &&
      Object.keys(snCurveLow).length > 0 &&
      Object.keys(snCurveHigh).length > 0
      ? [
          {
            x: snCurveLow[2].x,
            yLow: snCurveLow[2].y,
            yHigh: snCurveHigh[2].y,
          },
          {
            x: snCurveLow[1].x,
            yLow: snCurveLow[1].y,
            yHigh: snCurveHigh[1].y,
          },
        ]
      : [];
  }

  /**
   * Calculates the starting point of a graph
   */
  public calculateStartPoint(
    graph: Graph,
    slope: number,
    rrelation: number
  ): Graph {
    if (graph[0] && this.isSNShape(graph) && graph[0].x !== 10_000) {
      const newY = Math.pow(graph[0].x / 10_000, 1 / slope) * graph[0].y;

      return rrelation === -1 || rrelation === 0
        ? {
            ...graph,
            0: {
              x: 10_000,
              y: newY,
            },
          }
        : {
            0: graph[1],
            1: graph[2] || { ...graph[1], x: 10_000_000 },
          };
    }

    if (graph[0] && !this.isSNShape(graph) && graph[2]) {
      // if becomes unnecessary as soon as graphs which are out of range are projected correctly by the backend
      if (graph[2].x === 10_000) {
        return {} as unknown as Graph;
      }

      return {
        ...graph,
        2: {
          ...graph[2],
          y: 0,
        },
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
  public transformGraph(graph: Graph, argumentKey: string): any[] {
    return argumentKey
      ? Object.entries(graph).map((value: [string, Point]) =>
          value
            ? {
                x: value[1]?.x,
                [argumentKey]: value[1]?.y,
              }
            : undefined
        )
      : [];
  }

  /**
   * Returns all points of a graph object as Arraye
   */
  public graphToArray(graph: Graph): Point[] {
    return Object.entries(graph).map((value: [string, Point]) => value[1]);
  }

  /**
   * Returns a graph object which matches the basic shape of a sn curve calculated by the analytic models
   */
  public createGraphObjectWoehler(
    start: number,
    sa: number,
    rrelation: number
  ): Graph {
    return rrelation === -1 || rrelation === 0
      ? {
          0: { x: 10_000, y: start },
          1: { x: 1_000_000, y: sa },
          2: { x: 10_000_000, y: sa },
        }
      : {
          0: { x: 1_000_000, y: sa },
          1: { x: 10_000_000, y: sa },
        };
  }

  /**
   * Returns a graph object which matches the basic shape of the applied stress visualization in the Haigh chart
   */
  public createGraphObjectHaigh(rrelation0: number, rrelation1: number): Graph {
    return {
      0: { x: 0, y: rrelation0 },
      1: { x: rrelation1, y: rrelation1 },
    };
  }

  /**
   * Increases the length of the applied stress graph in a Haigh chart based on the current calculated limits
   */
  public extendGraphHaigh(graph: Graph, limits: Limits): Graph {
    if (limits.x_max > graph[1].x || limits.y_max > graph[1].y) {
      return {
        0: {
          x: 0,
          y: 0,
        },
        1: {
          x: this.increase10Percent(limits.x_max),
          y: this.increase10Percent(limits.y_max),
        },
      };
    }

    return graph;
  }

  /**
   * Calculates the limits for the chart axis based on the displayed data points
   */
  public calculateLimitsWoehler(points: any[]): Limits {
    // TODO: remove any
    const yVals: number[] = points
      .map((p) => {
        const pEntries: [string, any][] = Object.entries(p);

        return Number(pEntries[1][1]);
      })
      .filter((val) => val && val !== 0);

    return {
      x_max: 10_000_000,
      x_min: 10_000,
      y_max: this.increase10Percent(Math.max(...yVals)),
      y_min: this.reduce10Percent(Math.min(...yVals)),
    };
  }

  /**
   * Calculates the limits for the chart axis based on the displayed data points
   */
  public calculateLimitsHaigh(points: any[]): Limits {
    // TODO: remove any
    const yVals: number[] = points.map((p) => {
      const pEntries: [string, any][] = Object.entries(p);

      return Number(pEntries[1][1]);
    });
    const xVals: number[] = points.map((p) => {
      const pEntries: [string, any][] = Object.entries(p);

      return Number(pEntries[0][1]);
    });

    const max = Math.max(Math.max(...yVals), Math.max(...xVals));

    return {
      x_max: max,
      x_min: 0,
      y_max: max,
      y_min: 0,
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
  // eslint-disable-next-line max-lines
}
