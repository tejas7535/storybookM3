import { CatalogCalculationResult } from '../store/models';
import { extractSubordinatesFromPath } from './bearinx-helper';
import { BearinxOnlineResult } from './bearinx-result.interface';

export const convertCatalogCalculationResult = (
  originalResult: BearinxOnlineResult
): CatalogCalculationResult => {
  const result: CatalogCalculationResult = {};

  const ratingLifeSubordinate = extractSubordinatesFromPath(originalResult, [
    { titleID: 'STRING_OUTP_RESULTS', identifier: 'block' },
    { titleID: 'STRING_OUTP_BEARING_BEHAVIOUR', identifier: 'variableBlock' },
    { abbreviation: 'Lh10' },
  ]);

  if (ratingLifeSubordinate) {
    result.lh10 = {
      unit: ratingLifeSubordinate.unit,
      value: ratingLifeSubordinate.value,
    };
  }

  return result;
};
