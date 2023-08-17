import { combineLatest, map, Observable } from 'rxjs';

import { CalculationParametersOperationConditions } from '@ea/core/store/models';
import { TranslocoService } from '@ngneat/transloco';

export const getTypeOfMotion = (
  translocoService: TranslocoService,
  availableOptions: {
    value: CalculationParametersOperationConditions['rotation']['typeOfMotion'];
  }[]
): Observable<
  {
    label: string;
    value: CalculationParametersOperationConditions['rotation']['typeOfMotion'];
  }[]
> =>
  combineLatest([
    ...availableOptions.map(({ value }) =>
      translocoService
        .selectTranslate(
          `operationConditions.rotatingCondition.options.${value}`
        )
        .pipe(map((label) => ({ label, value })))
    ),
  ]);
