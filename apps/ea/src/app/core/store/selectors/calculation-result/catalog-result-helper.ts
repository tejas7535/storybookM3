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
  let tfR_min;
  let tfR_max;
  let title;
  let value;
  let short;

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
      if (resultItem.key === 'lowerGuideIntervalServiceLife') {
        tfG_min = Number.parseFloat(extractNumber(resultItem.value.value));
      }

      if (resultItem.key === 'upperGuideIntervalServiceLife') {
        tfG_max = Number.parseFloat(extractNumber(resultItem.value.value));
      }

      if (resultItem.key === 'lowerGuideIntervalRelubrication') {
        tfR_min = Number.parseFloat(extractNumber(resultItem.value.value));
      }

      if (resultItem.key === 'upperGuideIntervalRelubrication') {
        tfR_max = Number.parseFloat(extractNumber(resultItem.value.value));
      }
    });

  if (tfG_max && tfG_min) {
    title = 'guideIntervalServiceLife';
    value = Math.floor((tfG_min + tfG_max) / 2);
    short = 'tfG';
  }
  if (tfR_max && tfR_min) {
    title = 'guideIntervalRelubrication';
    value = Math.floor((tfR_min + tfR_max) / 2);
    short = 'tfR';
  }

  if ((tfG_max && tfG_min) || (tfR_max && tfR_min)) {
    return [
      true,
      {
        unit: 'h',
        value: `~ ${value}`,
        short,
        title,
      },
    ];
  }

  return [false, undefined];
};
