import { FeatureImportanceGroup } from '../../models';
import { EmployeeAnalytics } from '../../models/employee-analytics.model';
import { FeatureParams } from '../../models/feature-params.model';
import {
  changeOrderOfFeatures,
  changeSelectedFeatures,
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
  loadFeatureImportance,
  loadFeatureImportanceFailure,
  loadFeatureImportanceSuccess,
} from './attrition-analytics.action';

describe('Attrition Analytics Actions', () => {
  const errorMessage = 'An error occured';

  test('loadEmployeeAnalytics', () => {
    const action = loadEmployeeAnalytics({ params: [] });

    expect(action).toEqual({
      params: [],
      type: '[AttritionAnalytics] Load Employee Analytics',
    });
  });

  test('loadEmployeeAnalyticsSuccess', () => {
    const data: EmployeeAnalytics[] = [];
    const action = loadEmployeeAnalyticsSuccess({ data });

    expect(action).toEqual({
      type: '[AttritionAnalytics] Load Employee Analytics Success',
      data,
    });
  });

  test('loadEmployeeAnalyticsFailure', () => {
    const action = loadEmployeeAnalyticsFailure({ errorMessage });

    expect(action).toEqual({
      type: '[AttritionAnalytics] Load Employee Analytics Failure',
      errorMessage,
    });
  });

  test('changeSelectedFeatures', () => {
    const features: FeatureParams[] = [];
    const action = changeSelectedFeatures({ features });

    expect(action).toEqual({
      type: '[AttritionAnalytics] Change Selected Features',
      features,
    });
  });

  test('changeOrderOfFeatures', () => {
    const features: FeatureParams[] = [];
    const action = changeOrderOfFeatures({ features });

    expect(action).toEqual({
      type: '[AttritionAnalytics] Change Order Of Features',
      features,
    });
  });

  test('loadFeatureImportance', () => {
    const action = loadFeatureImportance();

    expect(action).toEqual({
      type: '[AttritionAnalytics] Load Feature Importance',
    });
  });

  test('loadFeatureImportanceSuccess', () => {
    const data = {
      hasNext: true,
      hasPrevious: false,
      pageable: {
        pageNumber: 0,
        pageSize: 10,
      },
      content: [] as FeatureImportanceGroup[],
    };

    const action = loadFeatureImportanceSuccess({
      data,
    });

    expect(action).toEqual({
      type: '[AttritionAnalytics] Load Feature Importance Success',
      data,
    });
  });

  test('loadFeatureImportanceFailure', () => {
    const action = loadFeatureImportanceFailure({ errorMessage });

    expect(action).toEqual({
      type: '[AttritionAnalytics] Load Feature Importance Failure',
      errorMessage,
    });
  });
});
