import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgxEchartsModule } from 'ngx-echarts';

import { Color } from '../../models/color.enum';
import { SharedModule } from '../../shared.module';
import { DoughnutChartData } from '../models/doughnut-chart-data.model';
import { SolidDoughnutChartComponent } from './solid-doughnut-chart.component';

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

      component.initialConfig = config;

      expect(component.options.backgroundColor).toEqual(Color.WHITE);
      expect(component.options.type).toEqual('pie');
      expect(component.options.title).toEqual({
        text: config.title,
        textStyle: {
          color: Color.BLACK,
          fontSize: '1.5rem',
          fontWeight: 'normal',
        },
        subtext: config.subTitle,
        subtextStyle: {
          color: Color.LIGHT_GREY,
          fontSize: '1rem',
        },
      });
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
      ).toEqual('35%');
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

  describe('setMediaQueries', () => {
    test('should set media queries', () => {
      const expectedMediaQueries = [
        {
          query: {
            minWidth: 192,
            maxWidth: 240,
          },
          option: {
            title: {
              textStyle: {
                fontSize: '1rem',
              },
              subtextStyle: {
                fontSize: '0.75rem',
              },
            },
          },
        },
      ];
      component.options = {};

      component.setMediaQueries();

      expect(component.options.media).toStrictEqual(expectedMediaQueries);
    });
  });
});
