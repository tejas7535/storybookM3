import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { DoughnutConfig } from '../shared/charts/models';
import { OverviewComponent } from './overview.component';
import {
  loadOpenApplications,
  loadOverviewEntryEmployees,
  loadOverviewExitEmployees,
} from './store/actions/overview.action';
import {
  getAttritionOverTimeOverviewData,
  getFluctuationRatesForChart,
  getIsLoadingAttritionOverTimeOverview,
  getIsLoadingDoughnutsConfig,
  getIsLoadingFluctuationRatesForChart,
  getOverviewEntryEmployees,
  getOverviewEntryEmployeesLoading,
  getOverviewExitEmployees,
  getOverviewExitEmployeesLoading,
  getOverviewExternalExitEmployees,
  getOverviewExternalUnforcedExitEmployees,
  getOverviewFluctuationEntriesCount,
  getOverviewFluctuationEntriesDoughnutConfig,
  getOverviewFluctuationExitsCount,
  getOverviewFluctuationExitsDoughnutConfig,
  getUnforcedFluctuationRatesForChart,
} from './store/selectors/overview.selector';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let store: MockStore;
  let spectator: Spectator<OverviewComponent>;

  const createComponent = createComponentFactory({
    component: OverviewComponent,
    detectChanges: false,
    imports: [PushModule, TranslocoTestingModule],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should set attritionData$',
      marbles((m) => {
        const result = 'a' as any;
        store.overrideSelector(getAttritionOverTimeOverviewData, result);
        component.ngOnInit();
        m.expect(component.attritionData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set attritionRateLoading$',
      marbles((m) => {
        const result = true;
        store.overrideSelector(getIsLoadingAttritionOverTimeOverview, result);
        component.ngOnInit();
        m.expect(component.attritionRateLoading$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set isLoadingDoughnutsConfig$',
      marbles((m) => {
        const result = true;
        store.overrideSelector(getIsLoadingDoughnutsConfig, result);
        component.ngOnInit();
        m.expect(component.isLoadingDoughnutsConfig$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set entriesDoughnutConfig$',
      marbles((m) => {
        const result = new DoughnutConfig('donnut', []);
        store.overrideSelector(
          getOverviewFluctuationEntriesDoughnutConfig,
          result
        );
        component.ngOnInit();
        m.expect(component.entriesDoughnutConfig$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set exitsDoughnutConfig$',
      marbles((m) => {
        const result = new DoughnutConfig('donnut', []);
        store.overrideSelector(
          getOverviewFluctuationExitsDoughnutConfig,
          result
        );
        component.ngOnInit();
        m.expect(component.exitsDoughnutConfig$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set chartData$',
      marbles((m) => {
        const result: [DoughnutConfig, DoughnutConfig] = [
          new DoughnutConfig('donnut 1', []),
          new DoughnutConfig('donnut 2', []),
        ];
        store.overrideSelector(
          getOverviewFluctuationEntriesDoughnutConfig,
          result[0]
        );
        store.overrideSelector(
          getOverviewFluctuationExitsDoughnutConfig,
          result[1]
        );

        component.ngOnInit();

        m.expect(component.chartData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set entriesCount$',
      marbles((m) => {
        const result = 34;
        store.overrideSelector(getOverviewFluctuationEntriesCount, result);
        component.ngOnInit();
        m.expect(component.entriesCount$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set exitsCount$',
      marbles((m) => {
        const result = 41;
        store.overrideSelector(getOverviewFluctuationExitsCount, result);
        component.ngOnInit();
        m.expect(component.exitsCount$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set exitEmployees$',
      marbles((m) => {
        const result = [] as any;
        store.overrideSelector(getOverviewExitEmployees, result);
        component.ngOnInit();
        m.expect(component.exitEmployees$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set entryEmployees$',
      marbles((m) => {
        const result = [] as any;
        store.overrideSelector(getOverviewEntryEmployees, result);
        component.ngOnInit();
        m.expect(component.entryEmployees$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );
    test(
      'should set exitEmployeesLoading$',
      marbles((m) => {
        const result = true;
        store.overrideSelector(getOverviewExitEmployeesLoading, result);
        component.ngOnInit();
        m.expect(component.exitEmployeesLoading$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );
    test(
      'should set entryEmployeesLoading$',
      marbles((m) => {
        const result = false;
        store.overrideSelector(getOverviewEntryEmployeesLoading, result);
        component.ngOnInit();
        m.expect(component.entryEmployeesLoading$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );
    test(
      'should set externalUnforcedExitEmployees$',
      marbles((m) => {
        const result = [] as any;
        store.overrideSelector(
          getOverviewExternalUnforcedExitEmployees,
          result
        );
        component.ngOnInit();
        m.expect(component.externalUnforcedExitEmployees$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );
    test(
      'should set externalExitEmployees$',
      marbles((m) => {
        const result = [] as any;
        store.overrideSelector(getOverviewExternalExitEmployees, result);
        component.ngOnInit();
        m.expect(component.externalExitEmployees$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set fluctuationChartData$',
      marbles((m) => {
        const result = [] as any;
        store.overrideSelector(getFluctuationRatesForChart, result);
        component.ngOnInit();
        m.expect(component.fluctuationChartData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set unforcedFluctuationChartData$',
      marbles((m) => {
        const result = [] as any;
        store.overrideSelector(getUnforcedFluctuationRatesForChart, result);
        component.ngOnInit();
        m.expect(component.unforcedFluctuationChartData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set isFluctuationChartLoading$',
      marbles((m) => {
        const result = false as any;
        store.overrideSelector(getIsLoadingFluctuationRatesForChart, result);
        component.ngOnInit();
        m.expect(component.isFluctuationChartLoading$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );
  });

  describe('triggerLoadExitEmployees', () => {
    test('should dispatch loadOverviewExitEmployees', () => {
      component.triggerLoadExitEmployees();

      expect(store.dispatch).toHaveBeenCalledWith(loadOverviewExitEmployees());
    });
  });

  describe('triggerLoadEntryEmployees', () => {
    test('should dispatch loadOverviewEntryEmployees', () => {
      component.triggerLoadEntryEmployees();

      expect(store.dispatch).toHaveBeenCalledWith(loadOverviewEntryEmployees());
    });
  });

  describe('triggerLoadOpenApplications', () => {
    test('should dispatch loadOpenApplications', () => {
      component.triggerLoadOpenApplications();

      expect(store.dispatch).toHaveBeenCalledWith(loadOpenApplications());
    });
  });
});
