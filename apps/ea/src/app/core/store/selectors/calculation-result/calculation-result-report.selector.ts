import { createSelector } from '@ngrx/store';

import { CalculationType } from '../../models';
import { CalculationResultReportCalculationTypeSelection } from '../../models/calculation-result-report.model';
import { getCalculationTypesConfig } from '../calculation-parameters/calculation-types.selector';
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
      value: number;
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

export const isFrictionResultAvailable = createSelector(
  getFrictionalalPowerlossReport,
  (powerlossReport): boolean => powerlossReport?.length > 0
);

export const getSelectedCalculations = createSelector(
  getCalculationTypesConfig,
  isEmissionResultAvailable,
  isFrictionResultAvailable,
  (
    config,
    emissionResultAvailable,
    frictionResultAvailable
  ): CalculationResultReportCalculationTypeSelection => {
    const resultAvailableMapping: Record<CalculationType, boolean> = {
      emission: emissionResultAvailable,
      frictionalPowerloss: frictionResultAvailable,
      lubrication: false,
      overrollingFrequencies: false,
      ratingLife: false,
    };

    return config
      .map((item) => ({
        ...item,
        resultAvailable: resultAvailableMapping[item.name],
      }))
      .filter((item) => item.resultAvailable);
  }
);
