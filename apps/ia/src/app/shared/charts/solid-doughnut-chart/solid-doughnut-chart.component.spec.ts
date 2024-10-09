import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  ECharts,
  EChartsOption,
  LegendComponentOption,
  SeriesOption,
} from 'echarts';
import { LegendOption } from 'echarts/types/dist/shared';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedModule } from '../../shared.module';
import { LegendSelectAction, SolidDoughnutChartConfig } from '../models';
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
      const config: SolidDoughnutChartConfig = {
        title: '2021',
        subTitle: 'Top 5 Reasons why people left',
        side: 'left',
      };

      component.setCurrentData = jest.fn();

      component.initialConfig = config;

      expect(
        doughnutConfig.createSolidDoughnutChartSeries
      ).toHaveBeenCalledWith('left', config.subTitle);
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
      component.options = { series: [{ data: [] }] } as EChartsOption;

      component.data = data;

      expect(
        (component.mergeOptions.series as SeriesOption[])[0].data
      ).toHaveLength(3);
      expect(
        (component.mergeOptions.series as SeriesOption[])[0].data
      ).toContain(data[0]);
      expect(
        (component.mergeOptions.series as SeriesOption[])[0].data
      ).toContain(data[1]);
      expect(
        (component.mergeOptions.series as SeriesOption[])[0].data
      ).toContain(data[2]);
    });
  });

  describe('setSelectedReasons', () => {
    test('should set active and inactive reaons', () => {
      component._data = [
        { value: 23, name: 'First' },
        { value: 34, name: 'Second' },
        { value: 12, name: 'Third' },
      ];
      component.children = [
        {
          reason: 'First',
          children: [
            { value: 23, name: 'First' },
            { value: 34, name: 'Second' },
            { value: 12, name: 'Third' },
          ],
        },
      ];
      component.mergeOptions = {
        series: [{ data: component.data }, { data: [] }],
      };

      component.setSelectedReasons('First');

      expect(component._data[0].itemStyle.opacity).toBe(
        component.OPACITY_ACTIVE
      );
      expect(component._data[1].itemStyle.opacity).toBe(
        component.OPACITY_INACTIVE
      );
      expect(component._data[2].itemStyle.opacity).toBe(
        component.OPACITY_INACTIVE
      );
    });
  });

  describe('removeChildrenOnToggle', () => {
    test('should remove children when clicked on the same reason', () => {
      component._data = [
        { value: 23, name: 'First' },
        { value: 34, name: 'Second' },
        { value: 12, name: 'Third' },
      ];
      const options = {
        series: [
          { data: component.data },
          { id: 'detailedReaons', data: component.children },
        ],
      };
      component.options = options;
      component.mergeOptions = options;
      component.selected = 'First';

      component.removeChildrenOnToggle('First');

      const result: DoughnutChartData[] = (
        component.mergeOptions.series as SeriesOption[]
      )[1].data as DoughnutChartData[];

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        value: 0,
        name: '',
        itemStyle: { color: 'transparent' },
      });
    });
  });

  describe('manageOnClickEvent', () => {
    test('should set selected data point', () => {
      component._data = [
        { value: 23, name: 'First' },
        { value: 34, name: 'Second' },
        { value: 12, name: 'Third' },
      ];
      component.children = [
        {
          reason: 'First',
          children: [
            { value: 23, name: 'First' },
            { value: 34, name: 'Second' },
            { value: 12, name: 'Third' },
          ],
        },
      ];
      component.mergeOptions = {
        series: [{ data: component.data }, { data: [] }],
      };
      const event = { data: { name: 'First' } };
      component.manageSelectedDataPoint = jest.fn();
      component.echartsInstance = {
        setOption: jest.fn(),
      } as unknown as ECharts;

      component.manageOnClickEvent(event);

      expect(component.manageSelectedDataPoint).toHaveBeenCalledWith('First');
      expect(component.echartsInstance.setOption).toHaveBeenCalledWith(
        component.mergeOptions
      );
      expect((component.mergeOptions.legend as LegendOption).data.length).toBe(
        4
      );
      expect(
        ((component.mergeOptions.legend as LegendOption).data[0] as any)
          .textStyle
      ).toEqual({ fontWeight: 'bold' });
      expect(
        ((component.mergeOptions.legend as LegendOption).data[0] as any).name
      ).toEqual('First');
      expect(
        (component.mergeOptions.legend as LegendOption).data[1] as string
      ).toEqual('First');
      expect(
        ((component.mergeOptions.legend as LegendOption).data[1] as any)
          .textStyle
      ).toBeUndefined();
      expect(
        (component.mergeOptions.legend as LegendOption).data[2] as string
      ).toEqual('Second');
      expect(
        ((component.mergeOptions.legend as LegendOption).data[2] as any)
          .textStyle
      ).toBeUndefined();
      expect(
        (component.mergeOptions.legend as LegendOption).data[3] as string
      ).toEqual('Third');
      expect(
        ((component.mergeOptions.legend as LegendOption).data[3] as any)
          .textStyle
      ).toBeUndefined();
    });

    test('should unset the legend when 2nd click on the same data', () => {
      component._data = [
        { value: 23, name: 'First' },
        { value: 34, name: 'Second' },
        { value: 12, name: 'Third' },
      ];
      component.children = [
        {
          reason: 'First',
          children: [
            { value: 23, name: 'First' },
            { value: 34, name: 'Second' },
            { value: 12, name: 'Third' },
          ],
        },
      ];
      component.mergeOptions = {
        series: [{ data: component.data }, { data: [] }],
      };
      const event = { data: { name: 'First' } };
      component.manageSelectedDataPoint = jest.fn();
      component.echartsInstance = {
        setOption: jest.fn(),
      } as unknown as ECharts;
      component.selected = 'First';

      component.manageOnClickEvent(event);

      expect(component.manageSelectedDataPoint).toHaveBeenCalledWith('First');
      expect(component.echartsInstance.setOption).toHaveBeenCalledWith(
        component.mergeOptions
      );
      expect(
        (component.mergeOptions.legend as LegendComponentOption).data
      ).toBeUndefined();
    });

    test('should not set selected data point if clicked item is not a reason', () => {
      component._data = [
        { value: 23, name: 'First' },
        { value: 34, name: 'Second' },
        { value: 12, name: 'Third' },
      ];
      const event = { data: { name: 'Fourth' } };
      component.manageSelectedDataPoint = jest.fn();
      component.echartsInstance = {
        setOption: jest.fn(),
      } as unknown as ECharts;

      component.manageOnClickEvent(event);

      expect(component.manageSelectedDataPoint).not.toHaveBeenCalled();
      expect(component.echartsInstance.setOption).not.toHaveBeenCalled();
    });

    test('should not set selected data point if clicked item is not a data', () => {
      component._data = [
        { value: 23, name: 'First' },
        { value: 34, name: 'Second' },
        { value: 12, name: 'Third' },
      ];
      const event = {};
      component.manageSelectedDataPoint = jest.fn();
      component.echartsInstance = {
        setOption: jest.fn(),
      } as unknown as ECharts;

      component.manageOnClickEvent(event);

      expect(component.manageSelectedDataPoint).not.toHaveBeenCalled();
      expect(component.echartsInstance.setOption).not.toHaveBeenCalled();
    });
  });

  describe('manageSelectedDataPoint', () => {
    test('should manage selected data point when previous selection equal', () => {
      component.setSelectedReasons = jest.fn();
      component.removeChildrenOnToggle = jest.fn();
      component.echartsInstance = {
        setOption: jest.fn(),
      } as unknown as ECharts;
      component.selected = 'First';

      component.manageSelectedDataPoint('First');

      expect(component.setSelectedReasons).toHaveBeenCalledWith('First');
      expect(component.removeChildrenOnToggle).toHaveBeenCalledWith('First');
      expect(component.echartsInstance.setOption).toHaveBeenCalledWith(
        component.mergeOptions
      );
      expect(component.selected).toBeUndefined();
    });

    test('should manage selected data point when previous selection different', () => {
      component.setSelectedReasons = jest.fn();
      component.removeChildrenOnToggle = jest.fn();
      component.echartsInstance = {
        setOption: jest.fn(),
      } as unknown as ECharts;
      component.selected = 'Second';

      component.manageSelectedDataPoint('First');

      expect(component.setSelectedReasons).toHaveBeenCalledWith('First');
      expect(component.removeChildrenOnToggle).toHaveBeenCalledWith('First');
      expect(component.echartsInstance.setOption).toHaveBeenCalledWith(
        component.mergeOptions
      );
      expect(component.selected).toEqual('First');
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

  describe('set legendSelectAction', () => {
    test('should set option in echarts instance when action defined', () => {
      component.echartsInstance = { setOption: () => {} } as unknown as ECharts;
      const legendAction: LegendSelectAction = { gold: true };
      component.echartsInstance.setOption = jest.fn();

      component.legendSelectAction = legendAction;

      expect(component.echartsInstance.setOption).toHaveBeenLastCalledWith({
        legend: {
          selected: legendAction,
        },
      });
    });

    test('should not set option in echarts instance when action undefined', () => {
      component.echartsInstance = { setOption: () => {} } as unknown as ECharts;
      const legendAction: LegendSelectAction = undefined;
      component.echartsInstance.setOption = jest.fn();

      component.legendSelectAction = legendAction;

      expect(component.echartsInstance.setOption).not.toHaveBeenCalled();
    });
  });

  describe('resetSelection', () => {
    test('should select all legend items', () => {
      component.echartsInstance = {
        dispatchAction: jest.fn(),
      } as unknown as ECharts;

      component.resetSelection();

      expect(component.echartsInstance.dispatchAction).toHaveBeenCalledWith({
        type: 'legendAllSelect',
      });
    });
  });

  describe('resetChart', () => {
    test('should reset chart', () => {
      component.selected = 'A';
      component.mergeOptions = {
        series: [{ data: [{ name: 'A' }, { name: 'B' }] }],
      };
      component.manageOnClickEvent = jest.fn();
      component.echartsInstance = {
        dispatchAction: jest.fn(),
      } as unknown as ECharts;

      component.resetChart();

      expect(component.manageOnClickEvent).toHaveBeenCalledWith({
        data: { name: 'A' },
      });
      expect(component.echartsInstance.dispatchAction).toHaveBeenCalledWith({
        type: 'unselect',
        seriesIndex: 0,
        dataIndex: 0,
      });
      expect(component.echartsInstance.dispatchAction).toHaveBeenCalledWith({
        type: 'unselect',
        seriesIndex: 0,
        dataIndex: 1,
      });
      expect(component.echartsInstance.dispatchAction).toHaveBeenCalledTimes(2);
    });
  });
});
