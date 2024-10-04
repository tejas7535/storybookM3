import { EmployeeCluster } from '../../models';
import {
  loadAvailableClusters,
  loadAvailableClustersFailure,
  loadAvailableClustersSuccess,
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
        allFeatures: 20,
        availableFeatures: 10,
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
});
