import { createSelector } from '@ngrx/store';

import { environment } from '../../../../../environments/environment';
import { ReportUrls } from '../../../../shared/models';
import { getResultState } from '../../reducers';
import { ResultState } from '../../reducers/result/result.reducer';
import { getModelId } from '../bearing/bearing.selector';

export const getResultId = createSelector(
  getResultState,
  (state: ResultState): string => state?.resultId
);

export const getReportUrls = createSelector(
  getResultId,
  getModelId,
  (resultId: string, modelId: string): ReportUrls =>
    resultId &&
    modelId && {
      htmlReportUrl: `${environment.baseUrl}/${modelId}/body/${resultId}`,
      jsonReportUrl: `${environment.baseUrl}/${modelId}/output/${resultId}`,
      // pdfReportUrl: `${environment.baseUrl}/${modelId}/body/${resultId}`,
    }
);
