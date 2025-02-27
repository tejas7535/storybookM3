import { translate } from '@jsverse/transloco';

import { Lubricator } from '../models';

export type LubricatorType = 'minimum' | 'recommended';

export type RecommendationTableRowConfiguration =
  | {
      type: 'technical';
      fieldName: keyof Lubricator['technicalAttributes'];
    }
  | {
      type: 'composite';
      fieldName: string;
      formatFunction: (device: Lubricator, which: LubricatorType) => string;
    }
  | keyof Lubricator;

type RecommendationTableConfiguration = RecommendationTableRowConfiguration[];

export const recommendationTableConfiguration: RecommendationTableConfiguration =
  [
    {
      type: 'technical',
      fieldName: 'func_principle',
    },
    {
      type: 'technical',
      fieldName: 'dimensions',
    },
    'volume',
    'maxOperatingPressure',
    {
      type: 'technical',
      fieldName: 'voltage',
    },
    {
      type: 'technical',
      fieldName: 'medium_general',
    },
    {
      type: 'composite',
      fieldName: 'tempRange',
      formatFunction: (lub: Lubricator) =>
        translate(`recommendation.result.tempRangeValues`, {
          min: lub.minTemp,
          max: lub.maxTemp,
        }),
    },
    'noOfOutlets',
    {
      type: 'technical',
      fieldName: 'mounting_position',
    },
    'isOptime',
  ];
