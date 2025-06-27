import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { getAreOpenApplicationsAvailable } from '../core/store/selectors';
import { FluctuationKpi, OpenApplication } from './models';
import { OverviewComponent } from './overview.component';
import {
  loadOpenApplications,
  loadOverviewEntryEmployees,
  loadOverviewExitEmployees,
} from './store/actions/overview.action';
import {
  getAttritionOverTimeOverviewData,
  getBenchmarkFluctuationKpi,
  getDimensionFluctuationKpi,
  getDimensionFluctuationRatesForChart,
  getDimensionUnforcedFluctuationRatesForChart,
  getIsLoadingAttritionOverTimeOverview,
  getIsLoadingBenchmarkFluctuationRates,
  getIsLoadingDimensionFluctuationRates,
  getIsLoadingFluctuationRatesForChart,
  getIsLoadingOpenApplications,
  getIsLoadingOpenApplicationsCount,
  getOpenApplications,
  getOpenApplicationsCount,
  getOverviewEntryEmployees,
  getOverviewEntryEmployeesLoading,
  getOverviewExitEmployees,
  getOverviewExitEmployeesLoading,
  getOverviewExternalExitEmployees,
  getOverviewExternalUnforcedExitEmployees,
  getOverviewFluctuationEntriesCount,
  getOverviewFluctuationExitsCount,
  getResignedEmployeesSyncOn,
} from './store/selectors/overview.selector';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let store: MockStore;
  let spectator: Spectator<OverviewComponent>;

  const createComponent = createComponentFactory({
    component: OverviewComponent,
    detectChanges: false,
    imports: [PushPipe, provideTranslocoTestingModule({ en: {} })],
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
      'should set isDimensionFluctuationKpiLoading$',
      marbles((m) => {
        const result = true;
        store.overrideSelector(getIsLoadingDimensionFluctuationRates, result);
        component.ngOnInit();
        m.expect(component.isDimensionFluctuationKpiLoading$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set isBenchmarkFluctuationKpiLoading$',
      marbles((m) => {
        const result = true;
        store.overrideSelector(getIsLoadingBenchmarkFluctuationRates, result);
        component.ngOnInit();
        m.expect(component.isBenchmarkFluctuationKpiLoading$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set dimensionFluctuationKpi$',
      marbles((m) => {
        const result = {} as FluctuationKpi;
        store.overrideSelector(getDimensionFluctuationKpi, result);
        component.ngOnInit();
        m.expect(component.dimensionFluctuationKpi$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set benchmarkFluctuationKpi$',
      marbles((m) => {
        const result = {} as FluctuationKpi;
        store.overrideSelector(getBenchmarkFluctuationKpi, result);
        component.ngOnInit();
        m.expect(component.benchmarkFluctuationKpi$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

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

    test('should set isEntriesExitsLoading$', () => {
      marbles((m) => {
        store.overrideSelector(getIsLoadingFluctuationRatesForChart, true);
        component.ngOnInit();
        m.expect(component.isEntriesExitsLoading$).toBeObservable(
          m.cold('a', {
            a: true,
          })
        );
      });
    });

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
      'should set resignedEmployeesSyncOn$',
      marbles((m) => {
        const result = '12334';
        store.overrideSelector(getResignedEmployeesSyncOn, result);
        component.ngOnInit();
        m.expect(component.resignedEmployeesSyncOn$).toBeObservable(
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
        store.overrideSelector(getDimensionFluctuationRatesForChart, result);
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
        store.overrideSelector(
          getDimensionUnforcedFluctuationRatesForChart,
          result
        );
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

    describe('loadOpenApplicationsData', () => {
      test('should set areOpenApplicationsAvailable$', () => {
        marbles((m) => {
          const result = false as any;
          store.overrideSelector(getAreOpenApplicationsAvailable, result);

          component.ngOnInit();

          m.expect(component.areOpenApplicationsAvailable$).toBeObservable(
            m.cold('a', {
              a: result,
            })
          );
        });
      });

      test('should set openApplications$', () => {
        marbles((m) => {
          const result = [] as OpenApplication[];
          store.overrideSelector(getOpenApplications, result);

          component.ngOnInit();

          m.expect(component.openApplications$).toBeObservable(
            m.cold('a', {
              a: result,
            })
          );
        });
      });

      test('should set openApplicationsLoading$', () => {
        marbles((m) => {
          const result = false as any;
          store.overrideSelector(getIsLoadingOpenApplications, result);

          component.ngOnInit();

          m.expect(component.openApplicationsLoading$).toBeObservable(
            m.cold('a', {
              a: result,
            })
          );
        });
      });

      test('should set openApplicationsCount$', () => {
        marbles((m) => {
          const result = 95;
          store.overrideSelector(getOpenApplicationsCount, result);

          component.ngOnInit();

          m.expect(component.openApplicationsCount$).toBeObservable(
            m.cold('a', {
              a: result,
            })
          );
        });
      });

      test('should set openApplicationsCountLoading$', () => {
        marbles((m) => {
          const result = false;
          store.overrideSelector(getIsLoadingOpenApplicationsCount, result);

          component.ngOnInit();

          m.expect(component.openApplicationsCountLoading$).toBeObservable(
            m.cold('a', {
              a: result,
            })
          );
        });
      });
    });
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
