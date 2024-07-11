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
    'maxOperatingPressure',
    'volume',
    {
      type: 'composite',
      fieldName: 'tempRange',
      formatFunction: (lub: Lubricator) => `${lub.minTemp} - ${lub.maxTemp}°C`,
    },
    {
      type: 'technical',
      fieldName: 'mounting_position',
    },
    {
      type: 'technical',
      fieldName: 'func_principle',
    },
  ];
