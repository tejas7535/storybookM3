import { CommonModule } from '@angular/common';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { ECharts } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { ChartComponent } from './chart.component';
import { LegendComponent } from './legend/legend.component';
window.ResizeObserver = resize_observer_polyfill;

describe('ChartComponent', () => {
  let component: ChartComponent;
  let spectator: Spectator<ChartComponent>;

  const createComponent = createComponentFactory({
    component: ChartComponent,
    declarations: [ChartComponent, LegendComponent],
    imports: [
      CommonModule,
      ReactiveComponentModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
      provideTranslocoTestingModule({ en }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init chart object', () => {
    const ec = {} as unknown as ECharts;

    component.initChart(ec);

    expect(component.chart).toEqual(ec);
  });

  it('should generate current timestamp', () => {
    const timestamp = component.generateDatetime();
    const regexMatcher = /^\d{4}(?:-\d{1,2}){2} (?:\d{1,2}:){2}\d{1,2}/;
    expect(regexMatcher.test(timestamp)).toEqual(true);
  });

  it('should set export properties', () => {
    component.generateDatetime = jest.fn(() => 'theTime');
    component.chart = {} as unknown as ECharts;
    component.chart.getDataURL = jest.fn(() => 'theImgUrl');

    component.exportChart();

    expect(component.filename).toEqual(
      `${component.fileNamePrefix}-theTime.png`
    );
    expect(component.imgUrl).toEqual('theImgUrl');
  });

  describe('trackByFn()', () => {
    it('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
