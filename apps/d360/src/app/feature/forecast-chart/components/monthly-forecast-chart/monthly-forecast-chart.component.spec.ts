import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SeriesOption } from 'echarts';
import { YAXisOption } from 'echarts/types/dist/shared';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import ResizeObserver from 'resize-observer-polyfill';

import { MonthlyForecastChartComponent } from './monthly-forecast-chart.component';

global.ResizeObserver = ResizeObserver;

describe('MonthlyForecastChartComponent', () => {
  let spectator: Spectator<MonthlyForecastChartComponent>;
  const createComponent = createComponentFactory({
    component: MonthlyForecastChartComponent,
    imports: [NgxEchartsModule],
    providers: [
      {
        provide: NGX_ECHARTS_CONFIG,
        useValue: { echarts: () => import('echarts') },
      },
    ],
  });

  const testData = [
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
  ];

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
    spectator = createComponent({
      props: {
        data: testData,
        toggledKpis: {},
      },
    });

    const options = spectator.component['chartOptions'];
    expect(options).toBeDefined();

    const xAxisArray = options.xAxis as any;
    expect(xAxisArray.data).toEqual(['01/2021', '02/2021']);

    const seriesArray = options.series as echarts.EChartsOption['series'][];
    expect(seriesArray.length).toBeGreaterThan(0);

    const deliveriesSeries = seriesArray.find(
      (series: any) => series.kpi === 'deliveries'
    ) as SeriesOption;
    expect(deliveriesSeries).toBeDefined();
    expect(deliveriesSeries.data).toEqual([100, 110]);
  });

  it('should filter out toggled KPIs from the chart series', () => {
    // Toggling 'orders' KPI to hide it
    const toggledKpis = {
      orders: true,
    };

    spectator = createComponent({
      props: {
        data: testData,
        toggledKpis,
      },
    });

    const series = spectator.component['chartOptions'].series as SeriesOption[];
    const ordersSeries = series.find((s: any) => s.kpi === 'orders');
    expect(ordersSeries).toBeUndefined();

    const deliveriesSeries = series.find((s: any) => s.kpi === 'deliveries');
    expect(deliveriesSeries).toBeDefined();
  });

  it('renders localized data on the yAxis with default EN locale', () => {
    spectator = createComponent({
      props: {
        data: testData,
        toggledKpis: {},
      },
    });

    const options = spectator.component['chartOptions'];

    const yAxisOptions = options.yAxis as YAXisOption;
    // @ts-expect-error TS doesn't correctly infer the type of axisLabel
    expect(yAxisOptions?.axisLabel['formatter']).toBeDefined();

    // @ts-expect-error TS doesn't correctly infer the type of axisLabel
    const formatter = yAxisOptions.axisLabel['formatter'];
    const result = formatter(1234.56);
    expect(result).toMatch('1,234.56');
  });

  it('renders localized data on the yAxis with DE locale', () => {
    spectator = createComponent({
      props: {
        data: testData,
        toggledKpis: {},
      },
    });

    const translocoLocaleService = spectator.inject(TranslocoLocaleService);

    translocoLocaleService.setLocale('de-DE');

    const options = spectator.component['chartOptions'];

    const yAxisOptions = options.yAxis as YAXisOption;
    // @ts-expect-error TS doesn't correctly infer the type of axisLabel
    expect(yAxisOptions?.axisLabel['formatter']).toBeDefined();

    // @ts-expect-error TS doesn't correctly infer the type of axisLabel
    const formatter = yAxisOptions.axisLabel['formatter'];
    const result = formatter(1234.56);
    expect(result).toMatch('1.234,56');
  });

  it('should update chartOptions when inputs change', () => {
    const initialData = [
      {
        yearMonth: '2021-03',
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

    let series = spectator.component['chartOptions'].series as SeriesOption[];
    expect(series.find((s: any) => s.kpi === 'orders')).toBeDefined();

    spectator.setInput('toggledKpis', { orders: true });
    series = spectator.component['chartOptions'].series as SeriesOption[];
    expect(series.find((s: any) => s.kpi === 'orders')).toBeUndefined();
  });
});
