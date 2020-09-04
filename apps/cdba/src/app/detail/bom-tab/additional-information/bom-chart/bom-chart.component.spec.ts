import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';
import { NgxEchartsModule } from 'ngx-echarts';

import { BOM_MOCK } from '../../../../../testing/mocks';
import { BomItem } from '../../../../core/store/reducers/detail/models';
import { BomChartComponent } from './bom-chart.component';
import {
  COLOR_PLATTE,
  TOOLTIP_CONFIG,
  X_AXIS_CONFIG,
  Y_AXIS_CONFIG,
} from './bom-chart.config';

describe('BomChartComponent', () => {
  let component: BomChartComponent;
  let fixture: ComponentFixture<BomChartComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BomChartComponent],
      imports: [
        CommonModule,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BomChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('data input', () => {
    it('should set the chart data properly', () => {
      const data: BomItem[] = [BOM_MOCK[0], BOM_MOCK[1]];

      component.chartData = data;

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
      const data: BomItem[] = [BOM_MOCK[0], BOM_MOCK[1]];

      component.chartData = data;
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges();

      expect(component.options.tooltip).toEqual(TOOLTIP_CONFIG);
      expect(component.options.yAxis).toEqual(Y_AXIS_CONFIG);
      expect(component.options.xAxis).toEqual(X_AXIS_CONFIG);
      expect(component.options.series[0].type).toEqual('bar');
      expect(component.options.series[1].type).toEqual('line');
    });
  });
});
