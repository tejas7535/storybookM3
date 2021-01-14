import { createSelector } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { HelpersService } from '../../services/helpers.service';
import * as fromStore from '../reducers';
import { getDisplay } from './input.selectors';

export const getPredictionRequest = createSelector(
  fromStore.getPredictionState,
  (prediction) => prediction.predictionRequest
);

export const getStatisticalRequest = createSelector(
  fromStore.getPredictionState,
  (prediction) => prediction.statisticalRequest
);

export const getLoads = createSelector(
  fromStore.getPredictionState,
  (prediction) => prediction.loadsRequest
);

export const getLoadsResults = createSelector(
  fromStore.getPredictionState,
  (prediction) => prediction.loads
);

// TODO: remove any
export const getLoadsPoints = createSelector(
  getLoadsResults,
  (loadsResults) => {
    const result: any[] = [];
    if (loadsResults && loadsResults[Object.keys(loadsResults)[0]].length > 0) {
      loadsResults[Object.keys(loadsResults)[0]].forEach(
        (_entry: any, index: number) => {
          result.push({ x: loadsResults.x[index], y: loadsResults.y[index] });
        }
      );
    }

    return result;
  }
);

export const getLoadsStatus = createSelector(
  fromStore.getPredictionState,
  (prediction) => {
    const { status, error } = prediction.loadsRequest;

    return { status, error };
  }
);

export const getKpis = createSelector(
  fromStore.getPredictionState,
  getDisplay,
  (prediction, display) => {
    const helpersService = new HelpersService();
    const result = helpersService.prepareKpis(
      prediction.predictionResult,
      display,
      prediction.predictionRequest
    );

    return result;
  }
);

export const getPredictionResult = createSelector(
  fromStore.getPredictionState,
  getDisplay,
  getKpis,
  getLoadsPoints,
  (prediction, display, kpi, loadsPoints) => {
    const helpersService = new HelpersService();
    const result = helpersService.preparePredictionResult(
      prediction.predictionResult,
      prediction.statisticalResult,
      display,
      loadsPoints
    );

    return { ...result, kpi };
  }
);

export const getPredictionResultGraphData = createSelector(
  getPredictionResult,
  (prediction) => {
    let graphData: EChartsOption = {
      dataset: {
        source: prediction.data || [],
      },
    };

    if (prediction.limits) {
      graphData = {
        ...graphData,
        xAxis: {
          min: prediction.limits.x_min,
          max: prediction.limits.x_max,
        },
        yAxis: {
          min: prediction.limits.y_min,
          max: prediction.limits.y_max,
        },
      };
    }

    return graphData;
  }
);

export const getStatisticalResult = createSelector(
  fromStore.getPredictionState,
  (prediction) => {
    const helpersService = new HelpersService();
    const result = helpersService.prepareStatisticalResult(
      prediction.statisticalResult
    );

    return { ...result };
  }
);

export const getLoadsRequest = createSelector(
  getLoads,
  fromStore.getPredictionState,
  (loads, prediction) => {
    if (!loads.data) {
      return undefined;
    }
    const { data, conversionFactor, repetitionFactor, method } = loads;
    const { kpi } = prediction.predictionResult;
    const request = {
      conversionFactor,
      repetitionFactor,
      method,
      loads: data,
      fatigue_strength1: kpi.fatigue[1],
      fatigue_strength0: kpi.fatigue[0],
    };

    return request;
  }
);
