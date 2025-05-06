import { HttpClient } from '@angular/common/http';

import { Stub } from '../../shared/test/stub.class';
import { PlanningView } from '../demand-validation/planning-view';
import { GlobalSelectionCriteriaFilters } from '../global-selection/model';
import { ChartSettingsService } from './forecast-chart.service';
import { ChartSettings, ChartUnitMode, PeriodType } from './model';

const mockChartSettings: ChartSettings = {
  startDate: '2021-01-01T00:00:00Z',
  endDate: '2021-12-31T00:00:00Z',
  planningView: PlanningView.CONFIRMED,
  chartUnitMode: ChartUnitMode.CURRENCY,
  periodType: PeriodType.MONTHLY,
};

const mockGlobalSelectionState: GlobalSelectionCriteriaFilters = {
  region: [],
  salesArea: [],
  sectorManagement: [],
  salesOrg: [],
  gkamNumber: [],
  customerNumber: [],
  materialClassification: [],
  sector: [],
  materialNumber: [],
  productionPlant: [],
  productionSegment: [],
  alertType: [],
};

describe('ChartSettingsService', () => {
  let service: ChartSettingsService;
  let httpClient: HttpClient;
  let postSpy: jest.SpyInstance;
  const testCurrency = 'EUR';
  const testStartDate = '2024-04-01';
  const testEndDate = '2028-08-01';
  const testId = 'my-chart';

  beforeEach(() => {
    service = Stub.get({ component: ChartSettingsService });
    httpClient = service['http'];
    postSpy = jest.spyOn(httpClient, 'post');
  });

  describe('defaultChartSettings', () => {
    it('should return the default chart settings with a yearly period', () => {
      const result = service['defaultChartSettings'](PeriodType.YEARLY);
      expect(result).toEqual({
        startDate: expect.any(Date), // agreed upon default start date
        endDate: expect.any(Date), // agreed upon default end date
        planningView: PlanningView.REQUESTED,
        chartUnitMode: ChartUnitMode.CURRENCY,
        periodType: PeriodType.YEARLY,
      });
    });
  });

  describe('parseChartSettings', () => {
    it('should parse the chart settings', () => {
      const result = service['parseChartSettings']({
        startDate: '2025-02-01', // agreed upon default start date
        endDate: '2027-01-01', // agreed upon default end date
        planningView: 'REQUESTED',
        chartUnitMode: 'CURRENCY',
        periodType: 'YEARLY',
      });

      expect(result).toEqual({
        startDate: expect.any(Date), // agreed upon default start date
        endDate: expect.any(Date), // agreed upon default end date
        planningView: PlanningView.REQUESTED,
        chartUnitMode: ChartUnitMode.CURRENCY,
        periodType: PeriodType.YEARLY,
      });
    });
  });

  describe('getForecastChartData', () => {
    it('should request the data that is assigned to me', () => {
      service.getForecastChartData(
        mockGlobalSelectionState,
        {},
        mockChartSettings,
        testStartDate,
        testEndDate,
        testCurrency,
        true
      );
      expect(postSpy).toHaveBeenCalledWith(service['FORECASTCHART_DATA_API'], {
        chartUnitMode: 'CURRENCY',
        columnFilters: [{}],
        currency: testCurrency,
        endDate: testEndDate,
        isCustomerNumberAssignedToMe: true,
        planningView: 'CONFIRMED',
        selectionFilters: mockGlobalSelectionState,
        startDate: testStartDate,
      });
    });

    it('should request all data', () => {
      service.getForecastChartData(
        mockGlobalSelectionState,
        {},
        mockChartSettings,
        testStartDate,
        testEndDate,
        testCurrency
      );
      expect(postSpy).toHaveBeenCalledWith(service['FORECASTCHART_DATA_API'], {
        chartUnitMode: 'CURRENCY',
        columnFilters: [{}],
        currency: testCurrency,
        endDate: testEndDate,
        planningView: 'CONFIRMED',
        selectionFilters: mockGlobalSelectionState,
        startDate: testStartDate,
      });
    });

    it('should return null for an empty global selection', () => {
      const result = service.getForecastChartData(
        undefined,
        {},
        mockChartSettings,
        testStartDate,
        testEndDate,
        testCurrency
      );
      expect(result).toBeNull();
      expect(postSpy).not.toHaveBeenCalledWith();
    });
  });
  describe('getChartSettings', () => {
    it('should load the chart settings', () => {
      const getSpy = jest.spyOn(httpClient, 'get');
      service.getChartSettings(testId, PeriodType.MONTHLY);
      expect(getSpy).toHaveBeenCalledWith(
        'api/user-settings/chart?chartIdentifier=my-chart'
      );
    });
  });

  describe('updateChartSettings', () => {
    it('should update the chart settings', () => {
      service.updateChartSettings(mockChartSettings, testId);
      expect(postSpy).toHaveBeenCalledWith(
        'api/user-settings/chart?chartIdentifier=my-chart',
        {
          chartUnitMode: 'CURRENCY',
          endDate: '2021-12-31',
          periodType: 'MONTHLY',
          planningView: 'CONFIRMED',
          startDate: '2021-01-01',
        }
      );
    });
  });
});
