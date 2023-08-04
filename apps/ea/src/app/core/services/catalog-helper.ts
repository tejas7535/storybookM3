import { CatalogCalculationResult } from '../store/models';
import { extractSubordinatesFromPath } from './bearinx-helper';
import { BearinxOnlineResult } from './bearinx-result.interface';

export const convertCatalogCalculationResult = (
  originalResult: BearinxOnlineResult
): CatalogCalculationResult => {
  const result: CatalogCalculationResult = {};

  const bearingBeahiourSubordinate = extractSubordinatesFromPath(
    originalResult,
    [
      { titleID: 'STRING_OUTP_RESULTS', identifier: 'block' },
      { titleID: 'STRING_OUTP_BEARING_BEHAVIOUR', identifier: 'variableBlock' },
    ]
  );

  if (!bearingBeahiourSubordinate) {
    return result;
  }

  const ratingLifeSubordinate = extractSubordinatesFromPath(
    bearingBeahiourSubordinate,
    [{ abbreviation: 'Lh10' }]
  );
  if (ratingLifeSubordinate) {
    result.lh10 = {
      unit: ratingLifeSubordinate.unit,
      value: ratingLifeSubordinate.value,
    };
  }

  const modifiedRatingLifeSubordinate = extractSubordinatesFromPath(
    bearingBeahiourSubordinate,
    [{ abbreviation: 'Lh_nm' }]
  );
  if (modifiedRatingLifeSubordinate) {
    result.lh_nm = {
      unit: modifiedRatingLifeSubordinate.unit,
      value: modifiedRatingLifeSubordinate.value,
    };
  }

  const dynamicLoadSubordinate = extractSubordinatesFromPath(
    bearingBeahiourSubordinate,
    [{ abbreviation: 'P' }]
  );
  if (dynamicLoadSubordinate) {
    result.p = {
      unit: dynamicLoadSubordinate.unit,
      value: dynamicLoadSubordinate.value,
    };
  }

  const speedSubordinate = extractSubordinatesFromPath(
    bearingBeahiourSubordinate,
    [{ abbreviation: 'n' }]
  );
  if (speedSubordinate) {
    result.n = {
      unit: speedSubordinate.unit,
      value: speedSubordinate.value,
    };
  }

  const staticSafetySubordinate = extractSubordinatesFromPath(
    bearingBeahiourSubordinate,
    [{ abbreviation: 'S0_min' }]
  );
  if (staticSafetySubordinate) {
    result.S0_min = {
      unit: staticSafetySubordinate.unit,
      value: staticSafetySubordinate.value,
    };
  }

  const maximumStaticLoadSuboardinate = extractSubordinatesFromPath(
    bearingBeahiourSubordinate,
    [{ abbreviation: 'P0_max' }]
  );
  if (maximumStaticLoadSuboardinate) {
    result.P0_max = {
      unit: maximumStaticLoadSuboardinate.unit,
      value: maximumStaticLoadSuboardinate.value,
    };
  }

  const basicOverrollingFrequenciesSubordinate = extractSubordinatesFromPath(
    originalResult,
    [
      { titleID: 'STRING_OUTP_RESULTS', identifier: 'block' },
      {
        titleID: 'STRING_OUTP_ROLLOVER_FREQUENCIES',
        identifier: 'variableBlock',
      },
    ]
  );

  const overrollingOuterRing = extractSubordinatesFromPath(
    basicOverrollingFrequenciesSubordinate,
    [{ abbreviation: 'BPFO' }]
  );
  if (overrollingOuterRing) {
    result.BPFO = {
      unit: overrollingOuterRing.unit,
      value: overrollingOuterRing.value,
    };
  }

  const overrollingInnerRing = extractSubordinatesFromPath(
    basicOverrollingFrequenciesSubordinate,
    [
      {
        abbreviation: 'BPFI',
      },
    ]
  );
  if (overrollingInnerRing) {
    result.BPFI = {
      unit: overrollingInnerRing.unit,
      value: overrollingInnerRing.value,
    };
  }

  const overrollingRollingElement = extractSubordinatesFromPath(
    basicOverrollingFrequenciesSubordinate,
    [
      {
        abbreviation: 'BSF',
      },
    ]
  );
  if (overrollingRollingElement) {
    result.BSF = {
      value: overrollingRollingElement.value,
      unit: overrollingRollingElement.unit,
    };
  }

  const ringPassFrequency = extractSubordinatesFromPath(
    basicOverrollingFrequenciesSubordinate,
    [
      {
        abbreviation: 'RPFB',
      },
    ]
  );
  if (ringPassFrequency) {
    result.RPFB = {
      value: ringPassFrequency.value,
      unit: ringPassFrequency.unit,
    };
  }

  const rollingElementSetSpeed = extractSubordinatesFromPath(
    basicOverrollingFrequenciesSubordinate,
    [
      {
        abbreviation: 'FTF',
      },
    ]
  );

  if (rollingElementSetSpeed) {
    result.FTF = {
      value: rollingElementSetSpeed.value,
      unit: rollingElementSetSpeed.unit,
    };
  }

  return result;
};
