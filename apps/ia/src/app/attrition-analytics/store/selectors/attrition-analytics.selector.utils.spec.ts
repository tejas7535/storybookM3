import { FeatureSelector } from '../../models/feature-selector.model';
import {
  createAgeFeature,
  createBarchartConfigForAge,
  createDummyBarChartSerie,
  createDummyFeature,
} from './attrition-analytics.selector.spec.factory';
import {
  mapEmployeeAnalyticsFeatureToBarChartConfig,
  mapToFeatureSelectors,
} from './attrition-analytics.selector.utils';

describe('attrition analytics selector utils', () => {
  describe('mapEmployeeAnalyticsFeatureToBarChartConfig', () => {
    test('should map employee analytics feature to bar chart config', () => {
      const feature = createAgeFeature();
      const color = '#000';
      const serie = createDummyBarChartSerie(color);
      const expectedResult = createBarchartConfigForAge(serie);

      const result = mapEmployeeAnalyticsFeatureToBarChartConfig(
        [feature],
        0.45,
        color
      );

      expect(result).toEqual(expectedResult);
    });

    test('should map multpile employee analytics features to bar chart config', () => {
      const ageFeature = createAgeFeature();
      const positionFeature = createDummyFeature('Position');
      const color = '#000';

      const result = mapEmployeeAnalyticsFeatureToBarChartConfig(
        [ageFeature, positionFeature],
        0.5,
        color
      );

      expect(result.series.length).toEqual(1);
      expect(result.series[0].values.length).toEqual(6);
    });
  });
});

describe('mapToFeatureSelectors', () => {
  test('should map features to features selectors', () => {
    const ageFeature = 'Age';
    const positionFeature = 'Position';
    const genderFeature = 'Gender';
    const familyFeature = 'Family';

    const all = [ageFeature, positionFeature, genderFeature, familyFeature];
    const selected = [positionFeature, familyFeature];

    const expectedResult = [
      new FeatureSelector(ageFeature, false),
      new FeatureSelector(genderFeature, false),
      new FeatureSelector(positionFeature, true),
      new FeatureSelector(familyFeature, true),
    ];

    const result = mapToFeatureSelectors(all, selected);

    expect(result).toEqual(expectedResult);
  });

  test('should return all feature selectors when selected undefined', () => {
    const ageFeature = 'Age';
    const positionFeature = 'Position';
    const genderFeature = 'Gender';
    const familyFeature = 'Family';

    const all = [ageFeature, positionFeature, genderFeature, familyFeature];

    const expectedResult = [
      new FeatureSelector(ageFeature, false),
      new FeatureSelector(positionFeature, false),
      new FeatureSelector(genderFeature, false),
      new FeatureSelector(familyFeature, false),
    ];

    const result = mapToFeatureSelectors(all, undefined as string[]);

    expect(result).toEqual(expectedResult);
  });
});
