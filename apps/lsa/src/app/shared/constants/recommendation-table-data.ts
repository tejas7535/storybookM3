import { translate } from '@jsverse/transloco';

import { Lubricator, MultiUnitValue } from '../models';
import { Unitset } from '../models/preferences.model';

export type LubricatorType = 'minimum' | 'recommended';

type CompositeFormatFn<T> = (
  device: Lubricator,
  which: LubricatorType,
  unitset: Unitset
) => T;

export type RecommendationTableRowConfiguration =
  | {
      type: 'technical';
      fieldName: keyof Lubricator['technicalAttributes'];
    }
  | {
      type: 'composite';
      fieldName: string;
      formatFunction: CompositeFormatFn<string>;
    }
  | {
      type: 'localized_composite';
      fieldName: string;
      formatFunction: CompositeFormatFn<MultiUnitValue>;
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
    {
      type: 'technical',
      fieldName: 'volume',
    },
    {
      type: 'technical',
      fieldName: 'pressure',
    },
    {
      type: 'technical',
      fieldName: 'voltage',
    },
    {
      type: 'technical',
      fieldName: 'medium_general',
    },
    {
      type: 'localized_composite',
      fieldName: 'tempRange',
      formatFunction: (lubricator: Lubricator, _type: string) => {
        const minMetric = (
          lubricator.technicalAttributes.temp_min as MultiUnitValue
        )['SI'];
        const maxMetric = (
          lubricator.technicalAttributes.temp_max as MultiUnitValue
        )['SI'];
        const SI = translate(`recommendation.result.tempRangeValues`, {
          min: minMetric,
          max: maxMetric,
          unit: '°C',
        });

        const minFPS = (
          lubricator.technicalAttributes.temp_min as MultiUnitValue
        )['FPS'];
        const maxFPS = (
          lubricator.technicalAttributes.temp_max as MultiUnitValue
        )['FPS'];
        const FPS = translate(`recommendation.result.tempRangeValues`, {
          min: minFPS,
          max: maxFPS,
          unit: '°F',
        });

        return {
          type: 'convertedDimension',
          FPS,
          SI,
        };
      },
    },
    'noOfOutlets',
    {
      type: 'technical',
      fieldName: 'mounting_position',
    },
    'isOptime',
  ];
