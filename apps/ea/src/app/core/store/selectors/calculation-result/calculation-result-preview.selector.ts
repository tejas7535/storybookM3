import { createSelector } from '@ngrx/store';

import {
  BasicCalculationResultState,
  CalculationResultPreviewData,
  CalculationResultPreviewItem,
  OverrollingPreviewKeys,
} from '../../models';
import { CalculationResultReportCalculationTypeSelection } from '../../models/calculation-result-report.model';
import { getCalculationTypes } from '../calculation-parameters/calculation-types.selector';
import {
  getOverrollingFrequencies,
  getSelectedCalculations,
} from './calculation-result-report.selector';
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

export const friction = createSelector(
  catalogCalculationResult,
  catalogCalculationIsLoading,
  catalogCalculationError,
  (result, isLoading, error): ResultStateWithValue => ({
    value: result?.totalFrictionalTorque?.value,
    unit: result?.totalFrictionalTorque?.unit,
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
    calculationError: error || result?.calculationError?.error,
    isLoading,
  })
);

export const overrollingFrequencies = createSelector(
  getOverrollingFrequencies,
  catalogCalculationIsLoading,
  catalogCalculationError,
  (result, isLoading, error): ({ title: string } & ResultStateWithValue)[] => {
    const overrollingValues: ({ title: string } & ResultStateWithValue)[] = [];
    for (const overrollingObject of result) {
      overrollingValues.push({
        ...overrollingObject,
        isLoading,
        calculationError: error,
      });
    }

    return overrollingValues;
  }
);

export const lubricationParameter = createSelector(
  catalogCalculationResult,
  catalogCalculationIsLoading,
  catalogCalculationError,
  (result, isLoading, error): ResultStateWithValue => ({
    value: result?.viscosityRatio?.value,
    unit: result?.viscosityRatio?.unit,
    calculationError: error || result?.calculationError?.error,
    isLoading,
  })
);

export const getCalculationResultPreviewData = createSelector(
  getCalculationTypes,
  catalogCalculation,
  co2Upstream,
  friction,
  overrollingFrequencies,
  lubricationParameter,
  (
    calculationTypes,
    catalogCalculationPreviewResult,
    co2UpstreamResult,
    frictionResult,
    overrollingResult,
    lubricationParameterResult
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
            title: calculationTypes.frictionalPowerloss.disabled
              ? undefined
              : 'frictionalPowerlossSubtitle',
            calculationWarning: calculationTypes.frictionalPowerloss.disabled
              ? 'frictionalPowerlossUnavailable'
              : undefined,
            ...frictionResult,
          },
        ],
      });
    }

    if (calculationTypes.lubrication.selected) {
      previewData.push({
        title: 'lubrication',
        svgIcon: 'water_drop',
        values: [
          { title: 'lubricationSubtitle', ...lubricationParameterResult },
        ],
      });
    }

    if (calculationTypes.emission.selected) {
      const values: CalculationResultPreviewItem['values'] = [
        {
          title: 'production',
          titleTooltip: 'productionTooltip',
          ...co2UpstreamResult,
        },
      ];

      previewData.push({
        title: 'emissions',
        titleTooltip: 'emissionsTooltip',
        svgIcon: 'co2',
        values,
      });
    }

    if (calculationTypes.overrollingFrequency.selected) {
      previewData.push({
        title: 'overrollingFrequency',
        svgIcon: 'airwaves',
        values: overrollingResult
          .filter((valueItem) =>
            OverrollingPreviewKeys.includes(valueItem.title)
          )
          .map((item) => ({ ...item, title: `short.${item.title}` })),
      });
    }

    return previewData;
  }
);

export const isAnyServiceLoading = createSelector(
  catalogCalculationIsLoading,
  co2UpstreamIsLoading,

  (...loadingStatus): boolean => loadingStatus.some((status) => !!status)
);

export const isCalculationResultReportAvailable = createSelector(
  getSelectedCalculations,
  isAnyServiceLoading,
  (
    selectedCalculations: CalculationResultReportCalculationTypeSelection,
    anyLoading
  ): boolean =>
    !anyLoading &&
    !isSomeOfSelectedCalculationsWithoutResult(selectedCalculations)
);

function isSomeOfSelectedCalculationsWithoutResult(
  selectedCalculations: CalculationResultReportCalculationTypeSelection
): boolean {
  return (
    selectedCalculations.length === 0 ||
    selectedCalculations.some((data) => !data.resultAvailable)
  );
}

export const isCalculationImpossible = createSelector(
  catalogCalculationResult,

  (result): boolean => result?.calculationError?.error !== undefined
);
