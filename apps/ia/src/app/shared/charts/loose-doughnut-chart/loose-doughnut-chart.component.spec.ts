import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Color } from '../../models/color.enum';
import { SharedModule } from '../../shared.module';
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
});
