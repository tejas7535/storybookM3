import { CHART_COLOR_PALETTE } from '../../models';
import { DoughnutChartDataFactory } from './doughnut-chart-data.factory';

describe('DoughnutChartDataFactory', () => {
  describe('createWithReasonId', () => {
    test('should create DoughnutChartData with color from ReasonStyle map', () => {
      const result = DoughnutChartDataFactory.createWithReasonId(
        100,
        'Test Reason',
        46,
        50
      );

      expect(result).toEqual({
        value: 100,
        name: 'Test Reason',
        itemStyle: { color: CHART_COLOR_PALETTE.COLORFUL_CHART_14 },
        color: CHART_COLOR_PALETTE.COLORFUL_CHART_14,
        percent: 50,
      });
    });

    test('should create DoughnutChartData without color for non-existing reasonId', () => {
      const result = DoughnutChartDataFactory.createWithReasonId(
        100,
        'Test Reason',
        999,
        50
      );

      expect(result).toEqual({
        value: 100,
        name: 'Test Reason',
        itemStyle: undefined,
        color: undefined,
        percent: 50,
      });
    });

    test('should create DoughnutChartData without percent when not provided', () => {
      const result = DoughnutChartDataFactory.createWithReasonId(
        100,
        'Test Reason',
        46
      );

      expect(result).toEqual({
        value: 100,
        name: 'Test Reason',
        itemStyle: { color: CHART_COLOR_PALETTE.COLORFUL_CHART_14 },
        color: CHART_COLOR_PALETTE.COLORFUL_CHART_14,
        percent: undefined,
      });
    });
  });

  describe('createWithDetailedReasonId', () => {
    test('should create DoughnutChartData with color from DetailedReasonStyle map', () => {
      const result = DoughnutChartDataFactory.createWithDetailedReasonId(
        50,
        'Test Detailed Reason',
        357,
        25
      );

      expect(result).toEqual({
        value: 50,
        name: 'Test Detailed Reason',
        itemStyle: { color: CHART_COLOR_PALETTE.COLORFUL_CHART_4 },
        color: CHART_COLOR_PALETTE.COLORFUL_CHART_4,
        percent: 25,
      });
    });

    test('should create DoughnutChartData without color for non-existing detailedReasonId', () => {
      const result = DoughnutChartDataFactory.createWithDetailedReasonId(
        50,
        'Test Detailed Reason',
        999,
        25
      );

      expect(result).toEqual({
        value: 50,
        name: 'Test Detailed Reason',
        itemStyle: undefined,
        color: undefined,
        percent: 25,
      });
    });
  });

  describe('createFromReason', () => {
    test('should create DoughnutChartData from reason data object', () => {
      const reasonData = {
        value: 75,
        name: 'Test Reason Object',
        reasonId: 47,
        percent: 30,
      };

      const result = DoughnutChartDataFactory.createFromReason(reasonData);

      expect(result).toEqual({
        value: 75,
        name: 'Test Reason Object',
        itemStyle: { color: CHART_COLOR_PALETTE.COLORFUL_CHART_15 },
        color: CHART_COLOR_PALETTE.COLORFUL_CHART_15,
        percent: 30,
      });
    });
  });

  describe('createFromDetailedReason', () => {
    test('should create DoughnutChartData from detailed reason data object', () => {
      const detailedReasonData = {
        value: 25,
        name: 'Test Detailed Reason Object',
        detailedReasonId: 358,
        percent: 15,
      };

      const result =
        DoughnutChartDataFactory.createFromDetailedReason(detailedReasonData);

      expect(result).toEqual({
        value: 25,
        name: 'Test Detailed Reason Object',
        itemStyle: { color: CHART_COLOR_PALETTE.COLORFUL_CHART_18 },
        color: CHART_COLOR_PALETTE.COLORFUL_CHART_18,
        percent: 15,
      });
    });
  });
});
