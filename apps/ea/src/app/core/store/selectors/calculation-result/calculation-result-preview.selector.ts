import { createSelector } from '@ngrx/store';

import {
  BasicCalculationResultState,
  CalculationResultPreviewData,
} from '../../models';
import { getCalculationTypes } from '../calculation-parameters/calculation-types.selector';
import {
  getCalculationResult as co2UpstreamCalculationResult,
  getError as co2UpstreamError,
  isLoading as co2UpstreamIsLoading,
} from './co2-upstream-calculation-result.selector';
import {
  getCalculationResult as frictionCalculationResult,
  getError as frictionError,
  isLoading as frictionIsLoading,
} from './friction-calculation-result.selector';

const co2Upstream = createSelector(
  co2UpstreamCalculationResult,
  co2UpstreamIsLoading,
  co2UpstreamError,
  (
    result,
    isLoading,
    error
  ): BasicCalculationResultState & { value?: number; unit?: string } => ({
    unit: result?.unit,
    value: result?.upstreamEmissionTotal,
    calculationError: error,
    isLoading,
  })
);

const co2Downstream = createSelector(
  frictionCalculationResult,
  frictionIsLoading,
  frictionError,
  (
    result,
    isLoading,
    error
  ): BasicCalculationResultState & { value?: number; unit?: string } => ({
    value: result?.co2_downstream?.value,
    unit: result?.co2_downstream?.unit,
    calculationError: error,
    isLoading,
  })
);

export const getCalculationResultPreviewData = createSelector(
  getCalculationTypes,
  co2Downstream,
  co2Upstream,
  (
    calculationTypes,
    co2DownstreamResult,
    co2UpstreamResult
  ): CalculationResultPreviewData => {
    const previewData: CalculationResultPreviewData = [];

    if (calculationTypes.emission.selected) {
      previewData.push({
        title: 'totalValueCO2',
        icon: 'co2',
        values: [
          {
            title: 'production',
            ...co2UpstreamResult,
          },
          {
            title: 'operation',
            ...co2DownstreamResult,
          },
        ],
      });
    }

    if (calculationTypes.friction.selected) {
      // not supported as of now
      // previewData.push({
      //   title: 'overrollingFrequency',
      //   icon: 'airwaves',
      //   values: [
      //     {
      //       title: 'overrollingFrequencySubtitle',
      //       ...calculationResult.ratingLife,
      //     },
      //   ],
      // });
    }

    return previewData;
  }
);
