import { EmployeeAnalytics } from '../../models/employee-analytics.model';
import { FeatureParams } from '../../models/feature-params.model';
import { FeatureSelector } from '../../models/feature-selector.model';
import {
  createAgeFeature,
  createBarchartConfigForAge,
  createDummyBarChartSerie,
  createDummyFeature,
} from './attrition-analytics.selector.spec.factory';
import {
  doFeatureParamsMatchFeature,
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
        [{ ...feature }],
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
    const ageFeature = { feature: 'Age' } as FeatureParams;
    const positionFeature = { feature: 'Position' } as FeatureParams;
    const genderFeature = { feature: 'Gender' } as FeatureParams;
    const familyFeature = { feature: 'Family' } as FeatureParams;

    const all: FeatureParams[] = [
      ageFeature,
      positionFeature,
      genderFeature,
      familyFeature,
    ];
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
    const ageFeature = { feature: 'Age' } as FeatureParams;
    const positionFeature = { feature: 'Position' } as FeatureParams;
    const genderFeature = { feature: 'Gender' } as FeatureParams;
    const familyFeature = { feature: 'Family' } as FeatureParams;

    const all: FeatureParams[] = [
      ageFeature,
      positionFeature,
      genderFeature,
      familyFeature,
    ];

    const expectedResult = [
      new FeatureSelector(ageFeature, false),
      new FeatureSelector(positionFeature, false),
      new FeatureSelector(genderFeature, false),
      new FeatureSelector(familyFeature, false),
    ];

    const result = mapToFeatureSelectors(all, undefined as FeatureParams[]);

    expect(result).toEqual(expectedResult);
  });

  describe('isParamsRelatedToFeature', () => {
    let params: FeatureParams;
    let analyticsFeature: EmployeeAnalytics;

    beforeEach(() => {
      const feature = 'Service Length';
      const region = 'Texas';
      const year = 2021;
      const month = 1;

      params = {
        feature,
        region,
        year,
        month,
      };

      analyticsFeature = {
        feature,
        region,
        year,
        month,
        overallAttritionRate: 0.034,
        values: ['1', '2'],
        attritionCount: [2, 4],
        employeeCount: [20, 25],
      };
    });

    test('should return true when params related to feature', () => {
      expect(
        doFeatureParamsMatchFeature(params, analyticsFeature)
      ).toBeTruthy();
    });

    test('should return false when feature different', () => {
      params.feature = 'Age';
      expect(doFeatureParamsMatchFeature(params, analyticsFeature)).toBeFalsy();
    });

    test('should return false when region different', () => {
      params.region = 'California';
      expect(doFeatureParamsMatchFeature(params, analyticsFeature)).toBeFalsy();
    });

    test('should return false when year different', () => {
      params.year = 2019;
      expect(doFeatureParamsMatchFeature(params, analyticsFeature)).toBeFalsy();
    });

    test('should return false when month different', () => {
      params.month = 10;
      expect(doFeatureParamsMatchFeature(params, analyticsFeature)).toBeFalsy();
    });

    test('should return false when all params different', () => {
      params.feature = 'Age';
      params.region = 'California';
      params.year = 2019;
      params.month = 10;
      expect(doFeatureParamsMatchFeature(params, analyticsFeature)).toBeFalsy();
    });
  });
});
