import { MatRadioChange } from '@angular/material/radio';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import ResizeObserver from 'resize-observer-polyfill';

import { GlobalSelectionState } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { PlanningView } from '../../../demand-validation/planning-view';
import { ChartSettingsService } from '../../forecast-chart.service';
import { ChartSettings, ChartUnitMode, PeriodType } from '../../model';
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

describe('ForecastChartComponent', () => {
  let spectator: Spectator<ForecastChartComponent>;
  let chartSettingsService: ChartSettingsService;

  const createComponent = createComponentFactory({
    component: ForecastChartComponent,
    mocks: [ChartSettingsService],
    imports: [MockModule(NgxEchartsModule)],
    detectChanges: false,
    providers: [
      {
        provide: NGX_ECHARTS_CONFIG,
        useValue: { echarts: () => import('echarts') },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        currency: 'USD',
        globalSelectionState: {} as GlobalSelectionState,
        columnFilters: {},
        chartIdentifier: 'test-chart',
        defaultPeriodType: PeriodType.MONTHLY,
      },
    });

    chartSettingsService = spectator.inject(ChartSettingsService);
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('Initialization (ngOnInit)', () => {
    beforeEach(() => {
      jest
        .spyOn(chartSettingsService, 'getChartSettings')
        .mockReturnValue(of(mockChartSettings));
      jest
        .spyOn(chartSettingsService, 'getForecastChartData')
        .mockReturnValue(of(mockForecastChartData));
      spectator.detectChanges();
    });

    it('should load chart settings and initialize forms', () => {
      const dateForm = spectator.component.dateForm;
      expect(dateForm.get('startDate').value).toBe(
        new Date(mockChartSettings.startDate).toISOString()
      );
      expect(dateForm.get('endDate').value).toBe(
        new Date(mockChartSettings.endDate).toISOString()
      );

      const typeForm = spectator.component.typeForm;
      expect(typeForm.get('count').value).toBe(mockChartSettings.planningView);
      expect(typeForm.get('type').value).toBe(mockChartSettings.chartUnitMode);
      expect(typeForm.get('period').value).toBe(mockChartSettings.periodType);

      expect(spectator.component['chartSettingsInitialized']()).toBe(true);
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      jest
        .spyOn(chartSettingsService, 'getChartSettings')
        .mockReturnValue(of(mockChartSettings));
      jest
        .spyOn(chartSettingsService, 'getForecastChartData')
        .mockReturnValue(of(mockForecastChartData));
      jest
        .spyOn(chartSettingsService, 'updateChartSettings')
        .mockReturnValue(of(null));

      spectator.detectChanges(); // trigger ngOnInit and loadChartSettings
    });

    it('should toggle KPIs', () => {
      const initialKpis = spectator.component['toggledKpis']();
      expect(initialKpis.salesAmbition).toBe(false);

      spectator.component.updateToggledKpis('salesAmbition');
      const updatedKpis = spectator.component['toggledKpis']();
      expect(updatedKpis.salesAmbition).toBe(true);
    });

    it('should change period and update chart settings', () => {
      const spyUpdateSettings = jest
        .spyOn(chartSettingsService, 'updateChartSettings')
        .mockReturnValue(of(null));

      // Simulate period change event
      spectator.component.onPeriodChange({
        value: PeriodType.YEARLY,
      } as MatRadioChange);
      spectator.detectChanges();

      const typeForm = spectator.component.typeForm;
      expect(typeForm.get('period').value).toBe(PeriodType.YEARLY);
      expect(spyUpdateSettings).toHaveBeenCalled();
    });

    it('should validate dateForm on update', () => {
      // Invalid date scenario: endDate before startDate
      spectator.component.dateForm.setValue({
        startDate: '2021-12-31T00:00:00Z',
        endDate: '2021-01-01T00:00:00Z',
      });

      spectator.component.onUpdateDateSettings();
      expect(chartSettingsService.updateChartSettings).not.toHaveBeenCalled();

      // Now fix the dates
      spectator.component.dateForm.setValue({
        startDate: '2021-01-01T00:00:00Z',
        endDate: '2021-12-31T00:00:00Z',
      });

      spectator.component.onUpdateDateSettings();

      // Now it's valid
      expect(chartSettingsService.updateChartSettings).toHaveBeenCalled();
    });

    it('should disable settings if loading or preview data rendered', () => {
      spectator.component['isLoading'].set(true);
      expect(spectator.component.settingsDisabled()).toBe(true);

      spectator.component['isLoading'].set(false);
      spectator.component['isPreviewDataRendered'].set(true);
      expect(spectator.component.settingsDisabled()).toBe(true);
    });
  });
});
