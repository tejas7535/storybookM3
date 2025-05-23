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
      bwDelta: 50,
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
      bwDelta: 60,
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

  it('should replace negative BwDelta data with 0 and maintain the actual value in the chart', () => {
    Stub.setInputs([
      {
        property: 'data',
        value: [
          {
            yearMonth: '2021-02',
            deliveries: 110,
            orders: 210,
            onTopOrder: 60,
            salesAmbition: 310,
            onTopCapacityForecast: 410,
            opportunities: 160,
            salesPlan: 260,
            bwDelta: -75,
          },
        ],
      },
      { property: 'toggledKpis', value: {} },
      { property: 'includeSalesData', value: true },
    ]);

    Stub.detectChanges();

    const options = component['chartOptions']();
    const seriesArray = options.series as echarts.EChartsOption['series'][];

    const bwDeltaSeries = seriesArray.find(
      (series: any) => series.kpi === KpiValues.BwDelta
    ) as SeriesOption;

    expect(bwDeltaSeries.data).toEqual([{ actualValue: -75, value: 0 }]);
  });

  it('should not include BwDelta series when includeSalesData is false', () => {
    Stub.setInputs([
      { property: 'data', value: testData },
      { property: 'toggledKpis', value: {} },
      { property: 'includeSalesData', value: false },
    ]);

    Stub.detectChanges();

    const options = component['chartOptions']();
    const seriesArray = options.series as echarts.EChartsOption['series'][];

    const bwDeltaSeries = seriesArray.find(
      (series: any) => series.kpi === KpiValues.BwDelta
    ) as SeriesOption;

    expect(bwDeltaSeries).toBeUndefined();
  });

  it('should format the x-axis data using translocoLocaleService', () => {
    const mockLocalizedDates = ['01/2021', '02/2021'];
    const localizeDateSpy = jest
      .spyOn(component['translocoLocaleService'], 'localizeDate')
      .mockImplementation((date, _locale, _options) =>
        date === '2021-01' ? mockLocalizedDates[0] : mockLocalizedDates[1]
      );

    const formattedData = component['formatXAxisData'](testData);

    expect(formattedData).toEqual(mockLocalizedDates);
    expect(localizeDateSpy).toHaveBeenCalledTimes(2);
    expect(localizeDateSpy).toHaveBeenCalledWith(
      '2021-01',
      component['translocoLocaleService'].getLocale(),
      { month: '2-digit', year: 'numeric' }
    );
  });

  it('should create series with correct configuration', () => {
    const series = component['createSeries'](testData);

    expect(series.length).toBe(8); // 7 data series + reference line

    // Check if a specific series has correct configuration
    const opportunitySeries = series.find(
      (s: any) => s.kpi === KpiValues.Opportunities
    );

    expect(opportunitySeries).toBeDefined();
    expect(opportunitySeries.type).toBe('line');
    expect(opportunitySeries.stack).toBe('Total');
    expect(opportunitySeries.areaStyle.opacity).toBe(1);
    expect(opportunitySeries.data).toEqual([150, 160]);
  });

  it('should include a reference line for the current month', () => {
    Stub.setInputs([
      { property: 'data', value: testData },
      { property: 'toggledKpis', value: {} },
    ]);

    Stub.detectChanges();

    const options = component['chartOptions']();
    const seriesArray = options.series as echarts.EChartsOption['series'][];

    // Find the reference line series
    const referenceSeries = seriesArray.find(
      (s: any) => s.type === 'line' && s.markLine
    ) as any;

    expect(referenceSeries).toBeDefined();
    expect(referenceSeries?.markLine?.lineStyle?.width).toBe(1);
    expect(referenceSeries?.markLine?.lineStyle?.type).toBe('solid');
    expect(referenceSeries?.markLine?.symbol).toBe('none');
    expect(referenceSeries?.markLine?.data.length).toBe(1);
  });
});
