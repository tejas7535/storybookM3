import { MatRadioChange } from '@angular/material/radio';

import { of, take } from 'rxjs';

import { MockProvider } from 'ng-mocks';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import ResizeObserver from 'resize-observer-polyfill';

import { GlobalSelectionState } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { Stub } from '../../../../shared/test/stub.class';
import { PlanningView } from '../../../demand-validation/planning-view';
import { ChartSettingsService } from '../../forecast-chart.service';
import {
  ChartSettings,
  ChartUnitMode,
  ForecastChartData,
  PeriodType,
} from '../../model';
import { ForecastChartComponent } from './forecast-chart.component';

global.ResizeObserver = ResizeObserver;

const mockChartSettings: ChartSettings = {
  startDate: '2021-01-01T00:00:00Z',
  endDate: '2021-12-31T00:00:00Z',
  planningView: PlanningView.CONFIRMED,
  chartUnitMode: ChartUnitMode.CURRENCY,
  periodType: PeriodType.MONTHLY,
};

const mockForecastChartData = {
  chartUnitMode: ChartUnitMode.CURRENCY,
  planningView: PlanningView.CONFIRMED,
  currency: 'EUR',
  chartEntries: [
    {
      yearMonth: '2021-01',
      deliveries: 100,
      orders: 200,
      onTopOrder: 10,
      salesAmbition: 300,
      onTopCapacityForecast: 400,
      opportunities: 150,
      salesPlan: 500,
    },
  ],
};

const mockGlobalSelectionState: GlobalSelectionState = {
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

describe('ForecastChartComponent', () => {
  let component: ForecastChartComponent;

  beforeEach(() => {
    component = Stub.getForEffect({
      component: ForecastChartComponent,
      providers: [
        MockProvider(ChartSettingsService, {
          getForecastChartData: jest.fn(),
        }),
        {
          provide: NGX_ECHARTS_CONFIG,
          useValue: { echarts: () => import('echarts') },
        },
      ],
    });
    Stub.setInputs([
      { property: 'globalSelectionState', value: {} },
      { property: 'customerFilter', value: { id: '1', text: 'customer 1' } },
      { property: 'currency', value: 'EUR' },
      { property: 'chartIdentifier', value: 'my-chart' },
      { property: 'defaultPeriodType', value: PeriodType.MONTHLY },
      { property: 'columnFilters', value: [] },
      { property: 'disablePreview', value: true },
    ]);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization (ngOnInit)', () => {
    beforeEach(() => {
      jest
        .spyOn(component['chartSettingsService'], 'getChartSettings')
        .mockReturnValue(of(mockChartSettings));
      jest
        .spyOn(component['chartSettingsService'], 'getForecastChartData')
        .mockReturnValue(of(mockForecastChartData));
      Stub.detectChanges();
    });

    it('should load chart settings and initialize forms', () => {
      const dateForm = component.dateForm;
      expect(dateForm.get('startDate').value).toBe(
        new Date(mockChartSettings.startDate).toISOString()
      );
      expect(dateForm.get('endDate').value).toBe(
        new Date(mockChartSettings.endDate).toISOString()
      );

      const typeForm = component.typeForm;
      expect(typeForm.get('count').value).toBe(mockChartSettings.planningView);
      expect(typeForm.get('type').value).toBe(mockChartSettings.chartUnitMode);
      expect(typeForm.get('period').value).toBe(mockChartSettings.periodType);

      expect(component['chartSettingsInitialized']()).toBe(true);
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      jest
        .spyOn(component['chartSettingsService'], 'getChartSettings')
        .mockReturnValue(of(mockChartSettings));
      jest
        .spyOn(component['chartSettingsService'], 'getForecastChartData')
        .mockReturnValue(of(mockForecastChartData));
      jest
        .spyOn(component['chartSettingsService'], 'updateChartSettings')
        .mockReturnValue(of(null));
    });

    it('should validate dateForm on update', () => {
      component['chartSettings'] = mockChartSettings;
      // Invalid date scenario: endDate before startDate
      component['dateForm'].patchValue({
        startDate: '2021-12-31T00:00:00Z',
        endDate: '2021-01-01T00:00:00Z',
      });

      component.onUpdateDateSettings();
      expect(
        component['chartSettingsService'].updateChartSettings
      ).not.toHaveBeenCalled();

      // Now fix the dates
      component['dateForm'].patchValue({
        startDate: '2021-01-01T00:00:00Z',
        endDate: '2021-12-31T00:00:00Z',
      });

      component.onUpdateDateSettings();

      // Now it's valid
      expect(
        component['chartSettingsService'].updateChartSettings
      ).toHaveBeenCalled();
    });

    it('should disable settings if loading or preview data rendered', () => {
      component['isLoading'].set(true);
      expect(component.settingsDisabled()).toBe(true);

      component['isLoading'].set(false);
      component['isPreviewDataRendered'].set(true);
      expect(component.settingsDisabled()).toBe(true);
    });
  });

  describe('loadData$', () => {
    it('should load data', (done) => {
      const getDataSpy = jest
        .spyOn(component['chartSettingsService'], 'getForecastChartData')
        .mockReturnValue(of({ chartEntries: [] } as ForecastChartData));
      component['chartSettings'] = {
        startDate: '2021-01-01T00:00:00Z',
        endDate: '2021-12-31T00:00:00Z',
        planningView: PlanningView.REQUESTED,
        chartUnitMode: ChartUnitMode.CURRENCY,
        periodType: PeriodType.YEARLY,
      };
      component['loadData$'](mockGlobalSelectionState, {}, true)
        .pipe(take(1))
        .subscribe(() => {
          expect(getDataSpy).toHaveBeenCalledWith(
            {},
            {},
            {
              chartUnitMode: 'CURRENCY',
              endDate: '2021-12-31T00:00:00Z',
              periodType: 'YEARLY',
              planningView: 'REQUESTED',
              startDate: '2021-01-01T00:00:00Z',
            },
            '2021-01-01',
            '2021-12-31',
            'EUR',
            true
          );
          done();
        });
    });

    it('should load the yearly data', (done) => {
      const getDataSpy = jest
        .spyOn(component['chartSettingsService'], 'getForecastChartData')
        .mockReturnValue(of({ chartEntries: [] } as ForecastChartData));
      component['chartSettings'] = {
        startDate: '2021-01-01T00:00:00Z',
        endDate: '2021-12-31T00:00:00Z',
        planningView: PlanningView.REQUESTED,
        chartUnitMode: ChartUnitMode.CURRENCY,
        periodType: PeriodType.YEARLY,
      };

      component['typeForm'].patchValue({ period: PeriodType.YEARLY });
      component['loadData$'](mockGlobalSelectionState, {}, true)
        .pipe(take(1))
        .subscribe(() => {
          expect(getDataSpy).toHaveBeenCalledWith(
            {},
            {},
            {
              chartUnitMode: 'CURRENCY',
              endDate: '2021-12-31T00:00:00Z',
              periodType: 'YEARLY',
              planningView: 'REQUESTED',
              startDate: '2021-01-01T00:00:00Z',
            },
            '2023-01-01',
            '2028-01-01',
            'EUR',
            true
          );
          done();
        });
    });

    it('should enable the preview', () => {
      Stub.setInput('disablePreview', false);
      const getDataSpy = jest
        .spyOn(component['chartSettingsService'], 'getForecastChartData')
        .mockReturnValue(of());

      component['typeForm'].patchValue({ period: PeriodType.YEARLY });
      component['loadData$'](mockGlobalSelectionState, {}, true);
      expect(getDataSpy).not.toHaveBeenCalledWith();
    });
  });

  describe('togglePanel', () => {
    it('toggle the openPanel', () => {
      component['togglePanel']('date');
      expect(component['openPanel']()).toBe('date');
    });
    it('reset the openPanel', () => {
      component['openPanel'].set('date');
      component['togglePanel']('date');
      expect(component['openPanel']()).toBeNull();
    });
  });

  describe('onChangeCount', () => {
    it('should set the planning view and trigger change event', () => {
      const event = { value: PlanningView.CONFIRMED } as MatRadioChange;
      component['chartSettings'] = mockChartSettings;
      component['onChartSettingChange'] = jest.fn();
      component['onChangeCount'](event);
      expect(component['chartSettings'].planningView).toBe(
        PlanningView.CONFIRMED
      );
      expect(component['onChartSettingChange']).toHaveBeenCalledWith(
        'count',
        PlanningView.CONFIRMED
      );
    });
  });

  describe('onChangeType', () => {
    it('should set the unit type and trigger change event', () => {
      const event = { value: ChartUnitMode.QUANTITY } as MatRadioChange;
      component['chartSettings'] = mockChartSettings;
      component['onChartSettingChange'] = jest.fn();
      component['onChangeType'](event);
      expect(component['chartSettings'].chartUnitMode).toBe(
        ChartUnitMode.QUANTITY
      );
      expect(component['onChartSettingChange']).toHaveBeenCalledWith(
        'type',
        ChartUnitMode.QUANTITY
      );
    });
  });

  describe('onPeriodChange', () => {
    it('should set the period, reset the data and trigger change event', () => {
      const event = { value: PeriodType.YEARLY } as MatRadioChange;
      component['chartSettings'] = mockChartSettings;
      component['onChartSettingChange'] = jest.fn();
      component['onPeriodChange'](event);
      expect(component['chartSettings'].periodType).toBe(PeriodType.YEARLY);
      expect(component['chartData']()).toEqual([]);
      expect(component['onChartSettingChange']).toHaveBeenCalledWith(
        'period',
        PeriodType.YEARLY
      );
    });
  });

  describe('onChartSettingChange', () => {
    it('should set the data and save the chart settings', () => {
      component['updateAndSaveChartSettings'] = jest.fn();
      component['onChartSettingChange']('period', PeriodType.YEARLY);
      expect(component['typeForm'].get('period').getRawValue()).toBe(
        PeriodType.YEARLY
      );
      expect(component['updateAndSaveChartSettings']).toHaveBeenCalledWith();
    });
  });

  describe('onUpdateDateSettings', () => {
    it('should load data', () => {
      component['chartSettings'] = mockChartSettings;
      component['dateForm'].setValue({
        startDate: '2022-01-01T00:00:00Z',
        endDate: '2022-12-31T00:00:00Z',
      });
      component['updateAndSaveChartSettings'] = jest.fn();
      component['onUpdateDateSettings']();
      expect(component['chartSettings'].startDate).toBe('2022-01-01T00:00:00Z');
      expect(component['chartSettings'].endDate).toBe('2022-12-31T00:00:00Z');
      expect(component['updateAndSaveChartSettings']).toHaveBeenCalledWith();
    });
  });

  describe('updateAndSaveChartSettings', () => {
    it('update and reload the settings', () => {
      const updateSpy = jest
        .spyOn(component['chartSettingsService'], 'updateChartSettings')
        .mockImplementation(() => of(null));
      component['chartSettings'] = mockChartSettings;
      component['loadData$'] = jest.fn(() => of());
      component['updateAndSaveChartSettings']();
      expect(updateSpy).toHaveBeenCalledWith(mockChartSettings, 'my-chart');
      expect(component['loadData$']).toHaveBeenCalledWith(
        {
          ...mockGlobalSelectionState,
          customerNumber: [{ id: '1', text: 'customer 1' }],
        },
        [],
        null
      );
    });
  });

  describe('dateSelectionDisabled', () => {
    it('should disable the date selection when the settings are disabled', () => {
      component['isYearlyChartSelected'] = jest.fn(() => false);
      component['settingsDisabled'] = jest.fn(() => true);
      expect(component['dateSelectionDisabled']()).toBe(true);
    });
    it('should disable the date selection when the yearly chart is selected', () => {
      component['isYearlyChartSelected'] = jest.fn(() => true);
      component['settingsDisabled'] = jest.fn(() => false);
      expect(component['dateSelectionDisabled']()).toBe(true);
    });
  });

  describe('updateToggledKpis', () => {
    it('should toggle a KPI', () => {
      component['toggledKpis'].set({
        salesAmbition: false,
        opportunities: false,
        onTopCapacityForecast: false,
        onTopOrder: false,
      });
      component['updateToggledKpis']('salesAmbition');
      expect(component['toggledKpis']()).toEqual({
        salesAmbition: true,
        opportunities: false,
        onTopCapacityForecast: false,
        onTopOrder: false,
      });
    });
  });
});
