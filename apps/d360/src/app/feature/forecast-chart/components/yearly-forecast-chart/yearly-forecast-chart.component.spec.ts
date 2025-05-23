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
          bwDelta: 0,
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
          bwDelta: 0,
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
          bwDelta: 0,
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
          bwDelta: 10,
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
          bwDelta: 5,
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
          bwDelta: 10,
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
          bwDelta: 5,
        },
      ];
      const result = component['aggregateByYear'](data);
      expect(result).toEqual([
        {
          year: 2023,
          orders: 15,
          deliveries: 30,
          opportunities: 7,
          salesAmbition: {
            actualValue: 22,
            value: 22,
          },
          onTopCapacityForecast: 12,
          onTopOrder: 4,
          salesPlan: 18,
          bwDelta: {
            actualValue: 15,
            value: 15,
          },
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
          bwDelta: 20,
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
          bwDelta: 16,
        },
      ];
      const series = component['createDummySalesPlanSeries'](data);
      expect(series.name).toBe('home.chart.legend.salesPlan');
      expect(series.data).toEqual([18]);
      expect((series as any).itemStyle.opacity).toBe(0);
    });
  });

  describe('boundaryGap', () => {
    it('should set boundaryGap to true', () => {
      expect(component['boundaryGap']).toBe(true);
    });
  });

  describe('createSeries with includeSalesData', () => {
    it('should include BwDelta series when includeSalesData returns true', () => {
      jest.spyOn(component as any, 'includeSalesData').mockReturnValue(true);

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
          bwDelta: 10,
        },
      ];

      const series = component['createSeries'](data);
      expect(series[1].kpi).toBe(KpiValues.BwDelta);
      expect(series.length).toBe(9); // All 8 series + BwDelta
    });

    it('should not include BwDelta series when includeSalesData returns false', () => {
      jest.spyOn(component as any, 'includeSalesData').mockReturnValue(false);

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
          bwDelta: 10,
        },
      ];

      const series = component['createSeries'](data);
      expect(series[0].kpi).toBe(KpiValues.Deliveries);
      expect(series.length).toBe(8); // 7 bar series + 1 dummy without BwDelta
    });
  });

  describe('aggregateByYear with negative values', () => {
    it('should clean up negative values for salesAmbition and bwDelta', () => {
      const data: MonthlyChartEntry[] = [
        {
          yearMonth: '2023-01',
          orders: 10,
          deliveries: 20,
          opportunities: 5,
          salesAmbition: -15, // Negative value
          onTopCapacityForecast: 8,
          onTopOrder: 3,
          salesPlan: 12,
          bwDelta: -10, // Negative value
        },
      ];

      const result = component['aggregateByYear'](data);

      // Negative values should be cleaned up (value = 0, but actualValue preserves the negative)
      expect((result[0].salesAmbition as any).value).toBe(0);
      expect((result[0].salesAmbition as any).actualValue).toBe(-15);
      expect((result[0].bwDelta as any).value).toBe(0);
      expect((result[0].bwDelta as any).actualValue).toBe(-10);
    });

    it('should handle null values in optional fields', () => {
      const data: MonthlyChartEntry[] = [
        {
          yearMonth: '2023-01',
          orders: 10,
          deliveries: 20,
          opportunities: 5,
          salesAmbition: 15,
          onTopCapacityForecast: 8,
          onTopOrder: 3,
          salesPlan: null,
          bwDelta: null,
        },
      ];

      const result = component['aggregateByYear'](data);
      expect(result[0].salesPlan as any).toBe(0);
      expect((result[0].bwDelta as any).actualValue).toBe(0);
      expect((result[0].bwDelta as any).value).toBe(0);
    });
  });
});
