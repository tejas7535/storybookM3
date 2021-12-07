import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { DoughnutConfig } from '../shared/charts/models/doughnut-config.model';
import { OverviewComponent } from './overview.component';
import {
  getAttritionOverTimeEvents,
  getAttritionOverTimeOverviewData,
  getEntryEmployees,
  getFluctuationRatesForChart,
  getIsLoadingAttritionOverTimeOverview,
  getIsLoadingDoughnutsConfig,
  getIsLoadingFluctuationRatesForChart,
  getIsLoadingUnforcedFluctuationRatesForChart,
  getLeaversDataForSelectedOrgUnit,
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
    imports: [ReactiveComponentModule, TranslocoTestingModule],
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
      'should set attritionRateloading$',
      marbles((m) => {
        const result = true;
        store.overrideSelector(getIsLoadingAttritionOverTimeOverview, result);
        component.ngOnInit();
        m.expect(component.attritionRateloading$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set events$',
      marbles((m) => {
        const result = [
          {
            date: new Date(2020, 1, 1).valueOf().toString(),
            name: 'blur',
          },
        ];
        store.overrideSelector(getAttritionOverTimeEvents, result);
        component.ngOnInit();
        m.expect(component.events$).toBeObservable(
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
        store.overrideSelector(getLeaversDataForSelectedOrgUnit, result);
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
        store.overrideSelector(getEntryEmployees, result);
        component.ngOnInit();
        m.expect(component.entryEmployees$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );
  });

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

  test(
    'should set isUnforcedFluctuationChartLoading$',
    marbles((m) => {
      const result = false as any;
      store.overrideSelector(
        getIsLoadingUnforcedFluctuationRatesForChart,
        result
      );
      component.ngOnInit();
      m.expect(component.isUnforcedFluctuationChartLoading$).toBeObservable(
        m.cold('a', {
          a: result,
        })
      );
    })
  );
});
