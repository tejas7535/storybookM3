import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgxEchartsModule } from 'ngx-echarts';

import { Color } from '../../models/color.enum';
import { SharedModule } from '../../shared.module';
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
          fontSize: 20,
          fontWeight: 'normal',
        },
        subtext: config.subTitle,
        subtextStyle: {
          color: Color.LIGHT_GREY,
          fontSize: 14,
        },
        left: 'center',
        top: 'center',
      });
      expect(component.options.color).toEqual([
        Color.COLORFUL_CHART_5,
        Color.COLORFUL_CHART_4,
        Color.COLORFUL_CHART_3,
        Color.COLORFUL_CHART_2,
        Color.COLORFUL_CHART_1,
        Color.COLORFUL_CHART_0,
      ]);
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
      expect(
        (component.mergeOptions.legend as { data: any }).data
      ).toHaveLength(3);
      expect((component.mergeOptions.legend as any).data).toHaveLength(3);
      expect((component.mergeOptions.legend as any).data).toContain(
        data[2].name
      );
      expect((component.mergeOptions.legend as any).data).toContain(
        data[0].name
      );
      expect((component.mergeOptions.legend as any).data).toContain(
        data[1].name
      );
    });
  });

  describe('set titlePosition', () => {
    test('should set title position', () => {
      component.mergeOptions = { title: { top: 0 } };
      const position = 40;
      component.titlePosition = position;

      expect(
        (component.mergeOptions.title as { top: string | number }).top
      ).toEqual(position);
    });
  });

  describe('set legendHeight', () => {
    test('should set legend height', () => {
      component.mergeOptions = { legend: { height: 0 } };
      const height = 40;
      component.legendHeight = height;

      expect(
        (component.mergeOptions.legend as { height: string | number }).height
      ).toEqual(height);
    });
  });
});
