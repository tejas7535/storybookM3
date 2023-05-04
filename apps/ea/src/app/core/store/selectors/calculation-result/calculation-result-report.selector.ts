import { meaningfulRound } from '@ea/shared/helper';
import { createSelector } from '@ngrx/store';

import { CalculationParametersCalculationTypes } from '../../models';
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
      co2_upstream: meaningfulRound(co2Upstream?.upstreamEmissionTotal),
      co2_downstream: meaningfulRound(friction?.co2_downstream?.value),
      co2_upstream_percent: co2Upstream?.upstreamEmissionTotal / totalEmission,
      co2_downstream_percent: friction?.co2_downstream?.value / totalEmission,
    };
  }
);

const isEmissionResultAvailable = createSelector(
  getCO2EmissionReport,
  (co2Emission): boolean =>
    !!co2Emission?.co2_downstream || !!co2Emission?.co2_upstream
);

export const getSelectedCalculations = createSelector(
  getCalculationTypesConfig,
  isEmissionResultAvailable,
  (
    config,
    emissionResultAvailable
  ): CalculationResultReportCalculationTypeSelection => {
    const resultAvailableMapping: Record<
      keyof CalculationParametersCalculationTypes,
      boolean
    > = {
      emission: emissionResultAvailable,
      friction: false,
    };

    return config
      .map((item) => ({
        ...item,
        resultAvailable: resultAvailableMapping[item.name],
      }))
      .filter((item) => item.resultAvailable);
  }
);
