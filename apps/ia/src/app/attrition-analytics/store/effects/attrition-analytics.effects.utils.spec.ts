import { EmployeeAnalytics, FeatureParams } from '../../models';
import { sortFeaturesBasedOnParams } from './attrition-analytics.effects.utils';

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
