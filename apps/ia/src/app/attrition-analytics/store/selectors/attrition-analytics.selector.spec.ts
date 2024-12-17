import { BarChartConfig, BarChartSerie } from '../../../shared/charts/models';
import { TimePeriod } from '../../../shared/models';
import { NavItem } from '../../../shared/nav-buttons/models';
import { AttritionAnalyticsState } from '..';
import {
  getAvailableClusters,
  getClustersLoading,
  getEmployeeAnalytics,
  getEmployeeAnalyticsData,
  getEmployeeAnalyticsLoading,
  getSelectedCluster,
} from './attrition-analytics.selector';
import { createFakeState } from './attrition-analytics.selector.spec.factory';

describe('attrition analytics selector', () => {
  const fakeState: AttritionAnalyticsState = createFakeState();

  describe('getAvailableClusters', () => {
    test('should return available clusters', () => {
      expect(getAvailableClusters.projector(fakeState)).toEqual([
        {
          label: 'Personal',
          badge: '1/10',
          tooltipTranslation:
            'attritionAnalytics.cluster.moreFeaturesAvailableTooltip',
        },
        {
          label: 'Time Management',
          badge: undefined,
          tooltipTranslation:
            'attritionAnalytics.cluster.moreFeaturesAvailableTooltip',
        },
      ] as NavItem[]);
    });
  });

  describe('getClustersLoading', () => {
    test('should return clusters loading', () => {
      expect(getClustersLoading.projector(fakeState)).toBeFalsy();
    });
  });

  describe('getSelectedCluster', () => {
    test('should return selected cluster', () => {
      expect(getSelectedCluster.projector(fakeState)).toEqual('Personal');
    });
  });

  describe('getEmployeeAnalytics', () => {
    test('should return employee analytics', () => {
      expect(
        getEmployeeAnalytics.projector(fakeState, TimePeriod.LAST_12_MONTHS)
      ).toEqual([
        {
          title: 'Age',
          categories: ['c', 'a', 'b'],
          referenceValue: {
            aboveText: 'translate it',
            belowText: 'translate it',
            text: 'translate it',
            value: 0.045,
          },
          series: [
            {
              color: 'red',
              names: ['translate it', 'translate it', 'translate it'],
              values: [
                [11.9, 59, 7],
                [4, 50, 2],
                [10.2, 49, 5],
              ],
            } as BarChartSerie,
          ],
          xAxisSize: 20,
        } as BarChartConfig,
      ]);
    });

    test('should return undefined if employee analytics is undefined', () => {
      const state: AttritionAnalyticsState = {
        ...fakeState,
        employeeAnalytics: { ...fakeState.employeeAnalytics, data: undefined },
      };

      expect(
        getEmployeeAnalytics.projector(state, TimePeriod.LAST_12_MONTHS)
      ).toBeUndefined();
    });
  });

  describe('getEmployeeAnalyticsLoading', () => {
    test('should return employee analytics loading', () => {
      expect(getEmployeeAnalyticsLoading.projector(fakeState)).toBeFalsy();
    });
  });

  describe('getEmployeeAnalyticsData', () => {
    test('should return employee analytics data', () => {
      expect(getEmployeeAnalyticsData.projector(fakeState)).toEqual([
        {
          feature: 'Age',
          overallFluctuationRate: 0.045,
          headcount: [50, 49, 59],
          values: ['18', '19', '20'],
          fluctuation: [2, 5, 7],
          names: ['a', 'b', 'c'],
          order: [2, 3, 1],
        },
      ]);
    });
  });
});
