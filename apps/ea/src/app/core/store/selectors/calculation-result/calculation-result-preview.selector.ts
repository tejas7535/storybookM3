import { createSelector } from '@ngrx/store';

import {
  CalculationResultPreviewData,
  CalculationResultPreviewItem,
  OverrollingPreviewKeys,
  ResultStateWithValue,
} from '../../models';
import { CalculationResultReportCalculationTypeSelection } from '../../models/calculation-result-report.model';
import {
  getSelectedLoadcase,
  getSelectedLoadcaseId,
} from '../calculation-parameters/calculation-parameters.selector';
import { getCalculationTypes } from '../calculation-parameters/calculation-types.selector';
import { isCo2DownstreamCalculationPossible } from '../product-selection/product-selection.selector';
import {
  getOverrollingFrequencies,
  getSelectedCalculations,
} from './calculation-result-report.selector';
import {
  getCalculationResult as catalogCalculationResult,
  getCalculationResult,
  getError as catalogCalculationError,
  getError,
  isLoading as catalogCalculationIsLoading,
} from './catalog-calculation-result.selector';
import { getLubricationDataFromBehavior } from './catalog-result-helper';
import {
  getDownstreamCalculationStateResult,
  getDownstreamErrors,
  isDownstreamCalculationLoading,
} from './co2-downstream-calculation-result.selector';
import {
  getCalculationResult as co2UpstreamCalculationResult,
  getError as co2UpstreamError,
  isLoading as co2UpstreamIsLoading,
} from './co2-upstream-calculation-result.selector';

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

export const catalogCalculation = createSelector(
  catalogCalculationResult,
  catalogCalculationIsLoading,
  catalogCalculationError,
  (result, isLoading, error): ({ title: string } & ResultStateWithValue)[] => [
    {
      title: 'ratingLifeSubtitle',
      value: result?.bearingBehaviour?.lh10?.value,
      unit: result?.bearingBehaviour?.lh10?.unit,
      calculationError: error || result?.calculationError?.error,
      isLoading,
    },
    {
      title: 'staticSafetySubtitle',
      value: result?.bearingBehaviour?.S0_min?.value,
      unit: result?.bearingBehaviour?.S0_min?.unit,
      calculationError: error || result?.calculationError?.error,
      isLoading,
    },
  ]
);

export const overrollingFrequencies = createSelector(
  getOverrollingFrequencies,
  catalogCalculationIsLoading,
  catalogCalculationError,
  getSelectedLoadcaseId,
  (
    result,
    isLoading,
    error,
    selectedLoadcase
  ): ({ title: string } & ResultStateWithValue)[] => {
    const overrollingValues: ({ title: string } & ResultStateWithValue)[] = [];
    for (const overrollingObject of result) {
      overrollingValues.push({
        ...overrollingObject,
        value: overrollingObject.loadcaseValues[selectedLoadcase]?.value,
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
  getSelectedLoadcaseId,
  (result, isLoading, error, selectedLoadcase): ResultStateWithValue => ({
    value:
      result?.loadcaseLubrication?.[selectedLoadcase]?.viscosityRatio?.value,
    unit: result?.loadcaseLubrication?.[selectedLoadcase]?.viscosityRatio?.unit,
    calculationError: error || result?.calculationError?.error,
    isLoading,
  })
);

export const co2DownstreamEmissionValue = createSelector(
  getDownstreamCalculationStateResult,
  isDownstreamCalculationLoading,
  getSelectedLoadcase,
  getDownstreamErrors,
  (result, isDownstreamLoading, loadcase, errors): ResultStateWithValue => {
    const value =
      result?.loadcaseEmissions?.[loadcase?.loadCaseName]?.co2Emissions;
    const time =
      result?.loadcaseEmissions?.[loadcase?.loadCaseName]?.operatingTimeInHours;
    const operatingTimeInHours = time ? Math.round(time) : undefined;
    const valueLoadcaseName = loadcase?.loadCaseName;

    return {
      isLoading: isDownstreamLoading,
      calculationError: errors?.[0],
      unit: value ? 'kg' : '',
      value: value ? `≈ ${value.toFixed(0)}` : undefined,
      valueLoadcaseName,
      additionalData: { operatingTimeInHours },
    };
  }
);

export const downstreamFrictionalPowerlossValue = createSelector(
  getDownstreamCalculationStateResult,
  isDownstreamCalculationLoading,
  getSelectedLoadcase,
  (result, isDownstreamLoading, loadcase): ResultStateWithValue => {
    const value =
      result?.loadcaseEmissions?.[loadcase?.loadCaseName]
        ?.totalFrictionalPowerLoss;

    return {
      isLoading: isDownstreamLoading,
      calculationError: undefined,
      unit: value ? 'W' : '',
      value: value ? `≈ ${value}` : undefined,
    };
  }
);

export const getCalculationResultPreviewData = createSelector(
  getCalculationTypes,
  catalogCalculation,
  co2Upstream,
  overrollingFrequencies,
  lubricationParameter,
  getSelectedLoadcase,
  getCalculationResult,
  co2DownstreamEmissionValue,
  downstreamFrictionalPowerlossValue,
  isCo2DownstreamCalculationPossible,
  (
    calculationTypes,
    catalogCalculationPreviewResult,
    co2UpstreamResult,
    overrollingResult,
    lubricationParameterResult,
    loadcase,
    result,
    co2DownstreamEmission,
    frictionalPowerloss,
    co2DownstreamCalculationPossible
  ): CalculationResultPreviewData => {
    const previewData: CalculationResultPreviewData = [];
    const loadcaseName = loadcase?.loadCaseName;

    if (calculationTypes.emission.selected) {
      const values: CalculationResultPreviewItem['values'] =
        co2DownstreamCalculationPossible
          ? [
              {
                title: 'production',
                titleTooltip: 'productionTooltip',
                ...co2UpstreamResult,
              },
              {
                title: 'usage',
                titleTooltip: 'usageTooltip',
                displayNewBadge: true,
                ...co2DownstreamEmission,
              },
            ]
          : [
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

    if (calculationTypes.ratingLife.selected) {
      previewData.push({
        title: 'ratingLife',
        icon: 'animation',
        values: [...catalogCalculationPreviewResult],
      });
    }

    if (calculationTypes.frictionalPowerloss.selected) {
      previewData.push({
        title: 'frictionalPowerloss',
        icon: 'compress',
        titleTooltip: 'frictionTitleTooltip',
        titleTooltipUrl: 'frictionTooltipUrl',
        titleTooltipUrlText: 'frictionTooltipUrlText',
        values: [
          {
            title: calculationTypes.frictionalPowerloss.disabled
              ? undefined
              : 'frictionalPowerlossSubtitle',
            calculationWarning: calculationTypes.frictionalPowerloss.disabled
              ? 'frictionalPowerlossUnavailable'
              : undefined,

            ...frictionalPowerloss,
          },
        ],
        loadcaseName,
      });
    }

    if (calculationTypes.lubrication.selected) {
      if (
        result &&
        result.bearingBehaviour &&
        !lubricationParameterResult.isLoading &&
        !lubricationParameterResult.value
      ) {
        const [_, r] = getLubricationDataFromBehavior(result);
        previewData.push({
          title: 'lubrication',
          svgIcon: 'water_drop',
          values: [{ ...r, isLoading: false }],
          loadcaseName,
        });
      } else {
        previewData.push({
          title: 'lubrication',
          svgIcon: 'water_drop',
          values: [
            { title: 'lubricationSubtitle', ...lubricationParameterResult },
          ],
          loadcaseName,
        });
      }
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
        loadcaseName,
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

export const isCalculationGeneralError = createSelector(
  getError,
  (error): boolean => error !== undefined
);
