import { createSelector } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { HelpersService } from '../../services/helpers.service';
import * as fromStore from '../reducers';
import { getDisplay } from './input.selectors';

export const getPredictionState = createSelector(
  fromStore.getLTPState,
  (ltpState) => ltpState.prediction
);

export const getPredictionRequest = createSelector(
  getPredictionState,
  (prediction) => prediction.predictionRequest
);

export const getStatisticalRequest = createSelector(
  getPredictionState,
  (prediction) => prediction.statisticalRequest
);

export const getKpis = createSelector(
  getPredictionState,
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
  getPredictionState,
  getDisplay,
  getKpis,
  getPredictionRequest,
  (prediction, display, kpi, predictionRequest) => {
    const helpersService = new HelpersService();
    const result = helpersService.preparePredictionResult(
      prediction.predictionResult,
      prediction.statisticalResult,
      display,
      predictionRequest
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

export const getPredictionResultGraphDataMapped = (
  chartOptions: EChartsOption
) =>
  createSelector(getPredictionResultGraphData, (graphData: EChartsOption) => ({
    ...chartOptions,
    xAxis: {
      ...chartOptions.xAxis,
      ...graphData.xAxis,
    },
    yAxis: {
      ...chartOptions.yAxis,
      ...graphData.yAxis,
    },
    dataset: {
      ...chartOptions.dataset,
      ...graphData.dataset,
    },
  }));

export const getStatisticalResult = createSelector(
  getPredictionState,
  (prediction) => {
    const helpersService = new HelpersService();
    const result = helpersService.prepareStatisticalResult(
      prediction.statisticalResult,
      prediction.predictionRequest
    );

    return { ...result };
  }
);
