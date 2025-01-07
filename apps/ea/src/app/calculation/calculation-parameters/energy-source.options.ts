import { combineLatest, Observable } from 'rxjs';

import {
  ElectricityRegionOption,
  FossilOriginOption,
} from '@ea/core/services/calculation-parameters';
import {
  ELECTRICITY_REGION_VALUE_MAPPING,
  FOSSIL_FACTORS_VALUE_MAPPING,
} from '@ea/core/services/downstream-calcululation.service.constant';
import { createTranslationObservables } from '@ea/shared/helper';
import { TranslocoService } from '@jsverse/transloco';

export const getElectricityRegionOptions = (
  translocoService: TranslocoService
): Observable<ElectricityRegionOption[]> => {
  const baseKey = 'operationConditions.energySource.electricityRegionOption.';

  const countryOptions = [...ELECTRICITY_REGION_VALUE_MAPPING.entries()].map(
    ([key, value]) => ({
      key,
      value,
    })
  );

  const observables = createTranslationObservables(
    translocoService,
    baseKey,
    countryOptions
  );

  return combineLatest(observables);
};

export const getFossilOriginOptions = (
  translocoService: TranslocoService
): Observable<FossilOriginOption[]> => {
  const baseKey = 'operationConditions.energySource.fossilOriginOptions.';

  const fossilFactors = [...FOSSIL_FACTORS_VALUE_MAPPING.entries()].map(
    ([key, value]) => ({
      key,
      value,
    })
  );

  const observables = createTranslationObservables(
    translocoService,
    baseKey,
    fossilFactors
  );

  return combineLatest(observables);
};
