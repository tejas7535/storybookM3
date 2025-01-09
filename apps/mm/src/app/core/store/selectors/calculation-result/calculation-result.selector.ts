import { createSelector } from '@ngrx/store';

import {
  ReportMessages,
  ResultTypeConfig,
} from '../../models/calculation-result-state.model';
import { getCalculationResultState } from '../../reducers';

export const getCalculationInputs = createSelector(
  getCalculationResultState,
  (state) => state?.result?.inputs || undefined
);

export const getCalculationMessages = createSelector(
  getCalculationResultState,
  (state) =>
    state?.result?.reportMessages ||
    ({
      notes: [],
      warnings: [],
      errors: [],
    } as ReportMessages)
);

export const isResultAvailable = createSelector(
  getCalculationResultState,
  (state) => !!state?.result && !state.isLoading
);

export const isLoading = createSelector(
  getCalculationResultState,
  (state) => state.isLoading
);

export const getMountingRecommendations = createSelector(
  getCalculationResultState,
  (state) => state?.result?.mountingRecommendations || []
);

export const getMountingTools = createSelector(
  getCalculationResultState,
  (state) => state?.result?.mountingTools
);

export const hasMountingTools = createSelector(
  getMountingTools,
  (mountingTools) =>
    !!mountingTools &&
    (mountingTools.hydraulicNut.length > 0 ||
      mountingTools.additionalTools.length > 0 ||
      mountingTools.pumps.items.length > 0 ||
      mountingTools.locknut.length > 0)
);

export const getReportSelectionTypes = createSelector(
  getCalculationInputs,
  hasMountingTools,
  getMountingRecommendations,
  getCalculationMessages,
  (
    inputs,
    mountingTools,
    mountingRecommendations,
    messages
  ): ResultTypeConfig[] => {
    const reportSelectionTypes: ResultTypeConfig[] = [];

    if (inputs) {
      reportSelectionTypes.push({ name: 'reportInputs' });
    }

    if (mountingTools) {
      reportSelectionTypes.push({ name: 'mountingToolsAndUtilities' });
    }

    if (mountingRecommendations.length > 0) {
      reportSelectionTypes.push({ name: 'mountingInstructions' });
    }

    if (
      messages.errors.length > 0 ||
      messages.warnings.length > 0 ||
      messages.notes.length > 0
    ) {
      reportSelectionTypes.push({ name: 'reportMessages' });
    }

    return reportSelectionTypes;
  }
);

export const getHtmlBodyUrl = createSelector(
  getCalculationResultState,
  (state) => state?.htmlBodyUrl
);
