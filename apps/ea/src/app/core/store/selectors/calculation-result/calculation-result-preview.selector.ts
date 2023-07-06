import { createSelector } from '@ngrx/store';

import {
  BasicCalculationResultState,
  CalculationResultPreviewData,
  CalculationResultPreviewItem,
} from '../../models';
import { getCalculationTypes } from '../calculation-parameters/calculation-types.selector';
import { getCalculationModuleInfo } from '../product-selection/product-selection.selector';
import {
  getCalculationResult as catalogCalculationResult,
  getError as catalogCalculationError,
  isLoading as catalogCalculationIsLoading,
} from './catalog-calculation-result.selector';
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

type ResultStateWithValue = BasicCalculationResultState & {
  value?: number | string;
  unit?: string;
};

export const co2Upstream = createSelector(
  co2UpstreamCalculationResult,
  co2UpstreamIsLoading,
  co2UpstreamError,
  (result, isLoading, error): ResultStateWithValue => ({
    unit: result?.unit,
    value: result?.upstreamEmissionTotal,
    calculationError: error,
    isLoading,
  })
);

export const co2Downstream = createSelector(
  frictionCalculationResult,
  frictionIsLoading,
  frictionError,
  (result, isLoading, error): ResultStateWithValue => ({
    value: result?.co2_downstream?.value,
    unit: result?.co2_downstream?.unit,
    calculationError: error,
    isLoading,
  })
);

export const friction = createSelector(
  frictionCalculationResult,
  frictionIsLoading,
  frictionError,
  (result, isLoading, error): ResultStateWithValue => ({
    value: result?.max_frictionalTorque?.value,
    unit: result?.max_frictionalTorque?.unit,
    calculationError: error,
    isLoading,
  })
);

export const catalogCalculation = createSelector(
  catalogCalculationResult,
  catalogCalculationIsLoading,
  catalogCalculationError,
  (result, isLoading, error): ResultStateWithValue => ({
    value: result?.lh10?.value,
    unit: result?.lh10?.unit,
    calculationError: error,
    isLoading,
  })
);

export const getCalculationResultPreviewData = createSelector(
  getCalculationTypes,
  catalogCalculation,
  co2Downstream,
  co2Upstream,
  friction,
  getCalculationModuleInfo,
  (
    calculationTypes,
    catalogCalculationPreviewResult,
    co2DownstreamResult,
    co2UpstreamResult,
    frictionResult,
    moduleInfo
  ): CalculationResultPreviewData => {
    const previewData: CalculationResultPreviewData = [];

    if (calculationTypes.ratingLife.selected) {
      previewData.push({
        title: 'ratingLife',
        icon: 'animation',
        values: [
          {
            title: 'ratingLifeSubtitle',
            ...catalogCalculationPreviewResult,
          },
        ],
      });
    }

    if (calculationTypes.frictionalPowerloss.selected) {
      previewData.push({
        title: 'frictionalPowerloss',
        icon: 'compress',
        values: [
          {
            title: 'frictionalPowerlossSubtitle',
            ...frictionResult,
          },
        ],
      });
    }

    if (calculationTypes.emission.selected) {
      const values: CalculationResultPreviewItem['values'] = [
        {
          title: 'production',
          ...co2UpstreamResult,
        },
      ];

      if (moduleInfo?.frictionCalculation) {
        values.push({
          title: 'operation',
          ...co2DownstreamResult,
        });
      }

      previewData.push({
        title: 'emissions',
        svgIcon: 'co2',
        values,
      });
    }

    return previewData;
  }
);

export const isCalculationResultReportAvailable = createSelector(
  getCalculationResultPreviewData,
  (previewData: CalculationResultPreviewData): boolean =>
    previewData.some((data) =>
      data.values.some((value) => value.value !== undefined)
    ) &&
    previewData.every((data) => data.values.every((value) => !value.isLoading))
);
