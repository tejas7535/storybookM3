import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ECharts, EChartsOption, SeriesOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Color } from '../../models/color';
import { SharedModule } from '../../shared.module';
import { LegendSelectAction } from '../models';
import { DoughnutConfig } from '../models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../models/doughnut-series-config.model';
import { LooseDoughnutChartComponent } from './loose-doughnut-chart.component';
import * as doughnutChartConfig from './loose-doughnut-chart.config';

jest.mock('./loose-doughnut-chart.config', () => ({
  ...(jest.requireActual('./loose-doughnut-chart.config') as any),
  createPieChartBaseOptions: jest.fn(() => ({})),
  createPieChartSeries: jest.fn(() => ({})),
}));

describe('LooseDoughnutChartComponent', () => {
  let component: LooseDoughnutChartComponent;
  let spectator: Spectator<LooseDoughnutChartComponent>;

  const createComponent = createComponentFactory({
    component: LooseDoughnutChartComponent,
    detectChanges: false,
    imports: [
      SharedModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set initialConfig', () => {
    test('should set correct initial config', () => {
      const series = [
        new DoughnutSeriesConfig([{ value: 99 }], 'demo data 1', Color.LIME),
      ];

      component.createSeriesOptions = jest.fn(() => series);

      component.initialConfig = series;

      expect(component.options).toEqual({
        series,
      });
      expect(component.createSeriesOptions).toHaveBeenCalledWith(
        new DoughnutConfig('', series)
      );
      expect(doughnutChartConfig.createPieChartBaseOptions).toHaveBeenCalled();
    });
  });

  describe('set data', () => {
    test('should set merge options', () => {
      const data = new DoughnutConfig('Demo', [
        new DoughnutSeriesConfig([{ value: 99 }], 'demo data 1', 'red'),
      ]);
      component.resetSelection = jest.fn();
      const expected: EChartsOption = {
        series: [{}] as SeriesOption[],
        title: { text: '99', subtext: 'Demo' },
      };

      component.data = data;

      expect(component.mergeOptions).toEqual(expected);
      expect(component.resetSelection).toHaveBeenCalled();
    });
  });

  describe('legendSelectAction', () => {
    test('should set legend', () => {
      const action: LegendSelectAction = {};
      component.echartsInstance = { setOption: () => {} } as unknown as ECharts;
      component.echartsInstance.setOption = jest.fn();

      component.legendSelectAction = action;

      expect(component.echartsInstance.setOption).toHaveBeenCalledWith({
        legend: {
          selected: action,
        },
      });
    });
  });

  describe('createSeriesOptions', () => {
    test('should map correct series', () => {
      const color = Color.LIME;
      const data = new DoughnutConfig('Demo', [
        new DoughnutSeriesConfig([{ value: 99 }], 'demo data 1', color),
      ]);

      const result = component.createSeriesOptions(data);

      expect(doughnutChartConfig.createPieChartSeries).toHaveBeenCalledWith(
        ['60%', '70%'],
        data.series[0].data[0].value,
        data.series[0].data[0].value,
        color,
        data.name,
        data.series[0].title
      );
      expect(result).toEqual([{}]);
    });
  });

  describe('resetSelection', () => {
    test('should dispatch legend all select action', () => {
      component.echartsInstance = {
        dispatchAction: () => {},
      } as unknown as ECharts;
      component.echartsInstance.dispatchAction = jest.fn();

      component.resetSelection();

      expect(component.echartsInstance.dispatchAction).toHaveBeenCalledWith({
        type: 'legendAllSelect',
      });
    });
  });

  describe('onChartInit', () => {
    test('should assign echarts object', () => {
      const echartsInstance = {
        dispatchAction: () => {},
      } as unknown as ECharts;

      component.onChartInit(echartsInstance);

      expect(component.echartsInstance).toBe(echartsInstance);
    });
  });
});
