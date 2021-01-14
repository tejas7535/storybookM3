import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReactiveComponentModule } from '@ngrx/component';
import { configureTestSuite } from 'ng-bullet';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../../../../assets/i18n/en.json';
import { ChartComponent } from './chart.component';
import { LegendComponent } from './legend/legend.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ChartComponent, LegendComponent],
      imports: [
        CommonModule,
        FlexLayoutModule,
        ReactiveComponentModule,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        }),
        provideTranslocoTestingModule({ en }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init chart object', () => {
    const ec = {} as unknown;

    component.initChart(ec);

    expect(component.chart).toEqual(ec);
  });

  it('should generate current timestamp', () => {
    const timestamp = component.generateDatetime();
    const regexMatcher = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}/;
    expect(regexMatcher.test(timestamp)).toEqual(true);
  });

  it('should set export properties', () => {
    component.generateDatetime = jest.fn(() => 'theTime');
    component.chart = {} as unknown;
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
