import { addMonths, format, getYear, subMonths } from 'date-fns';

import { PlanningView } from '../../../feature/demand-validation/planning-view';
import {
  ChartUnitMode,
  ForecastChartData,
} from '../../../feature/forecast-chart/model';
import { previewDataMonthly, previewDataYearly } from './preview-data';

describe('Preview Data', () => {
  let result: ForecastChartData;

  // Mock the Date constructor to return a fixed date for consistent testing
  const mockDate = new Date(2023, 5, 15); // June 15, 2023

  describe('previewDataMonthly', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      result = previewDataMonthly();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return data with correct structure', () => {
      expect(result).toBeDefined();
      expect(result.currency).toBe('EUR');
      expect(result.chartUnitMode).toBe(ChartUnitMode.CURRENCY);
      expect(result.planningView).toBe(PlanningView.REQUESTED);
      expect(Array.isArray(result.chartEntries)).toBe(true);
    });

    it('should contain the expected number of entries', () => {
      expect(result.chartEntries.length).toBe(12);
    });

    it('should have entries with correct date format', () => {
      result.chartEntries.forEach((entry) => {
        expect(entry.yearMonth).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('should generate correct past dates relative to current date', () => {
      const currentDate = mockDate;

      expect(result.chartEntries[0].yearMonth).toBe(
        format(subMonths(currentDate, 3), 'yyyy-MM-dd')
      );
      expect(result.chartEntries[1].yearMonth).toBe(
        format(subMonths(currentDate, 2), 'yyyy-MM-dd')
      );
      expect(result.chartEntries[2].yearMonth).toBe(
        format(subMonths(currentDate, 1), 'yyyy-MM-dd')
      );
    });

    it('should generate correct future dates relative to current date', () => {
      const currentDate = mockDate;

      expect(result.chartEntries[4].yearMonth).toBe(
        format(addMonths(currentDate, 1), 'yyyy-MM-dd')
      );
      expect(result.chartEntries[5].yearMonth).toBe(
        format(addMonths(currentDate, 2), 'yyyy-MM-dd')
      );
    });

    it('should have correct values for deliveries in past months', () => {
      expect(result.chartEntries[0].deliveries).toBe(6000);
      expect(result.chartEntries[1].deliveries).toBe(4000);
      expect(result.chartEntries[2].deliveries).toBe(5000);
    });

    it('should have correct forecast values for future months', () => {
      const futureFifthMonth = result.chartEntries[8]; // Current + 5 months
      expect(futureFifthMonth.onTopOrder).toBe(2500);
      expect(futureFifthMonth.onTopCapacityForecast).toBe(2000);
      expect(futureFifthMonth.salesAmbition).toBe(600);
      expect(futureFifthMonth.opportunities).toBe(600);
      expect(futureFifthMonth.salesPlan).toBe(5700);
    });
  });

  describe('previewDataYearly', () => {
    let currentYear: number;

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      result = previewDataYearly();
      currentYear = getYear(mockDate);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return data with correct structure', () => {
      expect(result).toBeDefined();
      expect(result.currency).toBe('EUR');
      expect(result.chartUnitMode).toBe(ChartUnitMode.CURRENCY);
      expect(result.planningView).toBe(PlanningView.REQUESTED);
      expect(Array.isArray(result.chartEntries)).toBe(true);
    });

    it('should contain the expected number of entries', () => {
      expect(result.chartEntries.length).toBe(6);
    });

    it('should have entries with correct date format (first day of each year)', () => {
      result.chartEntries.forEach((entry) => {
        expect(entry.yearMonth).toMatch(/^\d{4}-01-01$/);
      });
    });

    it('should include data for the correct years', () => {
      expect(result.chartEntries[0].yearMonth).toBe(
        format(new Date(currentYear - 2, 0, 1), 'yyyy-MM-dd')
      );
      expect(result.chartEntries[1].yearMonth).toBe(
        format(new Date(currentYear - 1, 0, 1), 'yyyy-MM-dd')
      );
      expect(result.chartEntries[2].yearMonth).toBe(
        format(new Date(currentYear, 0, 1), 'yyyy-MM-dd')
      );
      expect(result.chartEntries[3].yearMonth).toBe(
        format(new Date(currentYear + 1, 0, 1), 'yyyy-MM-dd')
      );
    });

    it('should have correct values for past years', () => {
      expect(result.chartEntries[0].deliveries).toBe(4000);
      expect(result.chartEntries[1].deliveries).toBe(5000);
    });

    it('should have correct forecast values for future years', () => {
      const futurePlus1Year = result.chartEntries[3];
      expect(futurePlus1Year.orders).toBe(500);
      expect(futurePlus1Year.onTopOrder).toBe(4000);
      expect(futurePlus1Year.salesPlan).toBe(6500);

      const futurePlus3Years = result.chartEntries[5];
      expect(futurePlus3Years.onTopOrder).toBe(6000);
      expect(futurePlus3Years.onTopCapacityForecast).toBe(1000);
      expect(futurePlus3Years.salesPlan).toBe(8000);
    });
  });
});
