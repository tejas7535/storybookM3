import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { LineChartComponent } from './line-chart.component';
window.ResizeObserver = resize_observer_polyfill;

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let spectator: Spectator<LineChartComponent>;

  const createComponent = createComponentFactory({
    component: LineChartComponent,
    imports: [
      ReactiveComponentModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
    ],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set current year', () => {
      const current = new Date().getFullYear();
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.currentYear).toEqual(current);
    });
  });

  describe('getXAxisData', () => {
    test('should return correct data', () => {
      const dummyDate = new Date();
      component.getDateInMonths = jest.fn(() => dummyDate);
      component.getLastTwoDigitsOfYear = jest.fn(() => '21');
      component.getHumanReadableMonth = jest.fn(() => 1);

      const result = component.getXAxisData();

      expect(component.getDateInMonths).toHaveBeenCalledTimes(5);
      expect(component.getLastTwoDigitsOfYear).toHaveBeenCalledTimes(6);
      expect(component.getHumanReadableMonth).toHaveBeenCalledTimes(6);
      expect(result).toEqual([`1/21`, `1/21`, `1/21`, `1/21`, `1/21`, `1/21`]);
    });
  });

  describe('getDateInMonths', () => {
    test('should return date in x months', () => {
      const refDate = new Date(1_620_811_183_000); // 12.05.2021
      const expected = new Date(1_607_761_183_000); // 12.12.2020

      const result = component.getDateInMonths(refDate, -5);

      expect(result.getFullYear()).toEqual(expected.getFullYear());
      expect(result.getMonth()).toEqual(expected.getMonth());
    });
  });

  describe('getLastTwoDigitsOfYear', () => {
    test('should return two last digits of year of provided date', () => {
      const date = new Date(1_620_811_183_000); // 12.05.2021

      const result = component.getLastTwoDigitsOfYear(date);

      expect(result).toEqual('21');
    });
  });

  describe('getHumanReadableMonth', () => {
    test('should return readable month non zero based', () => {
      const date = new Date(1_620_811_183_000); // 12.05.2021

      const result = component.getHumanReadableMonth(date);

      expect(result).toEqual(5);
    });
  });
});
