import { of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';

import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { DxChartModule } from 'devextreme-angular/ui/chart';
import { configureTestSuite } from 'ng-bullet';

import { ChartComponent } from './chart.component';
import { LegendComponent } from './legend/legend.component';

import * as en from '../../../../assets/i18n/en.json';
import { CHART_SETTINGS_WOEHLER } from '../../../shared/constants';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ChartComponent, LegendComponent],
      imports: [
        CommonModule,
        FlexLayoutModule,
        DxChartModule,
        provideTranslocoTestingModule({ en })
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.limits = {
      x_min: 0,
      x_max: 1000000,
      y_min: 0,
      y_max: 1000
    };
    component.bannerIsVisible = of(true);
    component.chartSettings = CHART_SETTINGS_WOEHLER;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call export function of chart', () => {
    spyOn(component.chart1.instance, 'exportTo');
    component.exportChart();
    expect(component.chart1.instance.exportTo).toHaveBeenCalled();
  });

  it('should generate current timestamp', () => {
    const timestamp = component.generateDatetime();
    const regexMatcher = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}/;
    expect(regexMatcher.test(timestamp)).toEqual(true);
  });

  describe('trackByFn()', () => {
    it('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
