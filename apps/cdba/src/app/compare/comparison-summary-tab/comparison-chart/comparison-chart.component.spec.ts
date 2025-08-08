import { CommonModule } from '@angular/common';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { ECharts } from 'echarts';
import { MockDirective } from 'ng-mocks';
import { NgxEchartsDirective } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DataPoint } from '@cdba/shared/components/bom-chart/data-point.model';
import { ComparisonDetail } from '@cdba/shared/models/comparison.model';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';

import { ComparisonDetailsChartService } from '../service/comparison-details-chart.service';
import { ComparisonChartComponent } from './comparison-chart.component';

describe('ComparisonChartComponent', () => {
  let component: ComparisonChartComponent;
  let spectator: Spectator<ComparisonChartComponent>;

  const createComponent = createComponentFactory({
    component: ComparisonChartComponent,
    detectChanges: false,
    imports: [
      CommonModule,
      MockDirective(NgxEchartsDirective),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      mockProvider(ComparisonDetailsChartService),
      provideMockStore({ initialState: { compare: COMPARE_STATE_MOCK } }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    component['chartService'].provideParetoChartConfig = jest.fn(() => ({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set details and currency', () => {
      const expectedDetails = [
        {
          title: 'title',
          totalCosts: 0,
          costSharePercentage: 0,
          costDifferences: [],
        },
        {
          title: 'titleWithCostShare',
          totalCosts: 0,
          costSharePercentage: 10,
          costDifferences: [],
        },
      ] as ComparisonDetail[];
      const expectedCurrency = 'EUR';
      component.details = expectedDetails;
      component.currency = expectedCurrency;

      const spy = jest.spyOn(
        component['chartService'],
        'provideParetoChartConfig'
      );

      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith(expectedDetails, expectedCurrency);
      expect(component.eChartOptions).toEqual({});
    });
  });

  describe('findBarChartIndex', () => {
    it('should find index of bar chart', () => {
      component.eChartOptions = { series: [{ type: 'line' }, { type: 'bar' }] };

      const result = component.findBarChartIndex();

      expect(result).toEqual(1);
    });
    it('should throw exception when bar series not found', () => {
      component.eChartOptions = { series: [{ type: 'line' }] };

      expect(() => {
        component.findBarChartIndex();
      }).toThrow(new Error('Bar chart series not found'));
    });
  });

  describe('onChartInit', () => {
    it('should assign eCharts instance', () => {
      const findIndexSpy = jest.spyOn(component, 'findBarChartIndex');

      component.onChartInit({} as unknown as ECharts);

      expect(component.eChartsInstance).toEqual({});
      expect(findIndexSpy).not.toHaveBeenCalled();
    });
    it('should assign invariant bar series data', () => {
      component.findBarChartIndex = jest.fn(() => 0);
      component.eChartOptions = { series: [{ data: [{}] }] };

      component.onChartInit({} as unknown as ECharts);

      expect(component.invariantBarSeriesData).toEqual([{}]);
    });
    it('should throw exception when echarts instance is undefined', () => {
      expect(() => {
        component.onChartInit(undefined);
      }).toThrow(new Error('ECharts instance is not defined'));
    });
  });

  describe('onFilteredCostTypesChange', () => {
    const dataPoints: DataPoint[] = [
      {
        name: 'AAA',
        value: 0,
        itemStyle: {
          color: 'changeMe',
        },
      },
      {
        name: 'BBB',
        value: 0,
        itemStyle: {
          color: 'dontChangeMe',
        },
      },
      {
        name: 'CCC',
        value: 0,
        itemStyle: {
          color: 'changeMe',
        },
      },
    ];

    beforeEach(() => {
      component.eChartsInstance = {
        setOption: jest.fn(),
      } as unknown as ECharts;

      component.findBarChartIndex = jest.fn(() => 0);
      component.invariantBarSeriesData = dataPoints;
      component.eChartOptions = {
        series: [
          {
            type: 'bar',
            data: dataPoints,
          },
        ],
      };
    });

    it('should update chart with invariant options if user cleared filter', () => {
      const expectedEchartOptions = {
        series: [
          {
            data: [
              { itemStyle: { color: 'changeMe' }, name: 'AAA', value: 0 },
              { itemStyle: { color: 'dontChangeMe' }, name: 'BBB', value: 0 },
              { itemStyle: { color: 'changeMe' }, name: 'CCC', value: 0 },
            ],
            type: 'bar',
          },
        ],
      };
      const setOptionSpy = jest.spyOn(component.eChartsInstance, 'setOption');

      component.filterCostTypes([]);

      expect(setOptionSpy).toHaveBeenCalledWith(expectedEchartOptions);
    });
    it('should update color of given cost types', () => {
      const expectedDataPoints: DataPoint[] = [
        {
          name: 'AAA',
          value: 0,
          itemStyle: {
            color: '#1C98B5',
          },
        },
        {
          name: 'BBB',
          value: 0,
          itemStyle: {
            color: 'dontChangeMe',
          },
        },
        {
          name: 'CCC',
          value: 0,
          itemStyle: {
            color: '#1C98B5',
          },
        },
      ];

      component.filterCostTypes(['AAA', 'CCC']);

      expect(component.eChartOptions.series[0].data).toEqual(
        expectedDataPoints
      );
    });
  });
});
