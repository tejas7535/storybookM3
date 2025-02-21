/* eslint-disable max-lines */
import { BEARING_BEHAVIOUR_ABBREVIATIONS_KEY_MAPPING } from '@ea/core/services/bearinx-result.constant';
import { createSelector } from '@ngrx/store';

import {
  CalculationResultReportInput,
  CalculationType,
  FrictionKeys,
  LoadcaseResultItem,
  lubricationBearingBehaviourItems,
} from '../../models';
import {
  CalculationResultReportCalculationTypeSelection,
  LoadcaseResultCombinedItem,
} from '../../models/calculation-result-report.model';
import { getCalculationTypesConfig } from '../calculation-parameters/calculation-types.selector';
import {
  getCalculationResult as catalogCalculationResult,
  isCalculationResultAvailable as isCatalogCalculationResultAvailable,
} from './catalog-calculation-result.selector';
import { getLubricationDataFromBehavior } from './catalog-result-helper';
import {
  getDownstreamCalculationStateInputs,
  getDownstreamCalculationStateResult,
  getDownstreamErrors,
  isDownstreamResultAvailable,
} from './co2-downstream-calculation-result.selector';
import { getCalculationResult as co2UpstreamCalculationResult } from './co2-upstream-calculation-result.selector';

export interface CO2EmissionResult {
  totalEmission: number;
  co2_upstream: number;
  co2_upstreamEmissionPercentage: number;
  co2_downstream: {
    emission: number;
    emissionPercentage: number;
    loadcases?: LoadcaseResult[];
  };
}

interface LoadcaseResult {
  id: string;
  emission: number;
  unit: string;
  emissionPercentage: number;
  operatingTimeInHours: number;
}

export const combineLoadcaseResultItemValuesByKey = (
  resultItems: { [designation: string]: LoadcaseResultItem }[],
  key: string
): {
  value?: string | number;
  loadcaseName: string;
}[] =>
  resultItems.map((item) => ({
    value: item[key]?.value,
    loadcaseName: item[key]?.loadcaseName,
  }));

export const getCO2EmissionReport = createSelector(
  co2UpstreamCalculationResult,
  getDownstreamCalculationStateResult,
  (co2Upstream, co2Downstream): CO2EmissionResult => {
    const totalEmission =
      (co2Upstream?.upstreamEmissionTotal ?? 0) +
      (co2Downstream?.co2Emissions ?? 0);

    const upstreamEmissionPercentage =
      ((co2Upstream?.upstreamEmissionTotal ?? 0) / totalEmission) * 100;

    const downstreamEmissionPercentage =
      ((co2Downstream?.co2Emissions ?? 0) / totalEmission) * 100;

    const loadcases = Object.entries(
      co2Downstream?.loadcaseEmissions ?? {}
    ).map(([key, loadcase]) => ({
      id: key,
      emission: loadcase.co2Emissions,
      unit: loadcase.co2EmissionsUnit,
      emissionPercentage: (loadcase.co2Emissions / totalEmission) * 100,
      operatingTimeInHours: Math.round(loadcase.operatingTimeInHours),
    }));

    return {
      co2_upstream: co2Upstream?.upstreamEmissionTotal,
      co2_upstreamEmissionPercentage: upstreamEmissionPercentage,
      co2_downstream: {
        emission: co2Downstream?.co2Emissions,
        emissionPercentage: downstreamEmissionPercentage,
        loadcases,
      },
      totalEmission,
    };
  }
);

export const isEmissionResultAvailable = createSelector(
  getCO2EmissionReport,
  (co2Emission): boolean =>
    !!co2Emission?.co2_downstream?.emission || !!co2Emission?.co2_upstream
);

export const getFrictionalalPowerlossReport = createSelector(
  getDownstreamCalculationStateResult,
  (downstreamResult) => {
    const loadcaseEmissions = downstreamResult?.loadcaseEmissions;

    const result: LoadcaseResultCombinedItem[] = [];
    if (loadcaseEmissions) {
      const config: { [key: string]: { unit: string; short: string } } = {
        totalFrictionalPowerLoss: {
          unit: 'W',
          short: 'NR',
        },
        totalFrictionalTorque: {
          unit: 'N m',
          short: 'MR',
        },
      };

      const configKeys = Object.keys(config);

      Object.entries(loadcaseEmissions).forEach(([loadcaseName, values]) => {
        Object.entries(values).forEach(([key, value]) => {
          if (configKeys.includes(key)) {
            let item = result.find((r) => r.title === key);
            if (!item) {
              const { unit, short } = config[key];
              item = {
                title: key,
                unit,
                short,
                loadcaseValues: [],
              };
              result.push(item);
            }
            item.loadcaseValues.push({
              loadcaseName,
              value,
            });
          }
        });
      });
    }

    const resultItems = result
      .filter((item) => item.loadcaseValues !== undefined)
      .sort(
        (a, b) => FrictionKeys.indexOf(a.short) - FrictionKeys.indexOf(b.short)
      );
    if (resultItems.length === 0) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }

    return resultItems;
  }
);

export const getLubricationReport = createSelector(
  catalogCalculationResult,
  (calculationResult) => {
    const result: LoadcaseResultCombinedItem[] = Object.entries(
      calculationResult?.loadcaseLubrication?.[0] || {}
    )
      .map(([_key, item]) => ({ ...item }))
      .map((item) => ({
        loadcaseValues: combineLoadcaseResultItemValuesByKey(
          calculationResult.loadcaseLubrication,
          item.title
        ),
        warning: item.warning,
        unit: item.unit,
        title: item.title,
        short: item.short,
      }));

    const [haveRelubInterval, resultObj] =
      getLubricationDataFromBehavior(calculationResult);

    const res = result.filter((item) => item.loadcaseValues?.length > 0);
    if (haveRelubInterval) {
      res.push(resultObj);
    }

    return res;
  }
);

export const getRatingLifeResultReport = createSelector(
  catalogCalculationResult,
  (calculationResult) => {
    const result: LoadcaseResultCombinedItem[] = Object.entries(
      calculationResult?.bearingBehaviour || {}
    )
      .filter(
        ([key, _value]) =>
          !lubricationBearingBehaviourItems.some((item) => item.key === key)
      )
      .map(([key, value]) => ({
        ...value,
        short:
          [...BEARING_BEHAVIOUR_ABBREVIATIONS_KEY_MAPPING].find(
            ([_abbreviation, matchKey]) => matchKey === key
          )?.[0] ?? key,
        title: key.toLowerCase(),
      }));

    if (calculationResult?.loadcaseFactorsAndEquivalentLoads) {
      result.push(
        ...Object.entries(
          calculationResult.loadcaseFactorsAndEquivalentLoads?.[0] || {}
        )
          .map(([_key, item]) => ({ ...item }))
          .map((item) => ({
            loadcaseValues: combineLoadcaseResultItemValuesByKey(
              calculationResult.loadcaseFactorsAndEquivalentLoads,
              item.title
            ),
            warning: item.warning,
            unit: item.unit,
            title: item.title,
            short: item.short,
          }))
      );
    }

    return result.filter(
      (item) =>
        item.value !== undefined ||
        item.loadcaseValues?.length > 0 ||
        ((item.value === undefined || item.loadcaseValues?.length < 1) &&
          item.warning)
    );
  }
);

export const getOverrollingFrequencies = createSelector(
  catalogCalculationResult,
  (calculationResult) => {
    const result: LoadcaseResultCombinedItem[] = Object.entries(
      calculationResult?.loadcaseOverrollingFrequencies?.[0] || {}
    )
      .map(([_key, item]) => ({ ...item }))
      .map((item) => ({
        loadcaseValues: combineLoadcaseResultItemValuesByKey(
          calculationResult.loadcaseOverrollingFrequencies,
          item.title
        ),
        warning: item.warning,
        unit: item.unit,
        title: item.title,
        short: item.short,
      }));

    if (!calculationResult) {
      return result;
    }

    return result.filter(
      (overrollingField) => overrollingField.title !== undefined
    );
  }
);

export const isOverrolingFrequenciesAvailable = createSelector(
  getOverrollingFrequencies,
  isCatalogCalculationResultAvailable,
  (overrrollingFields, isAvailable) =>
    isAvailable && overrrollingFields?.length > 0
);

/** gets selected calculation with response availability, can be data or error both are responses.*/
export const getSelectedCalculations = createSelector(
  getCalculationTypesConfig,
  isCatalogCalculationResultAvailable,
  isEmissionResultAvailable,
  (
    config,
    isCatalogApiResponseAvailable,
    emissionResultAvailable
  ): CalculationResultReportCalculationTypeSelection => {
    const responseAvailableMapping: Record<CalculationType, boolean> = {
      ratingLife: isCatalogApiResponseAvailable,
      lubrication: isCatalogApiResponseAvailable,
      frictionalPowerloss: isCatalogApiResponseAvailable,
      emission: emissionResultAvailable,
      overrollingFrequency: isCatalogApiResponseAvailable,
    };

    return config
      .map((item) => ({
        ...item,
        resultAvailable: responseAvailableMapping[item.name],
      }))
      .filter((item) => item.selected);
  }
);

export const getResultInput = createSelector(
  catalogCalculationResult,
  isCatalogCalculationResultAvailable,
  getDownstreamCalculationStateInputs,
  getSelectedCalculations,
  (
    catalog,
    isAvailable,
    downstream,
    selectedCalculations
  ): CalculationResultReportInput[] => {
    // This is a fix to hide bearing clearance group since it does not actually affect the calculation but could lead to confusion
    // among users. The fix should be the responsibility of the backend, but due to this response being part of the bearinx calculation core
    // fixing this takes a bit longer. This frontend fix should be removed once the proper backend fix is available
    const filteredDesignation = new Set(['Clearance group', 'Lagerluftklasse']);

    const catalogCalculationTypes = new Set<CalculationType>([
      'ratingLife',
      'lubrication',
      'overrollingFrequency',
    ]);
    const downstreamCalcultionTypes = new Set<CalculationType>([
      'emission',
      'frictionalPowerloss',
    ]);

    const selectedCalculationNames = selectedCalculations.map(
      (selected) => selected.name
    );

    const isCatalogCalculation = selectedCalculationNames.some((calculation) =>
      catalogCalculationTypes.has(calculation)
    );

    const isDownstreamCalculation =
      downstream &&
      selectedCalculationNames.some((calculation) =>
        downstreamCalcultionTypes.has(calculation)
      );

    if (!isAvailable) {
      return undefined;
    }

    const filteredInputValues =
      catalog?.reportInputSuborinates.inputSubordinates.map((item) => {
        if (!item.subItems || item.subItems.length === 0) {
          return item;
        }

        const returnItem = { ...item };
        returnItem.subItems = item.subItems.filter(
          (subitem) => !filteredDesignation.has(subitem.designation)
        );

        return returnItem;
      });

    if (isCatalogCalculation && isDownstreamCalculation) {
      const otherSectionKey = 'STRING_OUTP_MISCELLANEOUS_DATA';

      const otherConditions = filteredInputValues.find(
        (item) => item.titleID === otherSectionKey
      );
      const downstreamInputs: CalculationResultReportInput[] =
        downstream.operatingConditions.downstreamConditions.map(
          (condition) => ({
            ...condition,
            hasNestedStructure: false,
          })
        );
      otherConditions.subItems.push(...downstreamInputs);

      return filteredInputValues;
    }

    if (isDownstreamCalculation) {
      const downstreamInputs: CalculationResultReportInput[] = [];

      downstreamInputs.push(
        downstream.bearing,
        {
          ...downstream.operatingConditions,

          subItems: [
            ...downstream.operatingConditions.baseConditions,
            ...downstream.operatingConditions.downstreamConditions,
          ],
        },
        {
          title: downstream.load.title,
          hasNestedStructure: downstream.load.hasNestedStructure,
          subItems: downstream.load.loadCases,
        }
      );

      return downstreamInputs;
    }

    return filteredInputValues;
  }
);

export const getReportErrors = createSelector(
  catalogCalculationResult,
  (friction): string[] => friction?.reportMessages.errors ?? []
);

export const getReportDownstreamErrors = createSelector(
  getDownstreamErrors,
  (errors): string[] => errors
);

export const getAllErrors = createSelector(
  getReportErrors,
  getReportDownstreamErrors,
  (catalogErrors, downstreamErrors): string[] => [
    ...catalogErrors,
    ...downstreamErrors,
  ]
);

export const getReportWarnings = createSelector(
  catalogCalculationResult,
  (friction): string[] => friction?.reportMessages.warnings ?? []
);

export const getReportNotes = createSelector(
  catalogCalculationResult,
  (friction): string[] => friction?.reportMessages.notes ?? []
);

export const isFrictionResultAvailable = createSelector(
  isDownstreamResultAvailable,
  (isAvailable): boolean => isAvailable // special case, we show this item always so we can display a hint
);

export const isLubricationResultAvailable = createSelector(
  getLubricationReport,
  isCatalogCalculationResultAvailable,
  (report, isAvailable): boolean => isAvailable && report?.length > 0
);

export const isRatingLifeResultAvailable = createSelector(
  getRatingLifeResultReport,
  isCatalogCalculationResultAvailable,
  (report, isAvailable): boolean => isAvailable && report?.length > 0
);

export const getCalculationsTypes = createSelector(
  getCalculationTypesConfig,
  isLubricationResultAvailable,
  isEmissionResultAvailable,
  isFrictionResultAvailable,
  isOverrolingFrequenciesAvailable,
  isRatingLifeResultAvailable,
  (
    config,
    lubricationResultAvailable,
    emissionResultAvailable,
    frictionResultAvailable,
    overrollingFreqAvailable,
    ratingLifeResultAvailable
  ): CalculationResultReportCalculationTypeSelection => {
    const resultAvailableMapping: Record<CalculationType, boolean> = {
      ratingLife: ratingLifeResultAvailable,
      lubrication: lubricationResultAvailable,
      frictionalPowerloss: frictionResultAvailable,
      emission: emissionResultAvailable,
      overrollingFrequency: overrollingFreqAvailable,
    };

    return config.map((item) => ({
      ...item,
      resultAvailable: resultAvailableMapping[item.name],
    }));
  }
);

export const getCalculationsWithResult = createSelector(
  getCalculationsTypes,
  (calculationTypes): CalculationResultReportCalculationTypeSelection =>
    calculationTypes.filter((item) => item.resultAvailable)
);

export const pdfReportAvailable = createSelector(
  getSelectedCalculations,
  (selectedCalculations): boolean =>
    selectedCalculations.some((calculation) => calculation.selected)
);
