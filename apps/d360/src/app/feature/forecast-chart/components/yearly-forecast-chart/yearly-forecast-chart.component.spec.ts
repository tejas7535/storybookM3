import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import ResizeObserver from 'resize-observer-polyfill';

import {
  chartSeriesConfig,
  KpiValues,
  MonthlyChartEntry,
  YearlyChartEntry,
} from '../../model';
import { Stub } from './../../../../shared/test/stub.class';
import { YearlyForecastChartComponent } from './yearly-forecast-chart.component';

global.ResizeObserver = ResizeObserver;

describe('YearlyForecastChartComponent', () => {
  let component: YearlyForecastChartComponent;

  beforeEach(() => {
    component = Stub.getForEffect<YearlyForecastChartComponent>({
      component: YearlyForecastChartComponent,
      imports: [NgxEchartsModule],
      providers: [
        {
          provide: NGX_ECHARTS_CONFIG,
          useValue: { echarts: () => import('echarts') },
        },
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formatXAxisData', () => {
    it('should extract unique years from MonthlyChartEntry data', () => {
      const data: MonthlyChartEntry[] = [
        {
          yearMonth: '2023-01',
          orders: 0,
          deliveries: 0,
          opportunities: 0,
          salesAmbition: 0,
          onTopCapacityForecast: 0,
          onTopOrder: 0,
          salesPlan: 0,
        },
        {
          yearMonth: '2023-02',
          orders: 0,
          deliveries: 0,
          opportunities: 0,
          salesAmbition: 0,
          onTopCapacityForecast: 0,
          onTopOrder: 0,
          salesPlan: 0,
        },
        {
          yearMonth: '2024-01',
          orders: 0,
          deliveries: 0,
          opportunities: 0,
          salesAmbition: 0,
          onTopCapacityForecast: 0,
          onTopOrder: 0,
          salesPlan: 0,
        },
      ];
      const result = component['formatXAxisData'](data);
      expect(result).toEqual([2023, 2024]);
    });
  });

  describe('createSeries', () => {
    it('should create series based on aggregated yearly data', () => {
      const data: MonthlyChartEntry[] = [
        {
          yearMonth: '2023-01',
          orders: 10,
          deliveries: 20,
          opportunities: 5,
          salesAmbition: 15,
          onTopCapacityForecast: 8,
          onTopOrder: 3,
          salesPlan: 12,
        },
        {
          yearMonth: '2023-02',
          orders: 5,
          deliveries: 10,
          opportunities: 2,
          salesAmbition: 7,
          onTopCapacityForecast: 4,
          onTopOrder: 1,
          salesPlan: 6,
        },
      ];
      const series = component['createSeries'](data);
      expect(series.length).toBe(8); // 7 bar series + 1 dummy sales plan series
      expect(series[0].name).toBe('home.chart.legend.deliveries');
      expect(series[7].name).toBe('home.chart.legend.salesPlan');
    });
  });

  describe('aggregateByYear', () => {
    it('should aggregate MonthlyChartEntry data by year', () => {
      const data: MonthlyChartEntry[] = [
        {
          yearMonth: '2023-01',
          orders: 10,
          deliveries: 20,
          opportunities: 5,
          salesAmbition: 15,
          onTopCapacityForecast: 8,
          onTopOrder: 3,
          salesPlan: 12,
        },
        {
          yearMonth: '2023-02',
          orders: 5,
          deliveries: 10,
          opportunities: 2,
          salesAmbition: 7,
          onTopCapacityForecast: 4,
          onTopOrder: 1,
          salesPlan: 6,
        },
      ];
      const result = component['aggregateByYear'](data);
      expect(result).toEqual([
        {
          year: 2023,
          orders: 15,
          deliveries: 30,
          opportunities: 7,
          salesAmbition: 22,
          onTopCapacityForecast: 12,
          onTopOrder: 4,
          salesPlan: 18,
        },
      ]);
    });
  });

  describe('createBarSeries', () => {
    it('should create a bar series for a given KPI and data', () => {
      const data: YearlyChartEntry[] = [
        {
          year: 2023,
          orders: 15,
          deliveries: 30,
          opportunities: 7,
          salesAmbition: 22,
          onTopCapacityForecast: 12,
          onTopOrder: 4,
          salesPlan: 18,
        },
      ];
      const series = component['createBarSeries'](KpiValues.Orders, data);
      expect(series.name).toBe('home.chart.legend.orders');
      expect(series.data).toEqual([15]);
      expect(series.color).toBe(chartSeriesConfig[KpiValues.Orders].color);
    });
  });

  describe('createDummySalesPlanSeries', () => {
    it('should create a dummy sales plan series for tooltip rendering', () => {
      const data: YearlyChartEntry[] = [
        {
          year: 2023,
          orders: 15,
          deliveries: 30,
          opportunities: 7,
          salesAmbition: 22,
          onTopCapacityForecast: 12,
          onTopOrder: 4,
          salesPlan: 18,
        },
      ];
      const series = component['createDummySalesPlanSeries'](data);
      expect(series.name).toBe('home.chart.legend.salesPlan');
      expect(series.data).toEqual([18]);
      expect(series.itemStyle.opacity).toBe(0);
    });
  });
});
