import { createSelector } from '@ngrx/store';

import { HelpersService } from '../../services/helpers.service';

import * as fromStore from '../reducers';

import { getDisplay } from './input.selectors';

export const getPredictionRequest = createSelector(
  fromStore.getPredictionState,
  prediction => prediction.predictionRequest
);

export const getLoads = createSelector(
  fromStore.getPredictionState,
  prediction => prediction.loadsRequest
);

export const getLoadsResults = createSelector(
  fromStore.getPredictionState,
  prediction => prediction.loads
);

// TODO: remove any
export const getLoadsPoints = createSelector(
  getLoadsResults,
  loadsResults => {
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
  prediction => {
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
  (prediction, display, kpi) => {
    const helpersService = new HelpersService();
    const result = helpersService.preparePredictionResult(
      prediction.predictionResult,
      display,
      prediction.predictionRequest
    );

    return { ...result, kpi };
  }
);
