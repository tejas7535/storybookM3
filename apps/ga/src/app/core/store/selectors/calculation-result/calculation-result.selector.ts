import { createSelector } from '@ngrx/store';

import { detectPartnerVersion } from '@ga/core/helpers/settings-helpers';
import { environment } from '@ga/environments/environment';
import { ReportUrls } from '@ga/shared/models';

import { getCalculationResultState } from '../../reducers';
import { getModelId } from '../bearing-selection/bearing-selection.selector';

export const getResultId = createSelector(
  getCalculationResultState,
  (state): string => state?.resultId
);

const baseUrl = detectPartnerVersion()
  ? environment.partnerUrl
  : environment.baseUrl;

export const getReportUrls = createSelector(
  getResultId,
  getModelId,
  (resultId: string, modelId: string): ReportUrls =>
    resultId &&
    modelId && {
      htmlReportUrl: `${baseUrl}/${modelId}/body/${resultId}`,
      jsonReportUrl: `${baseUrl}/${modelId}/output/${resultId}`,
      // pdfReportUrl: `${environment.baseUrl}/${modelId}/body/${resultId}`,
    }
);
