import { CommonModule } from '@angular/common';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { ECharts, EChartsOption } from 'echarts';
import { MockDirective } from 'ng-mocks';
import { NgxEchartsDirective } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ComparisonType } from '@cdba/shared/constants';
import {
  ComparisonDetail,
  CostDifference,
} from '@cdba/shared/models/comparison.model';

import { ComparisonDetailsChartService } from '../service/comparison-details-chart.service';
import { ComparisonItemComponent } from './comparison-item.component';

describe('ComparisonItemComponent', () => {
  let component: ComparisonItemComponent;
  let spectator: Spectator<ComparisonItemComponent>;

  const createComponent = createComponentFactory({
    component: ComparisonItemComponent,
    detectChanges: false,
    imports: [
      CommonModule,
      MockDirective(NgxEchartsDirective),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [mockProvider(ComparisonDetailsChartService)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    component['transloco'].translate = jest.fn((input: any) => input);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component', () => {
      component['chartService'].provideDetailedBarChartConfig = jest.fn(
        () => ({}) as EChartsOption
      );

      spectator.setInput({
        detail: {},
        firstMaterialDesignation: '123',
        secondMaterialDesignation: '456',
      });

      component.ngOnInit();

      expect(component.detail).toEqual({});
      expect(component.firstMaterialDesignation).toBe('123');
      expect(component.secondMaterialDesignation).toBe('456');
      expect(component.eChartOptions).toEqual({
        tooltip: {
          formatter: component.barChartTooltipFormatter,
          appendToBody: true,
        },
      });
    });
  });

  describe('barChartTooltipFormatter', () => {
    beforeEach(() => {
      component.firstMaterialDesignation = 'firstMaterialDesignation';
      component.secondMaterialDesignation = 'secondMaterialDesignation';
      component.currency = 'TST';

      component.detail = {
        title: 'TEST',
        costDifferences: [
          {
            title: 'TEST_DIFF',
            type: ComparisonType.MOH,
            valueBom1: 1,
            valueBom2: 2,
            costDeltaValue: 10,
            costDeltaPercentage: 100,
          } as CostDifference,
        ],
      } as ComparisonDetail;
    });

    it('should return noData template when cost difference not found', () => {
      const params = [{ axisValue: 'UNKNOWN_DIFF' }];
      const expectedTemplate = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
        <span>shared.noDataToDisplay</span>
        </div>
        `;

      expect(component.barChartTooltipFormatter(params)).toEqual(
        expectedTemplate
      );
    });

    it('should return formatted tooltip when delta less than zero', () => {
      component.detail.costDifferences[0].costDeltaPercentage = -100;

      const result = component.barChartTooltipFormatter([
        { axisValue: 'MOH', color: '#000' },
        { color: '#111' },
      ]);

      expect(result).toBe(
        `
    <div style="display: grid; grid-template-columns: auto auto auto; gap: 5px; align-items: center">
      <div style="grid-column: span 3; font-weight: bold;">MOH</div>
      <div style="background-color: #000; width: 14px; height: 14px;"></div>
      <div>firstMaterialDesignation</div><div style="text-align: right; font-weight: bold;">1 TST</div>
      <div style="background-color: #111; width: 14px; height: 14px;"></div>
      <div>secondMaterialDesignation</div><div style="text-align: right; font-weight: bold;">2 TST</div>
      <div style="grid-column: span 2; display: flex; justify-content: space-between">
          <div style="font-weight: bold; text-align: left">compare.summary.rightArea.costDiff</div><div style="text-align: center; font-weight: bold; color: #A30F0C">-100%</div>
      </div><div style="text-align: right; font-weight: bold;">10 TST</div>
    </div>
    `
      );
      expect(component['transloco'].translate).toHaveBeenCalledWith(
        'compare.summary.rightArea.costDiff'
      );
    });

    it('should return formatted tooltip when delta zero or more', () => {
      const result = component.barChartTooltipFormatter([
        { axisValue: 'MOH', color: '#000' },
        { color: '#111' },
      ]);

      expect(result).toBe(
        `
    <div style="display: grid; grid-template-columns: auto auto auto; gap: 5px; align-items: center">
      <div style="grid-column: span 3; font-weight: bold;">MOH</div>
      <div style="background-color: #000; width: 14px; height: 14px;"></div>
      <div>firstMaterialDesignation</div><div style="text-align: right; font-weight: bold;">1 TST</div>
      <div style="background-color: #111; width: 14px; height: 14px;"></div>
      <div>secondMaterialDesignation</div><div style="text-align: right; font-weight: bold;">2 TST</div>
      <div style="grid-column: span 2; display: flex; justify-content: space-between">
          <div style="font-weight: bold; text-align: left">compare.summary.rightArea.costDiff</div><div style="text-align: center; font-weight: bold; ">100%</div>
      </div><div style="text-align: right; font-weight: bold;">10 TST</div>
    </div>
    `
      );
      expect(component['transloco'].translate).toHaveBeenCalledWith(
        'compare.summary.rightArea.costDiff'
      );
    });
  });

  describe('getAxisLabelMap', () => {
    it('should get EN map', () => {
      component['transloco'].getActiveLang = jest.fn(() => 'en');

      const result = component.getAxisLabelMap();

      expect(result).toEqual({
        PURCHASE: 'Purchase',
        BURDEN: 'Burden',
        LABOUR: 'Labour',
        MOH: 'MOH',
        RAW_MATERIAL: 'Raw Material',
        REMAINDER: 'Remainder',
        TOTAL: 'Total',
      });
    });
    it('should get DE map', () => {
      component['transloco'].getActiveLang = jest.fn(() => 'de');

      const result = component.getAxisLabelMap();

      expect(result).toEqual({
        PURCHASE: 'Einkauf',
        BURDEN: 'Tragkraft',
        LABOUR: 'Arbeit',
        MOH: 'MOH',
        RAW_MATERIAL: 'Rohmaterial',
        REMAINDER: 'Rest',
        TOTAL: 'Gesamt',
      });
    });
    it('should throw error on unhandled language', () => {
      component['transloco'].getActiveLang = jest.fn(() => 'foobar');

      expect(() => {
        component.getAxisLabelMap();
      }).toThrow(
        new Error('Unhandled language: foobar passed to AxisLabelMap')
      );
    });
  });

  describe('onChartInit', () => {
    it('should assign echarts instance', () => {
      const mockEcInstance = {} as ECharts;

      component.onChartInit(mockEcInstance);

      expect(component.echartsInstance).toBe(mockEcInstance);
    });
    it('should throw exception when echarts instance is undefined', () => {
      expect(() => {
        component.onChartInit(undefined);
      }).toThrow(new Error('ECharts instance is not defined'));
    });
  });
});
