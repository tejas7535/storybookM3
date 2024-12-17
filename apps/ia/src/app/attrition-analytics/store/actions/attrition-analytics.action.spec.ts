import { EmployeeAnalytics, EmployeeCluster } from '../../models';
import {
  loadAvailableClusters,
  loadAvailableClustersFailure,
  loadAvailableClustersSuccess,
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
  selectCluster,
} from './attrition-analytics.action';

describe('Attrition Analytics Actions', () => {
  const errorMessage = 'An error occured';

  test('should load available clusters', () => {
    expect(loadAvailableClusters()).toEqual({
      type: '[AttritionAnalytics] Load Available Clusters',
    });
  });

  test('should load available clusters success', () => {
    const data: EmployeeCluster[] = [
      {
        name: 'Cluster 1',
        allFeaturesCount: 20,
        color: 'red',
      },
    ];
    expect(loadAvailableClustersSuccess({ data })).toEqual({
      type: '[AttritionAnalytics] Load Available Clusters Success',
      data,
    });
  });

  test('should load available clusters failure', () => {
    expect(loadAvailableClustersFailure({ errorMessage })).toEqual({
      type: '[AttritionAnalytics] Load Available Clusters Failure',
      errorMessage,
    });
  });

  test('loadEmployeeAnalytics', () => {
    expect(loadEmployeeAnalytics()).toEqual({
      type: '[AttritionAnalytics] Load Employee Analytics',
    });
  });

  test('should load employee analytics success', () => {
    const data: EmployeeAnalytics[] = [];
    expect(loadEmployeeAnalyticsSuccess({ data })).toEqual({
      type: '[AttritionAnalytics] Load Employee Analytics Success',
      data,
    });
  });

  test('should load employee analytics failure', () => {
    expect(loadEmployeeAnalyticsFailure({ errorMessage })).toEqual({
      type: '[AttritionAnalytics] Load Employee Analytics Failure',
      errorMessage,
    });
  });

  test('should select cluster', () => {
    const cluster = 'Cluster 1';
    expect(selectCluster({ cluster })).toEqual({
      type: '[AttritionAnalytics] Select Cluster',
      cluster,
    });
  });

  test('should clear employee analytics', () => {
    expect(selectCluster({ cluster: undefined })).toEqual({
      type: '[AttritionAnalytics] Select Cluster',
      cluster: undefined,
    });
  });
});
