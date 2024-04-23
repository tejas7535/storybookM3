import { combineLatest, map, Observable } from 'rxjs';

import { CalculationParametersOperationConditions } from '@ea/core/store/models';
import { TranslocoService } from '@jsverse/transloco';

export const getEnvironmentalInfluenceOptions = (
  translocoService: TranslocoService
): Observable<
  {
    label: string;
    value: CalculationParametersOperationConditions['lubrication']['grease']['environmentalInfluence'];
  }[]
> =>
  combineLatest([
    translocoService
      .selectTranslate(
        'operationConditions.lubrication.grease.environmentalInfluence.options.lowInfluence'
      )
      .pipe(
        map((label) => ({ label, value: 'LB_LOW_AMBIENT_INFLUENCE' as const }))
      ),
    translocoService
      .selectTranslate(
        'operationConditions.lubrication.grease.environmentalInfluence.options.averageInfluence'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_AVERAGE_AMBIENT_INFLUENCE' as const,
        }))
      ),
    translocoService
      .selectTranslate(
        'operationConditions.lubrication.grease.environmentalInfluence.options.heavyInfluence'
      )
      .pipe(
        map((label) => ({ label, value: 'LB_HIGH_AMBIENT_INFLUENCE' as const }))
      ),
  ]);
