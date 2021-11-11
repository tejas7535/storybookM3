import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedModule } from '../../shared.module';
import { DoughnutChartData } from '../models/doughnut-chart-data.model';
import { SolidDoughnutChartComponent } from './solid-doughnut-chart.component';
import * as doughnutConfig from './solid-doughnut-chart.config';

jest.mock('./solid-doughnut-chart.config', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  ...jest.requireActual<any>('./solid-doughnut-chart.config'),
  createSolidDoughnutChartBaseOptions: jest.fn(),
  createSolidDoughnutChartSeries: jest.fn(),
  createMediaQueries: jest.fn(),
}));

describe('SolidDoughnutChartComponent', () => {
  let component: SolidDoughnutChartComponent;
  let spectator: Spectator<SolidDoughnutChartComponent>;

  const createComponent = createComponentFactory({
    component: SolidDoughnutChartComponent,
    detectChanges: false,
    imports: [
      SharedModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialConfig', () => {
    test('should set base options', () => {
      const config = {
        title: '2021',
        subTitle: 'Top 5 Reasons why people left',
      };

      component.setCurrentData = jest.fn();

      component.initialConfig = config;

      expect(
        doughnutConfig.createSolidDoughnutChartSeries
      ).toHaveBeenCalledWith(config.title);
      expect(doughnutConfig.createMediaQueries).toHaveBeenCalled();
      expect(
        doughnutConfig.createSolidDoughnutChartBaseOptions
      ).toHaveBeenCalledWith(config);
      expect(component.setCurrentData).toHaveBeenCalled();
    });
  });

  describe('set data', () => {
    test('should update series in merge options', () => {
      const data = [
        { value: 23, name: 'First' },
        { value: 34, name: 'Second' },
        { value: 12, name: 'Third' },
      ];

      component.data = data;

      expect((component.mergeOptions.series as any[])[0].data).toHaveLength(3);
      expect((component.mergeOptions.series as any[])[0].data).toContain(
        data[0]
      );
      expect((component.mergeOptions.series as any[])[0].data).toContain(
        data[1]
      );
      expect((component.mergeOptions.series as any[])[0].data).toContain(
        data[2]
      );
    });

    test('should update legend in merge options', () => {
      const data = [
        { value: 23, name: 'First' },
        { value: 34, name: 'Second' },
        { value: 12, name: 'Third' },
      ];

      component.data = data;

      expect(component.mergeOptions.legend).toBeDefined();
    });
  });

  describe('setTitlePosition', () => {
    test('should set title centered', () => {
      component.mergeOptions = { title: { top: 0, left: 2 } };
      component.setTitlePosition(true);

      expect(
        (component.mergeOptions.title as { top: string | number }).top
      ).toEqual('middle');
      expect(
        (component.mergeOptions.title as { left: string | number }).left
      ).toEqual('center');
    });

    test('should set title top and left', () => {
      component.mergeOptions = { title: { top: 0, left: 2 } };
      component.setTitlePosition(false);

      expect(
        (component.mergeOptions.title as { top: string | number }).top
      ).toEqual('top');
      expect(
        (component.mergeOptions.title as { left: string | number }).left
      ).toEqual('auto');
    });
  });

  describe('setCurrentData', () => {
    test('should set data if set', () => {
      const data: DoughnutChartData[] = [];
      component._data = data;
      component.setData = jest.fn();

      component.setCurrentData();

      expect(component.setData).toHaveBeenCalledWith(data);
    });

    test('should not set data if not set', () => {
      component.setData = jest.fn();

      component.setCurrentData();

      expect(component.setData).not.toHaveBeenCalled();
    });
  });
});
