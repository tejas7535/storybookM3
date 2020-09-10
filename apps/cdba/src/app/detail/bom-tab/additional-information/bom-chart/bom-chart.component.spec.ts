import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';

import { BOM_MOCK } from '../../../../../testing/mocks';
import { BomItem } from '../../../../core/store/reducers/detail/models';
import { BomChartComponent } from './bom-chart.component';
import {
  COLOR_PLATTE,
  getXAxisConfig,
  TOOLTIP_CONFIG,
  Y_AXIS_CONFIG,
} from './bom-chart.config';

describe('BomChartComponent', () => {
  let component: BomChartComponent;
  let fixture: ComponentFixture<BomChartComponent>;

  const data: BomItem[] = [BOM_MOCK[0], BOM_MOCK[1]];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BomChartComponent],
      imports: [
        NoopAnimationsModule,
        SharedModule,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        }),
        provideTranslocoTestingModule({}),
        MatIconModule,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BomChartComponent);
    component = fixture.componentInstance;
    component.chartData = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('data input', () => {
    it('should set the chart data properly', () => {
      expect(component['lineChartData']).toEqual([50, 100]);
      expect(component['barChartData']).toEqual([
        {
          itemStyle: {
            color: COLOR_PLATTE[0],
          },
          name: 'FE-2313',
          value: 13,
        },
        {
          itemStyle: {
            color: COLOR_PLATTE[1],
          },
          name: 'FE-2315',
          value: 13,
        },
      ]);
    });
  });

  describe('ngOnChanges', () => {
    it('should set chart options properly', () => {
      const xAxisConfig = getXAxisConfig(false);

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges();

      expect(component.options.tooltip).toEqual(TOOLTIP_CONFIG);
      expect(component.options.yAxis).toEqual(Y_AXIS_CONFIG);
      expect(component.options.xAxis).toEqual(xAxisConfig);
      expect(component.options.series[0].type).toEqual('bar');
      expect(component.options.series[1].type).toEqual('line');
    });
  });
});
