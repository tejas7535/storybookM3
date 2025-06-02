import { Component } from '@angular/core';

import { SeriesOption, TooltipComponentOption } from 'echarts';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';

import { dimmedGrey } from '../../../shared/styles/colors';
import { Stub } from '../../../shared/test/stub.class';
import { BaseForecastChartComponent } from './base-forecast-chart.component';

@Component({
  selector: 'd360-any-test',
  template: '',
})
class TestComponent extends BaseForecastChartComponent {
  protected createSeries(): SeriesOption[] {
    return [];
  }
  protected formatXAxisData(): string[] | number[] {
    return [];
  }
}

describe('BaseForecastChartComponent', () => {
  let component: BaseForecastChartComponent;

  beforeEach(() => {
    component = Stub.getForEffect<TestComponent>({
      component: TestComponent,
      imports: [NgxEchartsModule],
      providers: [
        {
          provide: NGX_ECHARTS_CONFIG,
          useValue: { echarts: () => import('echarts') },
        },
      ],
    });
  });

  describe('constructor', () => {
    it('should initialize chartOptions signal', () => {
      const spy1 = jest.spyOn(component as any, 'generateChartOptions');
      const spy2 = jest.spyOn(component['chartOptions'], 'set');
      Stub.setInput('data', [{ yearMonth: '2023-01', orders: 10 }]);
      Stub.setInput('toggledKpis', { orders: false });
      Stub.detectChanges();

      expect(spy1).toHaveBeenCalledWith(
        [{ yearMonth: '2023-01', orders: 10 }],
        { orders: false }
      );
      expect(spy2).toHaveBeenCalledWith({
        animationDuration: 1500,
        axisPointer: { lineStyle: { type: 'solid' } },
        grid: { bottom: '30px', left: '120px', right: '30px', top: '10px' },
        series: [],
        tooltip: {
          alwaysShowContent: false,
          axisPointer: {
            axis: 'auto',
            label: { backgroundColor: '#fff' },
            type: 'line',
          },
          formatter: expect.any(Function),
          trigger: 'axis',
        },
        xAxis: {
          boundaryGap: false,
          data: [],
          splitLine: {
            lineStyle: { color: '#646464', opacity: 0.2, type: 'dotted' },
            show: true,
          },
          type: 'category',
        },
        yAxis: {
          axisLabel: { formatter: expect.any(Function) },
          axisLine: { lineStyle: { color: '#646464' }, show: true },
          splitLine: {
            lineStyle: { color: '#646464', opacity: 0.2, type: 'dotted' },
            show: true,
          },
          type: 'value',
        },
      });
    });
  });

  describe('includeSalesData input', () => {
    it('should have default value of false', () => {
      expect(component.includeSalesData()).toBe(false);
    });

    it('should update when set', () => {
      Stub.setInput('includeSalesData', true);
      expect(component.includeSalesData()).toBe(true);
    });

    it('should trigger chart options regeneration when changed', () => {
      const spy = jest.spyOn(component as any, 'generateChartOptions');
      Stub.setInput('data', [{ yearMonth: '2023-01', orders: 10 }]);
      Stub.setInput('toggledKpis', { orders: false });

      spy.mockClear();

      Stub.setInput('includeSalesData', true);
      Stub.detectChanges();

      expect(spy).toHaveBeenCalledWith([{ yearMonth: '2023-01', orders: 10 }], {
        orders: false,
      });
    });
  });

  describe('generateChartOptions', () => {
    it('should return null if data or toggledKpis are not provided', () => {
      const result = (component as any).generateChartOptions(null, null);
      expect(result).toBeNull();
    });

    it('should generate chart options with filtered series', () => {
      jest.spyOn(component as any, 'createSeries').mockReturnValue([
        { kpi: 'orders', type: 'bar' },
        { kpi: 'deliveries', type: 'bar' },
      ]);
      const data = [{ yearMonth: '2023-01', orders: 10 }];
      const toggledKpis = { orders: true };

      const result = (component as any).generateChartOptions(data, toggledKpis);

      expect(result.series).toEqual([{ kpi: 'deliveries', type: 'bar' }]);
      expect(result.grid).toEqual({
        left: '120px',
        right: '30px',
        top: '10px',
        bottom: '30px',
      });
    });
  });

  describe('createXAxis', () => {
    it('should create an X-axis configuration', () => {
      jest
        .spyOn(component as any, 'formatXAxisData')
        .mockImplementation((data) => data);

      const data = ['2023', '2024'];
      const result = (component as any).createXAxis(data);

      expect(result).toEqual({
        type: 'category',
        boundaryGap: false,
        data,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted',
            color: dimmedGrey,
            opacity: 0.2,
          },
        },
      });
    });
  });

  describe('createYAxis', () => {
    it('should create a Y-axis configuration', () => {
      const result = (component as any).createYAxis();
      jest
        .spyOn(component['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('1.000');

      expect(result).toEqual({
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: dimmedGrey,
          },
        },
        axisLabel: {
          formatter: expect.any(Function),
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted',
            color: dimmedGrey,
            opacity: 0.2,
          },
        },
      });

      const formatter = result.axisLabel.formatter;
      expect(formatter(1000)).toBe('1.000');
    });
  });

  describe('createTooltip', () => {
    it('should create a tooltip configuration with a custom formatter', () => {
      jest
        .spyOn(component['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('1.000');
      const tooltip: TooltipComponentOption = component['createTooltip']();
      expect(tooltip.trigger).toBe('axis');
      expect(tooltip.alwaysShowContent).toBe(false);
      expect(tooltip.axisPointer).toEqual({
        axis: 'auto',
        type: 'line',
        label: {
          backgroundColor: '#fff',
        },
      });

      const formatter = tooltip.formatter as any;
      const mockParams = [
        {
          name: '2023',
          marker: '<span style="color: red;">●</span>',
          color: 'red',
          seriesName: 'Orders',
          data: { actualValue: 1000 },
        },
        {
          name: '2023',
          marker: null,
          color: 'blue',
          seriesName: 'Deliveries',
          data: { actualValue: 2000 },
        },
      ];

      const result = formatter(mockParams, '');
      expect(result).toContain('2023<br/>');
      expect(result).toContain('<span style="color: red;">●</span> Orders');
      expect(result).toContain('1.000');
      expect(result).toContain(
        '<span class="inline-block mr-1 rounded-full w-2.5 h-2.5 bg-[blue]"></span> Deliveries'
      );
    });
  });
});
