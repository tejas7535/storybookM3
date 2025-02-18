import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SeriesOption } from 'echarts';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import ResizeObserver from 'resize-observer-polyfill';

import { YearlyForecastChartComponent } from './yearly-forecast-chart.component';

global.ResizeObserver = ResizeObserver;

describe('YearlyForecastChartComponent', () => {
  let spectator: Spectator<YearlyForecastChartComponent>;
  const createComponent = createComponentFactory({
    component: YearlyForecastChartComponent,
    imports: [NgxEchartsModule],
    providers: [
      {
        provide: NGX_ECHARTS_CONFIG,
        useValue: { echarts: () => import('echarts') },
      },
    ],
  });

  it('should create the component', () => {
    spectator = createComponent({
      props: {
        data: [],
        toggledKpis: {},
      },
    });
    expect(spectator.component).toBeTruthy();
  });

  it('should generate chartOptions when data is provided', () => {
    const mockData = [
      {
        yearMonth: '2021-01',
        deliveries: 100,
        orders: 200,
        onTopOrder: 50,
        salesAmbition: 300,
        onTopCapacityForecast: 400,
        opportunities: 150,
        rollingSalesForecast: 250,
      },
      {
        yearMonth: '2021-02',
        deliveries: 110,
        orders: 210,
        onTopOrder: 60,
        salesAmbition: 310,
        onTopCapacityForecast: 410,
        opportunities: 160,
        rollingSalesForecast: 260,
      },
      {
        yearMonth: '2022-01',
        deliveries: 110,
        orders: 210,
        onTopOrder: 60,
        salesAmbition: 310,
        onTopCapacityForecast: 410,
        opportunities: 160,
        rollingSalesForecast: 260,
      },
    ];

    spectator = createComponent({
      props: {
        data: mockData,
        toggledKpis: {},
      },
    });

    const options = spectator.component['chartOptions']();
    expect(options).toBeDefined();

    const xAxisData = options.xAxis as any;
    expect(xAxisData.data).toEqual([2021, 2022]);

    const series = spectator.component['chartOptions']()
      .series as SeriesOption[];

    expect(series.length).toBeGreaterThan(0);
    const deliveriesSeries = series.find((s: any) => s.kpi === 'deliveries');
    expect(deliveriesSeries).toBeDefined();
    expect(deliveriesSeries.data).toEqual([210, 110]);
  });

  it('should filter out toggled KPIs from the chart series', () => {
    const mockData = [
      {
        yearMonth: '2021-01',
        deliveries: 100,
        orders: 200,
        onTopOrder: 50,
        salesAmbition: 300,
        onTopCapacityForecast: 400,
        opportunities: 150,
        rollingSalesForecast: 250,
      },
    ];

    const toggledKpis = {
      orders: true,
    };

    spectator = createComponent({
      props: {
        data: mockData,
        toggledKpis,
      },
    });

    const series = spectator.component['chartOptions']()
      .series as SeriesOption[];

    const ordersSeries = series.find((s: any) => s.kpi === 'orders');
    expect(ordersSeries).toBeUndefined();

    const deliveriesSeries = series.find((s: any) => s.kpi === 'deliveries');
    expect(deliveriesSeries).toBeDefined();
  });

  it('should update chartOptions when inputs change', () => {
    const initialData = [
      {
        yearMonth: '2022-01',
        deliveries: 500,
        orders: 600,
        onTopOrder: 70,
        salesAmbition: 800,
        onTopCapacityForecast: 1000,
        opportunities: 900,
        rollingSalesForecast: 700,
      },
    ];

    spectator = createComponent({
      props: {
        data: initialData,
        toggledKpis: {},
      },
    });

    let series = spectator.component['chartOptions']().series as SeriesOption[];
    expect(series.find((s: any) => s.kpi === 'orders')).toBeDefined();

    spectator.setInput('toggledKpis', { orders: true });
    series = spectator.component['chartOptions']().series as SeriesOption[];
    expect(series.find((s: any) => s.kpi === 'orders')).toBeUndefined();
  });
});
