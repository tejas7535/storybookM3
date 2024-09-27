import { createSelector } from '@ngrx/store';

import { environment } from '@ga/environments/environment';
import { ReportUrls } from '@ga/shared/models';

import { getCalculationResultState } from '../../reducers';
import { getModelId } from '../bearing-selection/bearing-selection.selector';

export const getResultId = createSelector(
  getCalculationResultState,
  (state): string => state?.resultId
);

export const getReportUrls = createSelector(
  getResultId,
  getModelId,
  (resultId: string, modelId: string): ReportUrls =>
    resultId &&
    modelId && {
      htmlReportUrl: `${environment.baseUrl}/${modelId}/body/${resultId}`,
      jsonReportUrl: `${environment.baseUrl}/${modelId}/output/${resultId}`,
    }
);

export const hasResultMessage = createSelector(
  getCalculationResultState,
  (state): boolean => state.messages.length > 0
);

export const getResultMessages = createSelector(
  getCalculationResultState,
  (state) => state.messages
);
