import { Subscription } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ECharts } from 'echarts';
import { MockComponent, MockDirective } from 'ng-mocks';
import { NgxEchartsDirective } from 'ngx-echarts';

import { StringOption } from '@schaeffler/inputs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SplitAreaComponent } from '@cdba/shared/components';
import { Calculation } from '@cdba/shared/models';
import { ComparisonDetail } from '@cdba/shared/models/comparison.model';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';
import {
  COMPARISON_DETAILS_MOCK,
  COMPARISON_MOCK,
  COMPARISON_UPDATED_MOCK,
} from '@cdba/testing/mocks/models/comparison-summary.mock';

import {
  areBomItemsValidForComparison,
  getComparisonError,
  getSelectedCalculations,
  isComparisonLoading,
} from '../store';
import { getComparison } from '../store/selectors/comparison-summary/comparison-summary.selectors';
import { ComparisonChartComponent } from './comparison-chart/comparison-chart.component';
import { ComparisonSummaryTabComponent } from './comparison-summary-tab.component';

describe('ComparisonSummaryTabComponent', () => {
  let component: ComparisonSummaryTabComponent;
  let spectator: Spectator<ComparisonSummaryTabComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ComparisonSummaryTabComponent,
    detectChanges: false,
    imports: [
      MockDirective(NgxEchartsDirective),
      MockComponent(SplitAreaComponent),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({ initialState: COMPARE_STATE_MOCK }),
      mockProvider(TranslocoLocaleService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    store = spectator.inject(MockStore);

    component['transloco'].translate = jest.fn((input: any) => input);
    component['localeService'].localizeDate = jest.fn((input: any) => input);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      store.overrideSelector(areBomItemsValidForComparison, true);
      store.overrideSelector(isComparisonLoading, false);
      store.overrideSelector(getComparisonError, '');
    });
    it('should init component with proper data', () => {
      store.overrideSelector(getComparison, COMPARISON_MOCK);

      component.localizeComparisonSummary = jest.fn();
      component.populateOptions = jest.fn();
      component['chartService'].provideSummarizedRadarChartConfig = jest.fn();

      component.ngOnInit();

      expect(component.areBomItemsValidForComparison).toEqual(true);
      expect(component.valueChangesSubscription).toBeDefined();
      expect(component.isLoading).toEqual(false);
      expect(component.errorMessage).toEqual('');
      expect(component.selectedStringOptions).toEqual([]);
      expect(component.localizeComparisonSummary).toHaveBeenCalledTimes(1);
      expect(component.populateOptions).toHaveBeenCalledTimes(1);
      expect(component.invariantDetails).toEqual(COMPARISON_DETAILS_MOCK);
      expect(component.details).toEqual(COMPARISON_DETAILS_MOCK);
      expect(
        component['chartService'].provideSummarizedRadarChartConfig
      ).toHaveBeenCalledWith(undefined, undefined, COMPARISON_MOCK);
    });
    it('should handle undefined comparison', () => {
      store.overrideSelector(getComparison, undefined);

      component.localizeComparisonSummary = jest.fn();
      component.populateOptions = jest.fn();
      component['chartService'].provideSummarizedRadarChartConfig = jest.fn();

      component.ngOnInit();

      expect(component.areBomItemsValidForComparison).toEqual(true);
      expect(component.valueChangesSubscription).toBeDefined();
      expect(component.isLoading).toEqual(false);
      expect(component.errorMessage).toEqual('');
      expect(component.selectedStringOptions).toEqual([]);
      expect(component.localizeComparisonSummary).not.toHaveBeenCalled();
      expect(component.populateOptions).not.toHaveBeenCalled();
      expect(component.invariantDetails).toEqual([]);
      expect(component.details).toEqual([]);
      expect(
        component['chartService'].provideSummarizedRadarChartConfig
      ).not.toHaveBeenCalled();
    });
  });

  describe('localizeComparison', () => {
    it('should localize comparison when material designations are different', () => {
      component.comparison = COMPARISON_MOCK;

      component.localizeComparisonSummary();

      expect(component.comparison).toEqual(COMPARISON_UPDATED_MOCK);
      expect(component.firstMaterialDesignation).toEqual(
        COMPARISON_MOCK.summary.firstMaterialDesignation
      );
      expect(component.secondMaterialDesignation).toEqual(
        COMPARISON_MOCK.summary.secondMaterialDesignation
      );
    });
    it('should append calculation details when material designations are different', () => {
      const givenMock = COMPARISON_MOCK;
      givenMock.summary.secondMaterialDesignation =
        givenMock.summary.firstMaterialDesignation;

      component.comparison = givenMock;

      const expectedComparison = COMPARISON_UPDATED_MOCK;
      expectedComparison.summary.secondMaterialDesignation =
        expectedComparison.summary.firstMaterialDesignation;
      store.overrideSelector(getSelectedCalculations, [
        {
          costType: 'GPC',
          calculationDate: '2020-07-23 00:00:00',
        } as unknown as Calculation,
        {
          costType: 'SQV',
          calculationDate: '2020-07-23 11:11:11',
        } as unknown as Calculation,
      ]);

      component.localizeComparisonSummary();

      expect(component.comparison).toEqual(expectedComparison);
      expect(component.firstMaterialDesignation).toEqual(
        'F-348307.14.SLHS#N GPC@2020-07-23 00:00:00'
      );
      expect(component.secondMaterialDesignation).toEqual(
        'F-348307.14.SLHS#N SQV@2020-07-23 11:11:11'
      );
    });

    describe('populateOptions', () => {
      it('should map comparison details as string options and set invariant options', () => {
        component.comparison = COMPARISON_UPDATED_MOCK;
        const expectedOptions = [
          { id: 0, title: 'GEH' },
          { id: 1, title: 'AU' },
          { id: 2, title: 'ASEH' },
          { id: 3, title: 'SLHS' },
        ] as StringOption[];

        component.populateOptions();

        expect(component.stringOptions).toEqual(expectedOptions);
        expect(component.invariantStringOptions).toEqual(expectedOptions);
      });
    });

    describe('ngOnDestroy', () => {
      it('should unsubscribe', () => {
        component.comparisonSubscription = {
          unsubscribe: jest.fn(),
        } as unknown as Subscription;
        component.isLoadingSubscription = {
          unsubscribe: jest.fn(),
        } as unknown as Subscription;
        component.errorMessageSubscription = {
          unsubscribe: jest.fn(),
        } as unknown as Subscription;
        component.valueChangesSubscription = {
          unsubscribe: jest.fn(),
        } as unknown as Subscription;
        component.areBomItemsValidForComparisonSubscription = {
          unsubscribe: jest.fn(),
        } as unknown as Subscription;

        component.ngOnDestroy();

        expect(component.comparisonSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.isLoadingSubscription.unsubscribe).toHaveBeenCalled();
        expect(
          component.errorMessageSubscription.unsubscribe
        ).toHaveBeenCalled();
        expect(
          component.valueChangesSubscription.unsubscribe
        ).toHaveBeenCalled();
        expect(
          component.areBomItemsValidForComparisonSubscription.unsubscribe
        ).toHaveBeenCalled();
      });
    });

    describe('onChartInit', () => {
      it('should assign echarts instance', () => {
        component.onChartInit({} as ECharts);

        expect(component.echartsInstance).toEqual({} as ECharts);
      });
    });

    describe('onSearchUpdated', () => {
      beforeEach(() => {
        component.invariantStringOptions = [
          { id: 0, title: 'TITLE' },
          { id: 1, title: 'TITLE_1' },
          { id: 2, title: 'TITLE_2' },
          { id: 3, title: 'TITLE_3' },
        ];
      });
      it('should filter options', () => {
        component.onSearchUpdated('LE_');

        expect(component.stringOptions).toEqual([
          { id: 1, title: 'TITLE_1' },
          { id: 2, title: 'TITLE_2' },
          { id: 3, title: 'TITLE_3' },
        ]);
      });
      it('should filter options and move selected to top', () => {
        component.selectedStringOptions = [{ id: 2, title: 'TITLE_2' }];

        component.onSearchUpdated('LE_');

        expect(component.stringOptions).toEqual([
          { id: 2, title: 'TITLE_2' },
          { id: 1, title: 'TITLE_1' },
          { id: 3, title: 'TITLE_3' },
        ]);
      });
    });

    describe('onOptionSelected', () => {
      let invariantDetails: ComparisonDetail[] = [];

      beforeEach(() => {
        invariantDetails = [
          {
            title: 'TITLE',
            costDifferences: [],
            totalCosts: 0,
            costSharePercentage: 0,
          },
          {
            title: 'TITLE_2',
            costDifferences: [],
            totalCosts: 0,
            costSharePercentage: 0,
          },
          {
            title: 'TITLE_3',
            costDifferences: [],
            totalCosts: 0,
            costSharePercentage: 0,
          },
        ];

        component.invariantDetails = invariantDetails;
        component.details = [];
      });

      it('should return unfiltered list when no option is selected', () => {
        component.onOptionSelected([]);

        expect(component.selectedDetails).toEqual(invariantDetails);
      });
      it('should filter details based on single selected option', () => {
        component.onOptionSelected([{ title: 'TITLE_2' } as StringOption]);

        expect(component.selectedDetails).toEqual([invariantDetails[1]]);
      });
      it('should filter details based on multiple selected option', () => {
        component.onOptionSelected([
          { title: 'TITLE' } as StringOption,
          { title: 'TITLE_3' } as StringOption,
        ]);

        expect(component.selectedDetails).toEqual([
          {
            title: 'TITLE',
            costDifferences: [],
            totalCosts: 0,
            costSharePercentage: 0,
          },
          {
            title: 'TITLE_3',
            costDifferences: [],
            totalCosts: 0,
            costSharePercentage: 0,
          },
        ]);
      });
    });

    describe('onOpenedChange', () => {
      it('should set value of formControl when opening select component', () => {
        component.formControl.setValue = jest.fn();

        component.onOpenedChange(true);

        expect(component.formControl.setValue).toHaveBeenCalledWith(
          component.formControl.value,
          { emitEvent: false }
        );
      });
      it('should update string options and details', () => {
        component.stringOptions = [
          { id: 0, title: 'AAA' },
          { id: 1, title: 'BBB' },
          { id: 2, title: 'CCC' },
          { id: 3, title: 'DDD' },
        ];
        component.selectedStringOptions = [
          { id: 0, title: 'AAA' },
          { id: 2, title: 'CCC' },
        ];
        component.comparisonChart = {
          filterCostTypes: jest.fn(),
        } as unknown as ComparisonChartComponent;

        component.onOpenedChange(false);

        expect(component.stringOptions).toEqual([
          { id: 0, title: 'AAA' },
          { id: 2, title: 'CCC' },
          { id: 1, title: 'BBB' },
          { id: 3, title: 'DDD' },
        ]);
        expect(component.comparisonChart.filterCostTypes).toHaveBeenCalledWith([
          'AAA',
          'CCC',
        ]);
        expect(component.details).toEqual([]);
        expect(component.selectedDetails).toEqual([]);
      });
    });

    describe('pickTemplate', () => {
      it('should throw error for incorrect value', () => {
        expect(() => {
          component.pickTemplate(undefined);
        }).toThrow(new Error('Incorrect value passed undefined'));
      });
      it('should return left error template when error message is defined', () => {
        component.errorMessage = 'error';

        const result = component.pickTemplate('left');

        expect(result).toBe(component.leftErrorTemplate);
      });
      it('should pick no data template when comparison details and summary are undefined', () => {
        component.comparison = undefined;

        const result = component.pickTemplate('left');

        expect(result).toBe(component.leftNoDataTemplate);
      });
      it('should pick left valid template when comparison is present and there is no error', () => {
        component.errorMessage = undefined;
        component.comparison = COMPARISON_MOCK;

        const result = component.pickTemplate('left');

        expect(result).toBe(component.leftValidTemplate);
      });
      it('should pick left right error template when error message is defined', () => {
        component.errorMessage = 'error';

        const result = component.pickTemplate('right');

        expect(result).toBe(component.rightErrorTemplate);
      });
      it('should pick right no data template when comparison details and summary are undefined', () => {
        component.comparison = undefined;

        const result = component.pickTemplate('right');

        expect(result).toBe(component.rightNoDataTemplate);
      });
      it('should pick right valid template when comparison is present and there is no error', () => {
        component.errorMessage = undefined;
        component.comparison = COMPARISON_MOCK;

        const result = component.pickTemplate('right');

        expect(result).toBe(component.rightValidTemplate);
      });
    });
  });
});
