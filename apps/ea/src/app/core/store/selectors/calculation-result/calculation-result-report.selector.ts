import { createSelector } from '@ngrx/store';

import {
  CalculationResultReportInput,
  CalculationType,
  OverrollingFrequencyKeys,
} from '../../models';
import { CalculationResultReportCalculationTypeSelection } from '../../models/calculation-result-report.model';
import { CalculationResultReportMessage } from '../../models/calculation-result-report-message.model';
import { getCalculationTypesConfig } from '../calculation-parameters/calculation-types.selector';
import {
  getCalculationResult as catalogCalculationResult,
  isCalculationResultAvailable as isCatalogCalculationResultAvailable,
} from './catalog-calculation-result.selector';
import { getCalculationResult as co2UpstreamCalculationResult } from './co2-upstream-calculation-result.selector';

export interface CO2EmissionResult {
  co2_upstream: number;
  co2_downstream?: number;
}

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
    const result: {
      value?: number | string;
      warning?: string;
      unit: string;
      title: string;
      short: string;
    }[] = [
      {
        ...calculationResult?.totalFrictionalTorque,
        short: 'MR',
        title: 'totalFrictionalTorque',
      },
      {
        ...calculationResult?.totalFrictionalPowerLoss,
        short: 'NR',
        title: 'totalFrictionalPowerLoss',
      },
      {
        ...calculationResult?.speedDependentFrictionalTorque,
        short: 'M0',
        title: 'speedDependentFrictionalTorque',
      },
      {
        ...calculationResult?.loadDependentFrictionalTorque,
        short: 'M1',
        title: 'loadDependentFrictionalTorque',
      },
      {
        ...calculationResult?.thermallySafeOperatingSpeed,
        short: 'n_theta',
        title: 'thermallySafeOperatingSpeed',
      },
    ];

    const resultItems = result.filter((item) => item.value !== undefined);
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
    const result: {
      value?: number | string;
      warning?: string;
      unit: string;
      title: string;
      short: string;
    }[] = [
      {
        ...calculationResult?.viscosityRatio,
        short: 'kappa',
        title: 'viscosityRatio',
      },
      {
        ...calculationResult?.operatingViscosity,
        short: 'ny',
        title: 'operatingViscosity',
      },
      {
        ...calculationResult?.referenceViscosity,
        short: 'ny1',
        title: 'referenceViscosity',
      },
      {
        ...calculationResult?.lifeAdjustmentFactor,
        short: 'a_ISO',
        title: 'lifeAdjustmentFactor',
      },
      {
        ...calculationResult?.lowerGuideInterval,
        short: 'tfR_min',
        title: 'lowerGuideInterval',
      },
      {
        ...calculationResult?.upperGuideInterval,
        short: 'tfR_max',
        title: 'upperGuideInterval',
      },
    ];

    return result.filter((item) => item.value !== undefined);
  }
);

export const getRatingLifeResultReport = createSelector(
  catalogCalculationResult,
  (calculationResult) => {
    const result: {
      value: number | string;
      unit: string;
      title: string;
      short: string;
      warning?: string;
    }[] = [
      {
        ...calculationResult?.lh10,
        short: 'Lh10',
        title: 'lh10',
      },
      {
        ...calculationResult?.lh_nm,
        // warning: 'lh_nm_unavailable', // show warning if result could not be calculated
        short: 'Lh_nm',
        title: 'lh_nm',
      },
      {
        ...calculationResult?.p,
        short: 'P',
        title: 'p',
      },
      {
        ...calculationResult?.n,
        short: 'n',
        title: 'n',
      },
      {
        ...calculationResult?.S0_min,
        short: 'SO_min',
        title: 's0_min',
      },
      {
        ...calculationResult?.P0_max,
        short: 'P0_max',
        title: 'p0_max',
      },
    ];

    return result.filter(
      (item) =>
        item.value !== undefined || (item.value === undefined && item.warning)
    );
  }
);

export const getOverrollingFrequencies = createSelector(
  catalogCalculationResult,
  (calculationResult) => {
    const result: {
      value: number | string;
      unit: string;
      title: string;
      short: string;
      warning?: string;
    }[] = [];

    if (!calculationResult) {
      return result;
    }
    for (const [key, value] of Object.entries(calculationResult)) {
      if (!OverrollingFrequencyKeys.includes(key)) {
        continue;
      }
      result.push({
        ...value,
        short: key,
        title: key,
      });
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
