import { HttpClient } from '@angular/common/http';

import { of, throwError } from 'rxjs';

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
      service.getForecastChartData({
        globalSelectionFilters: mockGlobalSelectionState,
        columnFilters: {},
        chartSettings: mockChartSettings,
        startDate: testStartDate,
        endDate: testEndDate,
        currency: testCurrency,
        isAssignedToMe: true,
      });
      expect(postSpy).toHaveBeenCalledWith(service['FORECASTCHART_DATA_API'], {
        chartUnitMode: 'CURRENCY',
        columnFilters: [{}],
        currency: testCurrency,
        endDate: testEndDate,
        isCustomerNumberAssignedToMe: true,
        planningView: 'CONFIRMED',
        selectionFilters: mockGlobalSelectionState,
        startDate: testStartDate,
        includeSalesData: false,
      });
    });

    it('should request all data', () => {
      service.getForecastChartData({
        globalSelectionFilters: mockGlobalSelectionState,
        columnFilters: {},
        chartSettings: mockChartSettings,
        startDate: testStartDate,
        endDate: testEndDate,
        currency: testCurrency,
      });
      expect(postSpy).toHaveBeenCalledWith(service['FORECASTCHART_DATA_API'], {
        chartUnitMode: 'CURRENCY',
        columnFilters: [{}],
        currency: testCurrency,
        endDate: testEndDate,
        planningView: 'CONFIRMED',
        selectionFilters: mockGlobalSelectionState,
        startDate: testStartDate,
        includeSalesData: false,
      });
    });

    it('should return null for an empty global selection', () => {
      const result = service.getForecastChartData({
        globalSelectionFilters: undefined,
        columnFilters: {},
        chartSettings: mockChartSettings,
        startDate: testStartDate,
        endDate: testEndDate,
        currency: testCurrency,
      });
      expect(result).toBeNull();
      expect(postSpy).not.toHaveBeenCalledWith();
    });

    it('should include sales data when includeSalesData is true', () => {
      service.getForecastChartData({
        globalSelectionFilters: mockGlobalSelectionState,
        columnFilters: {},
        chartSettings: mockChartSettings,
        startDate: testStartDate,
        endDate: testEndDate,
        currency: testCurrency,
        includeSalesData: true,
      });

      expect(postSpy).toHaveBeenCalledWith(service['FORECASTCHART_DATA_API'], {
        chartUnitMode: 'CURRENCY',
        columnFilters: [{}],
        currency: testCurrency,
        endDate: testEndDate,
        planningView: 'CONFIRMED',
        selectionFilters: mockGlobalSelectionState,
        startDate: testStartDate,
        includeSalesData: true,
      });
    });

    it('should handle null or undefined includeSalesData parameter', () => {
      service.getForecastChartData({
        globalSelectionFilters: mockGlobalSelectionState,
        columnFilters: {},
        chartSettings: mockChartSettings,
        startDate: testStartDate,
        endDate: testEndDate,
        currency: testCurrency,
        includeSalesData: null,
      });

      expect(postSpy).toHaveBeenCalledWith(
        service['FORECASTCHART_DATA_API'],
        expect.objectContaining({
          includeSalesData: false,
        })
      );

      postSpy.mockClear();

      service.getForecastChartData({
        globalSelectionFilters: mockGlobalSelectionState,
        columnFilters: {},
        chartSettings: mockChartSettings,
        startDate: testStartDate,
        endDate: testEndDate,
        currency: testCurrency,
        includeSalesData: undefined,
      });

      expect(postSpy).toHaveBeenCalledWith(
        service['FORECASTCHART_DATA_API'],
        expect.objectContaining({
          includeSalesData: false,
        })
      );
    });

    it('should handle empty columnFilters', () => {
      service.getForecastChartData({
        globalSelectionFilters: mockGlobalSelectionState,
        columnFilters: null,
        chartSettings: mockChartSettings,
        startDate: testStartDate,
        endDate: testEndDate,
        currency: testCurrency,
      });

      expect(postSpy).toHaveBeenCalledWith(
        service['FORECASTCHART_DATA_API'],
        expect.objectContaining({
          columnFilters: [],
        })
      );
    });

    it('should not include isCustomerNumberAssignedToMe when isAssignedToMe is undefined', () => {
      service.getForecastChartData({
        globalSelectionFilters: mockGlobalSelectionState,
        columnFilters: {},
        chartSettings: mockChartSettings,
        startDate: testStartDate,
        endDate: testEndDate,
        currency: testCurrency,
        isAssignedToMe: undefined,
      });

      const calledRequest = postSpy.mock.calls[0][1];
      expect(calledRequest).not.toHaveProperty('isCustomerNumberAssignedToMe');
    });

    it('should include isCustomerNumberAssignedToMe as false when provided', () => {
      service.getForecastChartData({
        globalSelectionFilters: mockGlobalSelectionState,
        columnFilters: {},
        chartSettings: mockChartSettings,
        startDate: testStartDate,
        endDate: testEndDate,
        currency: testCurrency,
        isAssignedToMe: false,
      });

      expect(postSpy).toHaveBeenCalledWith(
        service['FORECASTCHART_DATA_API'],
        expect.objectContaining({
          isCustomerNumberAssignedToMe: false,
        })
      );
    });
  });

  describe('getChartSettings', () => {
    it('should load the chart settings', (done) => {
      const getSpy = jest.spyOn(httpClient, 'get');
      service.getChartSettings(testId, PeriodType.MONTHLY).subscribe(() => {
        expect(getSpy).toHaveBeenCalledWith(
          'api/user-settings/chart?chartIdentifier=my-chart'
        );
        done();
      });
    });

    it('should return default settings when API call fails', (done) => {
      jest
        .spyOn(httpClient, 'get')
        .mockReturnValue(throwError(() => new Error('API error')));

      const result = service.getChartSettings(testId, PeriodType.YEARLY);

      // Verify that default settings would be returned through the catchError operator
      result.subscribe({
        next: (err) => {
          expect(err).toEqual(
            expect.objectContaining({
              planningView: PlanningView.REQUESTED,
              chartUnitMode: ChartUnitMode.CURRENCY,
              periodType: PeriodType.YEARLY,
            })
          );
          done();
        },
      });
    });

    it('should parse the response correctly', (done) => {
      const mockResponse = {
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        planningView: 'CONFIRMED',
        chartUnitMode: 'QUANTITY',
        periodType: 'YEARLY',
      };

      jest.spyOn(httpClient, 'get').mockReturnValue(of(mockResponse));

      service
        .getChartSettings(testId, PeriodType.MONTHLY)
        .subscribe((result) => {
          expect(result).toEqual({
            startDate: new Date('2022-01-01'),
            endDate: new Date('2022-12-31'),
            planningView: PlanningView.CONFIRMED,
            chartUnitMode: ChartUnitMode.QUANTITY,
            periodType: PeriodType.YEARLY,
          });
          done();
        });
    });

    it('should use the provided default period type in case of error', (done) => {
      jest
        .spyOn(httpClient, 'get')
        .mockReturnValue(throwError(() => new Error('API error')));

      service
        .getChartSettings(testId, PeriodType.YEARLY)
        .subscribe((result) => {
          expect(result.periodType).toBe(PeriodType.YEARLY);
          done();
        });
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

    it('should properly format dates when updating chart settings', () => {
      const customSettings = {
        ...mockChartSettings,
        startDate: new Date('2023-05-15'),
        endDate: new Date('2023-12-31'),
      };

      service.updateChartSettings(customSettings, testId);

      expect(postSpy).toHaveBeenCalledWith(
        'api/user-settings/chart?chartIdentifier=my-chart',
        {
          chartUnitMode: 'CURRENCY',
          endDate: '2023-12-31',
          periodType: 'MONTHLY',
          planningView: 'CONFIRMED',
          startDate: '2023-05-15',
        }
      );
    });

    it('should return the HTTP post response', () => {
      const mockResponse = of({ success: true });
      postSpy.mockReturnValue(mockResponse);

      const result = service.updateChartSettings(mockChartSettings, testId);

      expect(result).toBe(mockResponse);
    });
  });
});
