import { createSelector } from '@ngrx/store';

import {
  CalculationResultPreviewData,
  CalculationResultState,
} from '../../models';
import { getCalculationResultState } from '../../reducers';

export const getCalculationResult = createSelector(
  getCalculationResultState,
  (state): CalculationResultState => state
);

export const isCalculationResultAvailable = createSelector(
  getCalculationResultState,
  (state): boolean => state.isResultAvailable
);

export const isCalculationImpossible = createSelector(
  getCalculationResultState,
  (state): boolean => state.isCalculationImpossible
);

export const getCalculationResultPreviewData = createSelector(
  getCalculationResultState,
  (state): CalculationResultPreviewData => [
    {
      title: 'totalValueCO2',
      icon: 'airwave',
      values: [
        {
          title: 'production',
          value: state.co2.upstream,
          unit: 'kg',
        },
        {
          title: 'operation',
          value: state.co2.downstream,
          unit: 'kg',
        },
      ],
    },
    {
      title: 'overrollingFrequency',
      icon: 'airwave',
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
