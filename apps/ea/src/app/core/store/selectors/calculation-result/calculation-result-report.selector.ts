import { createSelector } from '@ngrx/store';

import { CalculationResultReportInput, CalculationType } from '../../models';
import { CalculationResultReportCalculationTypeSelection } from '../../models/calculation-result-report.model';
import { CalculationResultReportMessage } from '../../models/calculation-result-report-message.model';
import { getCalculationTypesConfig } from '../calculation-parameters/calculation-types.selector';
import { getCalculationResult } from './catalog-calculation-result.selector';
import { getCalculationResult as co2UpstreamCalculationResult } from './co2-upstream-calculation-result.selector';
import { getCalculationResult as frictionCalculationResult } from './friction-calculation-result.selector';

export interface CO2EmissionResult {
  co2_upstream: number;
  co2_downstream: number;
  co2_upstream_percent: number;
  co2_downstream_percent: number;
}

export const getCO2EmissionReport = createSelector(
  co2UpstreamCalculationResult,
  frictionCalculationResult,
  (co2Upstream, friction): CO2EmissionResult => {
    const totalEmission =
      co2Upstream?.upstreamEmissionTotal + friction?.co2_downstream?.value;

    return {
      co2_upstream: co2Upstream?.upstreamEmissionTotal,
      co2_downstream: friction?.co2_downstream?.value,
      co2_upstream_percent: co2Upstream?.upstreamEmissionTotal / totalEmission,
      co2_downstream_percent: friction?.co2_downstream?.value / totalEmission,
    };
  }
);

export const isEmissionResultAvailable = createSelector(
  getCO2EmissionReport,
  (co2Emission): boolean =>
    !!co2Emission?.co2_downstream || !!co2Emission?.co2_upstream
);

export const getFrictionalalPowerlossReport = createSelector(
  frictionCalculationResult,
  (friction) => {
    const result: {
      value?: number | string;
      warning?: string;
      unit: string;
      title: string;
      short: string;
    }[] = [
      {
        ...friction?.frictionalTorque,
        short: 'MR',
        title: 'frictionalTorque',
      },
      {
        ...friction?.frictionalPowerloss,
        short: 'NR',
        title: 'frictionalPowerloss',
      },
      {
        ...friction?.frictionalPowerlossSealing,
        short: 'NSe',
        title: 'frictionalPowerlossSealing',
      },
      {
        ...friction?.frictionalPowerlossUnloadedZone,
        short: 'NUz',
        title: 'frictionalPowerlossUnloadedZone',
      },
      {
        ...friction?.operatingViscosity,
        short: 'ny',
        title: 'operatingViscosity',
      },
    ];

    return result.filter((item) => item.value !== undefined);
  }
);

export const getRatingLifeResultReport = createSelector(
  getCalculationResult,
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

export const getResultInput = createSelector(
  frictionCalculationResult,
  (friction): CalculationResultReportInput[] =>
    friction?.reportInputSuborinates.inputSubordinates.map((subordinate) => ({
      ...subordinate,
    }))
);

export const getReportMessages = createSelector(
  frictionCalculationResult,
  (friction): CalculationResultReportMessage[] =>
    friction?.reportMessages?.messages
);

export const isFrictionResultAvailable = createSelector(
  getFrictionalalPowerlossReport,
  (report): boolean => report?.length > 0
);

export const isRatingLifeResultAvailable = createSelector(
  getRatingLifeResultReport,
  (report): boolean => report?.length > 0
);

export const getSelectedCalculations = createSelector(
  getCalculationTypesConfig,
  isEmissionResultAvailable,
  isFrictionResultAvailable,
  isRatingLifeResultAvailable,
  (
    config,
    emissionResultAvailable,
    frictionResultAvailable,
    ratingLifeResultAvailable
  ): CalculationResultReportCalculationTypeSelection => {
    const resultAvailableMapping: Record<CalculationType, boolean> = {
      emission: emissionResultAvailable,
      frictionalPowerloss: frictionResultAvailable,
      lubrication: false,
      overrollingFrequency: false,
      ratingLife: ratingLifeResultAvailable,
    };

    return config
      .map((item) => ({
        ...item,
        resultAvailable: resultAvailableMapping[item.name],
      }))
      .filter((item) => item.resultAvailable);
  }
);
