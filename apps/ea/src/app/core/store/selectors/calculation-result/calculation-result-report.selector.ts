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
import { CalculationResultReportMessage } from '../../models/calculation-result-report-message.model';
import { getCalculationTypesConfig } from '../calculation-parameters/calculation-types.selector';
import {
  getCalculationResult as catalogCalculationResult,
  isCalculationResultAvailable as isCatalogCalculationResultAvailable,
} from './catalog-calculation-result.selector';
import { getLubricationDataFromBehavior } from './catalog-result-helper';
import { getCalculationResult as co2UpstreamCalculationResult } from './co2-upstream-calculation-result.selector';

export interface CO2EmissionResult {
  co2_upstream: number;
  co2_downstream?: number;
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
  (co2Upstream): CO2EmissionResult => ({
    co2_upstream: co2Upstream?.upstreamEmissionTotal,
  })
);

export const isEmissionResultAvailable = createSelector(
  getCO2EmissionReport,
  (co2Emission): boolean =>
    !!co2Emission?.co2_downstream || !!co2Emission?.co2_upstream
);

export const getFrictionalalPowerlossReport = createSelector(
  catalogCalculationResult,
  (calculationResult) => {
    const result: LoadcaseResultCombinedItem[] =
      // taking first result for basic structure
      Object.entries(calculationResult?.loadcaseFriction?.[0] || {}).map(
        ([key, item]) => ({
          loadcaseValues: combineLoadcaseResultItemValuesByKey(
            calculationResult?.loadcaseFriction,
            key
          ),
          warning: item.warning,
          unit: item.unit,
          title: item.title,
          short: item.short,
        })
      );

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

export const getResultInput = createSelector(
  catalogCalculationResult,
  isCatalogCalculationResultAvailable,
  (catalog, isAvailable): CalculationResultReportInput[] => {
    // This is a fix to hide bearing clearance group since it does not actually affect the calculation but could lead to confusion
    // among users. The fix should be the responsibility of the backend, but due to this response being part of the bearinx calculation core
    // fixing this takes a bit longer. This frontend fix should be removed once the proper backend fix is available
    const filteredDesignation = new Set(['Clearance group', 'Lagerluftklasse']);

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

    return filteredInputValues;
  }
);

export const getReportMessages = createSelector(
  catalogCalculationResult,
  (friction): CalculationResultReportMessage[] =>
    friction?.reportMessages?.messages
);

export const isFrictionResultAvailable = createSelector(
  isCatalogCalculationResultAvailable,
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

export const pdfReportAvailable = createSelector(
  getSelectedCalculations,
  (selectedCalculations): boolean =>
    selectedCalculations.some((calculation) => calculation.selected)
);
