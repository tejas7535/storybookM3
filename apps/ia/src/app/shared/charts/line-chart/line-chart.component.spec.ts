import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
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
      PushModule,
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

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getXAxisData', () => {
    test('should return correct data', () => {
      // momentjs uses Date.now() under the hood for moment()
      const spyDate = jest
        .spyOn(Date, 'now')
        .mockImplementation(() => 1_630_014_361_000); // 26.8.2021
      const result = component.getXAxisData();

      expect(result).toEqual([`2/21`, `3/21`, `4/21`, `5/21`, `6/21`, `7/21`]);
      expect(spyDate).toHaveBeenCalled();
    });
  });
});
