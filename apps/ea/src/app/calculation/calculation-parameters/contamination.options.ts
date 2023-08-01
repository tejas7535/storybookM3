import { combineLatest, map, Observable } from 'rxjs';

import { CalculationParametersOperationConditions } from '@ea/core/store/models';
import { TranslocoService } from '@ngneat/transloco';

export const getContaminationOptions = (
  translocoService: TranslocoService
): Observable<
  {
    label: string;
    value: CalculationParametersOperationConditions['contamination'];
  }[]
> =>
  combineLatest([
    translocoService
      .selectTranslate(
        'operationConditions.contamination.options.extremeCleanliness'
      )
      .pipe(
        map((label) => ({ label, value: 'LB_EXTREM_CLEANLINESS' as const }))
      ),
    translocoService
      .selectTranslate(
        'operationConditions.contamination.options.highCleanliness'
      )
      .pipe(map((label) => ({ label, value: 'LB_HIGH_CLEANLINESS' as const }))),
    translocoService
      .selectTranslate(
        'operationConditions.contamination.options.standardCleanliness'
      )
      .pipe(
        map((label) => ({ label, value: 'LB_STANDARD_CLEANLINESS' as const }))
      ),
    translocoService
      .selectTranslate(
        'operationConditions.contamination.options.slightContamination'
      )
      .pipe(
        map((label) => ({ label, value: 'LB_SLIGHT_CONTAMINATION' as const }))
      ),
    translocoService
      .selectTranslate(
        'operationConditions.contamination.options.typicalContamination'
      )
      .pipe(
        map((label) => ({ label, value: 'LB_TYPICAL_CONTAMINATION' as const }))
      ),
    translocoService
      .selectTranslate(
        'operationConditions.contamination.options.heavyContamination'
      )
      .pipe(
        map((label) => ({ label, value: 'LB_HEAVY_CONTAMINATION' as const }))
      ),
    translocoService
      .selectTranslate(
        'operationConditions.contamination.options.veryHeavyContamination'
      )
      .pipe(
        map((label) => ({
          label,
          value: 'LB_VERY_HEAVY_CONTAMINATION' as const,
        }))
      ),
  ]);
