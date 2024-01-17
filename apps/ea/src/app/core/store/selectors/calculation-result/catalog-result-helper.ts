import { extractNumber } from '@ea/shared/helper';

import {
  BearingBehaviour,
  CatalogCalculationResult,
  lubricationBearingBehaviourItems,
} from '../../models';
import { LoadcaseResultCombinedItem } from '../../models/calculation-result-report.model';

export const getLubricationDataFromBehavior = (
  result: CatalogCalculationResult
): [boolean, LoadcaseResultCombinedItem?] => {
  const bearingBehavior = result.bearingBehaviour || {};

  let tfG_min;
  let tfG_max;

  lubricationBearingBehaviourItems
    .map((item) => ({
      ...item,
      value:
        (item.key as keyof BearingBehaviour) in bearingBehavior
          ? bearingBehavior[item.key as keyof BearingBehaviour]
          : undefined,
    }))
    .filter((item) => item.value)
    .forEach((resultItem) => {
      if (resultItem.key === 'lowerGuideInterval') {
        tfG_min = Number.parseFloat(extractNumber(resultItem.value.value));
      }

      if (resultItem.key === 'upperGuideInterval') {
        tfG_max = Number.parseFloat(extractNumber(resultItem.value.value));
      }
    });

  if (tfG_max && tfG_min) {
    return [
      true,
      {
        unit: 'h',
        short: 'tfG',
        title: 'relubGuideInterval',
        value: `~ ${Math.floor((tfG_min + tfG_max) / 2)}`,
      },
    ];
  }

  return [false, undefined];
};
