import { EmployeeAnalytics, FeatureParams } from '../../models';
import {
  didFeaturesChange,
  sortFeaturesBasedOnParams,
} from './attrition-analytics.effects.utils';

describe('AttritionAnalyticsEffectsUtils', () => {
  const ageFeatureParams: FeatureParams = {
    feature: 'Age',
    region: 'USA',
    year: 2021,
    month: 3,
  };
  const positionFeatureParams: FeatureParams = {
    feature: 'Position',
    region: 'USA',
    year: 2021,
    month: 3,
  };

  describe('didFeatureChange', () => {
    test('should return true with features params when features diffrent', () => {
      const featuresParams: FeatureParams[] = [ageFeatureParams];
      const currentSelected: EmployeeAnalytics[] = [
        positionFeatureParams as EmployeeAnalytics,
      ];

      const result = didFeaturesChange(featuresParams, currentSelected);

      expect(result.didChange).toBeTruthy();
      expect(result.features).toBe(featuresParams);
    });

    test('should return true with features params when length of features and params different', () => {
      const featuresParams: FeatureParams[] = [ageFeatureParams];
      const currentSelected: EmployeeAnalytics[] = [
        positionFeatureParams as EmployeeAnalytics,
        ageFeatureParams as EmployeeAnalytics,
      ];

      const result = didFeaturesChange(featuresParams, currentSelected);

      expect(result.didChange).toBeTruthy();
      expect(result.features).toBe(featuresParams);
    });

    test('should return false with features params when equal features in equal order', () => {
      const featuresParams: FeatureParams[] = [
        ageFeatureParams,
        positionFeatureParams,
      ];
      const currentSelected: EmployeeAnalytics[] = [
        ageFeatureParams as EmployeeAnalytics,
        positionFeatureParams as EmployeeAnalytics,
      ];

      const result = didFeaturesChange(featuresParams, currentSelected);

      expect(result.didChange).toBeFalsy();
      expect(result.features).toBe(featuresParams);
    });

    test('should return false with features params when equal features in different order', () => {
      const featuresParams: FeatureParams[] = [
        positionFeatureParams,
        ageFeatureParams,
      ];
      const currentSelected: EmployeeAnalytics[] = [
        ageFeatureParams as EmployeeAnalytics,
        positionFeatureParams as EmployeeAnalytics,
      ];

      const result = didFeaturesChange(featuresParams, currentSelected);

      expect(result.didChange).toBeFalsy();
      expect(result.features).toBe(featuresParams);
    });
  });

  describe('sortFeaturesBasingOnParams', () => {
    test('should sort features basing on features params', () => {
      const features: EmployeeAnalytics[] = [
        ageFeatureParams as EmployeeAnalytics,
        positionFeatureParams as EmployeeAnalytics,
      ];

      const featuresParams: FeatureParams[] = [
        positionFeatureParams,
        ageFeatureParams,
      ];

      const result = sortFeaturesBasedOnParams(features, featuresParams);

      expect(result).toEqual([features[1], features[0]]);
    });
  });
});
