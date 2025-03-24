import { SeriesOption } from 'echarts';
import { YAXisOption } from 'echarts/types/dist/shared';
import { MockProvider } from 'ng-mocks';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import ResizeObserver from 'resize-observer-polyfill';

import { Stub } from '../../../../shared/test/stub.class';
import { KpiValues } from '../../model';
import { MonthlyForecastChartComponent } from './monthly-forecast-chart.component';

global.ResizeObserver = ResizeObserver;

describe('MonthlyForecastChartComponent', () => {
  let component: MonthlyForecastChartComponent;

  beforeEach(() => {
    component = Stub.getForEffect<MonthlyForecastChartComponent>({
      component: MonthlyForecastChartComponent,
      imports: [NgxEchartsModule],
      providers: [
        MockProvider(
          NGX_ECHARTS_CONFIG,
          {
            echarts: jest.fn().mockReturnValue(import('echarts')),
          },
          'useValue'
        ),
      ],
    });
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
      salesPlan: 250,
    },
    {
      yearMonth: '2021-02',
      deliveries: 110,
      orders: 210,
      onTopOrder: 60,
      salesAmbition: 310,
      onTopCapacityForecast: 410,
      opportunities: 160,
      salesPlan: 260,
    },
  ];

  it('should create the component', () => {
    Stub.setInputs([
      { property: 'data', value: testData },
      { property: 'toggledKpis', value: {} },
    ]);

    Stub.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should generate chartOptions when data is provided', () => {
    Stub.setInputs([
      { property: 'data', value: testData },
      { property: 'toggledKpis', value: {} },
    ]);

    Stub.detectChanges();

    const options = component['chartOptions']();
    expect(options).toBeDefined();

    const xAxisArray = options.xAxis as any;
    expect(xAxisArray.data.length).toEqual(2);

    const seriesArray = options.series as echarts.EChartsOption['series'][];
    expect(seriesArray.length).toBeGreaterThan(0);

    const deliveriesSeries = seriesArray.find(
      (series: any) => series.kpi === 'deliveries'
    ) as SeriesOption;

    expect(deliveriesSeries).toBeDefined();
  });

  it('should filter out toggled KPIs from the chart series', () => {
    // Toggling 'orders' KPI to hide it
    const toggledKpis = {
      orders: true,
    };

    Stub.setInputs([
      { property: 'data', value: testData },
      { property: 'toggledKpis', value: toggledKpis },
    ]);

    Stub.detectChanges();

    const series = component['chartOptions']().series as SeriesOption[];
    const ordersSeries = series.find((s: any) => s.kpi === 'orders');
    expect(ordersSeries).toBeUndefined();

    const deliveriesSeries = series.find((s: any) => s.kpi === 'deliveries');
    expect(deliveriesSeries).toBeDefined();
  });

  it('renders localized data on the yAxis with default EN locale', () => {
    Stub.setInputs([
      { property: 'data', value: testData },
      { property: 'toggledKpis', value: {} },
    ]);

    Stub.detectChanges();

    const localizeNumberSpy = jest
      .spyOn(component['translocoLocaleService'], 'localizeNumber')
      .mockReturnValue('1,234.56');

    const options = component['chartOptions']();

    const yAxisOptions = options.yAxis as YAXisOption;
    // @ts-expect-error TS doesn't correctly infer the type of axisLabel
    expect(yAxisOptions?.axisLabel['formatter']).toBeDefined();

    // @ts-expect-error TS doesn't correctly infer the type of axisLabel
    const formatter = yAxisOptions.axisLabel['formatter'];

    formatter(1234.56);

    expect(localizeNumberSpy).toHaveBeenCalledWith(1234.56, 'decimal');
  });

  it('should replace negative SalesAmbition data with 0 and remain the actual value in the chart but not render them', () => {
    Stub.setInputs([
      {
        property: 'data',
        value: [
          {
            yearMonth: '2021-02',
            deliveries: 110,
            orders: 210,
            onTopOrder: 60,
            salesAmbition: -500,
            onTopCapacityForecast: 410,
            opportunities: 160,
            salesPlan: 260,
          },
        ],
      },
      { property: 'toggledKpis', value: {} },
    ]);

    Stub.detectChanges();

    const options = component['chartOptions']();
    const seriesArray = options.series as echarts.EChartsOption['series'][];

    const salesAmbitionSeries = seriesArray.find(
      (series: any) => series.kpi === KpiValues.SalesAmbition
    ) as SeriesOption;

    expect(salesAmbitionSeries.data).toEqual([{ actualValue: -500, value: 0 }]);
  });
});
