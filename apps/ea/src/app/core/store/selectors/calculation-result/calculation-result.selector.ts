import { createSelector } from '@ngrx/store';

import { CalculationResult, CalculationResultPreviewData } from '../../models';
import { getCalculationResultState } from '../../reducers';

export const getCalculationResult = createSelector(
  getCalculationResultState,
  (state): CalculationResult => state.calculationResult
);

export const isCalculationResultAvailable = createSelector(
  getCalculationResult,
  (state): boolean => !!state
);

export const isCalculationImpossible = createSelector(
  getCalculationResultState,
  (state): boolean => state.isCalculationImpossible
);

export const isCalculationLoading = createSelector(
  getCalculationResultState,
  (state): boolean => !!state.isLoading
);

export const getModelId = createSelector(
  getCalculationResultState,
  (state): string | undefined => state.modelId
);

export const getCalculationId = createSelector(
  getCalculationResultState,
  (state): string | undefined => state.calculationId
);

export const getCalculationResultPreviewData = createSelector(
  getCalculationResult,
  (state): CalculationResultPreviewData => [
    {
      title: 'totalValueCO2',
      icon: 'co2',
      values: [
        {
          title: 'production',
          value: state.co2_upstream,
          unit: 'kg',
        },
        {
          title: 'operation',
          value: state.co2_downstream,
          unit: 'kg',
        },
      ].filter((item) => item.value !== undefined),
    },
    {
      title: 'overrollingFrequency',
      icon: 'airwaves',
      values: [
        {
          title: 'overrollingFrequencySubtitle',
          value: state.ratingLife,
          unit: 'mm²/s',
        },
      ],
    },
  ]
);
