import { EMPTY } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { RouterReducerState } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { AppRoutePath } from '../../../app-route-path.enum';
import { RouterStateUrl, selectRouterState } from '../../../core/store';
import {
  getCurrentBenchmarkFilters,
  getCurrentDimensionValue,
  getCurrentFilters,
  getSelectedBenchmarkValue,
} from '../../../core/store/selectors';
import { OrganizationalViewService } from '../../../organizational-view/organizational-view.service';
import {
  AttritionOverTime,
  EmployeesRequest,
  FilterDimension,
  TimePeriod,
} from '../../../shared/models';
import {
  ExitEntryEmployeesResponse,
  FluctuationRate,
  FluctuationRatesChartData,
  OpenApplication,
  OverviewWorkforceBalanceMeta,
  ResignedEmployeesResponse,
} from '../../models';
import { OverviewService } from '../../overview.service';
import {
  clearOverviewBenchmarkData,
  clearOverviewDimensionData,
  loadAttritionOverTimeEmployees,
  loadAttritionOverTimeEmployeesFailure,
  loadAttritionOverTimeEmployeesSuccess,
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadBenchmarkFluctuationRates,
  loadBenchmarkFluctuationRatesChartData,
  loadBenchmarkFluctuationRatesChartDataSuccess,
  loadFluctuationRates,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataFailure,
  loadFluctuationRatesChartDataSuccess,
  loadFluctuationRatesFailure,
  loadFluctuationRatesSuccess,
  loadOpenApplications,
  loadOpenApplicationsCount,
  loadOpenApplicationsCountFailure,
  loadOpenApplicationsCountSuccess,
  loadOpenApplicationsFailure,
  loadOpenApplicationsSuccess,
  loadOverviewBenchmarkData,
  loadOverviewDimensionData,
  loadOverviewEntryEmployees,
  loadOverviewEntryEmployeesFailure,
  loadOverviewEntryEmployeesSuccess,
  loadOverviewExitEmployees,
  loadOverviewExitEmployeesFailure,
  loadOverviewExitEmployeesSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
  loadWorkforceBalanceMeta,
  loadWorkforceBalanceMetaFailure,
  loadWorkforceBalanceMetaSuccess,
} from '../actions/overview.action';
import { EmployeesRequests, OverviewEffects } from './overview.effects';

jest.mock('../../../core/store/reducers/filter/filter.reducer', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  ...jest.requireActual<any>(
    '../../../core/store/reducers/filter/filter.reducer'
  ),
  initialTimeRange: '654-321',
}));

describe('Overview Effects', () => {
  let spectator: SpectatorService<OverviewEffects>;
  let actions$: any;
  let overviewService: OverviewService;
  let organizationalViewService: OrganizationalViewService;
  let action: any;
  let effects: OverviewEffects;
  let store: MockStore;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: OverviewEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: OverviewService,
        useValue: {
          getResignedEmployees: jest.fn(),
        },
      },
      {
        provide: OrganizationalViewService,
        useValue: {
          getResignedEmployees: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(OverviewEffects);
    overviewService = spectator.inject(OverviewService);
    organizationalViewService = spectator.inject(OrganizationalViewService);
    store = spectator.inject(MockStore);
  });

  describe('filterChange$', () => {
    test(
      'should return loadOverviewDimensionData when url /overview',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.OverviewPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = loadOverviewDimensionData();
        actions$ = m.hot('-', { a: action });
        const expected = m.cold('-');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'should not return loadOverviewData when url different than /overview',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/different-path`,
          },
        } as RouterReducerState<RouterStateUrl>);
        actions$ = m.hot('-', { a: EMPTY });
        const expected = m.cold('-');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );
  });

  describe('benchmarkFilterChange$', () => {
    test(
      'should return loadOverviewBenchmarkData when url /overview',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.OverviewPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = loadOverviewBenchmarkData();
        actions$ = m.hot('-', { a: action });
        const expected = m.cold('-');

        m.expect(effects.benchmarkFilterChange$).toBeObservable(expected);
      })
    );

    test(
      'should not return loadOverviewData when url different than /overview',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/different-path`,
          },
        } as RouterReducerState<RouterStateUrl>);
        actions$ = m.hot('-', { a: EMPTY });
        const expected = m.cold('-');

        m.expect(effects.benchmarkFilterChange$).toBeObservable(expected);
      })
    );
  });

  describe('loadOverviewDimensionData$', () => {
    test(
      'loadOverviewDimensionData - should do nothing when diemnsion value is not set',
      marbles((m) => {
        action = loadOverviewDimensionData();
        store.overrideSelector(getCurrentFilters, {} as EmployeesRequest);
        store.overrideSelector(
          getCurrentBenchmarkFilters,
          {} as EmployeesRequest
        );

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.loadOverviewDimensionData$).toBeObservable(expected);
      })
    );

    test(
      'should return dimension overview data',
      marbles((m) => {
        const selectedDimensionRequest = {
          filterDimension: FilterDimension.ORG_UNIT,
          value: '9595',
          timeRange: '123-321',
        };
        store.overrideSelector(getCurrentFilters, selectedDimensionRequest);

        action = loadOverviewDimensionData();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bcdefg)', {
          b: loadFluctuationRates({
            request: selectedDimensionRequest,
          }),
          c: loadAttritionOverTimeOverview({
            request: selectedDimensionRequest,
          }),
          d: loadWorkforceBalanceMeta({ request: selectedDimensionRequest }),
          e: loadFluctuationRatesChartData({
            request: selectedDimensionRequest,
          }),
          f: loadResignedEmployees(),
          g: loadOpenApplicationsCount({ request: selectedDimensionRequest }),
        });

        m.expect(effects.loadOverviewDimensionData$).toBeObservable(expected);
      })
    );

    describe('loadOverviewBenchmarkData$', () => {
      test(
        'loadOverviewBenchmarkData - should do nothing when diemnsion value is not set',
        marbles((m) => {
          action = loadOverviewBenchmarkData();
          store.overrideSelector(getCurrentFilters, {} as EmployeesRequest);
          store.overrideSelector(
            getCurrentBenchmarkFilters,
            {} as EmployeesRequest
          );

          actions$ = m.hot('-a', { a: action });
          const expected = m.cold('--');

          m.expect(effects.loadOverviewBenchmarkData$).toBeObservable(expected);
        })
      );

      test(
        'should return benchmark overview data',
        marbles((m) => {
          const benchmarkRequest = {
            filterDimension: FilterDimension.REGION,
            value: 'DE',
            timeRange: '997-997',
          };
          store.overrideSelector(getCurrentBenchmarkFilters, benchmarkRequest);

          action = loadOverviewBenchmarkData();
          actions$ = m.hot('-a', { a: action });

          const expected = m.cold('-(bc)', {
            b: loadBenchmarkFluctuationRates({ request: benchmarkRequest }),
            c: loadBenchmarkFluctuationRatesChartData({
              request: benchmarkRequest,
            }),
          });

          m.expect(effects.loadOverviewBenchmarkData$).toBeObservable(expected);
        })
      );

      test(
        'should do nothing when benchmark request field is missing',
        marbles((m) => {
          const benchmarkRequest = {
            filterDimension: undefined as FilterDimension,
            value: 'DE',
            timeRange: '997-997',
          };
          store.overrideSelector(getCurrentBenchmarkFilters, benchmarkRequest);

          action = loadOverviewBenchmarkData();
          actions$ = m.hot('-a', { a: action });

          const expected = m.cold('--');

          m.expect(effects.loadOverviewBenchmarkData$).toBeObservable(expected);
        })
      );

      test(
        'should do nothing when selected dimension request field is missing',
        marbles((m) => {
          const benchmarkRequest = {
            filterDimension: undefined as FilterDimension,
            value: 'DE',
            timeRange: '997-997',
          };
          store.overrideSelector(getCurrentBenchmarkFilters, benchmarkRequest);

          action = loadOverviewBenchmarkData();
          actions$ = m.hot('-a', { a: action });

          const expected = m.cold('--');

          m.expect(effects.loadOverviewBenchmarkData$).toBeObservable(expected);
        })
      );
    });
  });

  describe('clearDimensionDataOnDimensionChange$', () => {
    const value = 'ABC';

    test(
      'loadAttritionOverTimeOverviewSuccess - should do nothing when dimension selected',
      marbles((m) => {
        action = loadAttritionOverTimeOverviewSuccess({
          data: {} as AttritionOverTime,
        });
        store.overrideSelector(getCurrentDimensionValue, value);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadFluctuationRatesOverviewSuccess - should do nothing when dimension selected',
      marbles((m) => {
        action = loadWorkforceBalanceMetaSuccess({
          data: {} as OverviewWorkforceBalanceMeta,
        });
        store.overrideSelector(getCurrentDimensionValue, value);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadFluctuationRatesChartDataSuccess - should do nothing when dimension selected',
      marbles((m) => {
        action = loadFluctuationRatesChartDataSuccess({
          data: {} as FluctuationRatesChartData,
        });
        store.overrideSelector(getCurrentDimensionValue, value);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadResignedEmployeesSuccess - should do nothing when dimension selected',
      marbles((m) => {
        action = loadResignedEmployeesSuccess({
          data: {} as ResignedEmployeesResponse,
        });
        store.overrideSelector(getCurrentDimensionValue, value);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadOpenApplicationsCountSuccess - should do nothing when dimension selected',
      marbles((m) => {
        action = loadOpenApplicationsCountSuccess({
          openApplicationsCount: 0,
        });
        store.overrideSelector(getCurrentDimensionValue, value);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadAttritionOverTimeOverviewSuccess - should return clearOverviewDimensionData when dimension not selected',
      marbles((m) => {
        action = loadAttritionOverTimeOverviewSuccess({
          data: {} as AttritionOverTime,
        });
        store.overrideSelector(getCurrentDimensionValue, undefined as string);

        actions$ = m.hot('-a', { a: action });
        const result = clearOverviewDimensionData();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadFluctuationRatesOverviewSuccess - should return clearOverviewDimensionData when dimension not selected',
      marbles((m) => {
        action = loadWorkforceBalanceMetaSuccess({
          data: {} as OverviewWorkforceBalanceMeta,
        });
        store.overrideSelector(getCurrentDimensionValue, undefined as string);

        actions$ = m.hot('-a', { a: action });
        const result = clearOverviewDimensionData();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadFluctuationRatesChartDataSuccess - should return clearOverviewDimensionData when dimension not selected',
      marbles((m) => {
        action = loadFluctuationRatesChartDataSuccess({
          data: {} as FluctuationRatesChartData,
        });
        store.overrideSelector(getCurrentDimensionValue, undefined as string);

        actions$ = m.hot('-a', { a: action });
        const result = clearOverviewDimensionData();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadResignedEmployeesSuccess - should return clearOverviewDimensionData when dimension not selected',
      marbles((m) => {
        action = loadResignedEmployeesSuccess({
          data: {} as ResignedEmployeesResponse,
        });
        store.overrideSelector(getCurrentDimensionValue, undefined as string);

        actions$ = m.hot('-a', { a: action });
        const result = clearOverviewDimensionData();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadOpenApplicationsCountSuccess - should return clearOverviewDimensionData when dimension not selected',
      marbles((m) => {
        action = loadOpenApplicationsCountSuccess({
          openApplicationsCount: 0,
        });
        store.overrideSelector(getCurrentDimensionValue, undefined as string);

        actions$ = m.hot('-a', { a: action });
        const result = clearOverviewDimensionData();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );
  });

  describe('clearBenchmarkDataOnBenchmarkChange$', () => {
    const value = 'ABC';

    test(
      'loadBenchmarkFluctuationRatesChartDataSuccess - should do nothing when dimension selected',
      marbles((m) => {
        action = loadBenchmarkFluctuationRatesChartDataSuccess({
          data: {} as FluctuationRatesChartData,
        });
        store.overrideSelector(getSelectedBenchmarkValue, value);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadBenchmarkFluctuationRatesChartDataSuccess - should return clearOverviewBenchmarkData when dimension not selected',
      marbles((m) => {
        action = loadBenchmarkFluctuationRatesChartDataSuccess({
          data: {} as FluctuationRatesChartData,
        });
        store.overrideSelector(getSelectedBenchmarkValue, undefined as string);

        actions$ = m.hot('-a', { a: action });
        const result = clearOverviewBenchmarkData();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.clearBenchmarkDataOnBenchmarkChange$).toBeObservable(
          expected
        );
      })
    );
  });

  describe('loadAttritionOverTimeOverview$', () => {
    let orgUnit: string;

    beforeEach(() => {
      orgUnit = 'ACB';
      action = loadAttritionOverTimeOverview({
        request: {
          filterDimension: FilterDimension.ORG_UNIT,
          value: orgUnit,
        } as EmployeesRequest,
      });
    });

    test(
      'should return loadAttritionOverTimeOverviewSuccess action when REST call is successful',
      marbles((m) => {
        const data: AttritionOverTime = { data: {} };
        const result = loadAttritionOverTimeOverviewSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        organizationalViewService.getAttritionOverTime = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAttritionOverTimeOverview$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          organizationalViewService.getAttritionOverTime
        ).toHaveBeenCalledWith(
          FilterDimension.ORG_UNIT,
          orgUnit,
          TimePeriod.LAST_THREE_YEARS
        );
      })
    );

    test(
      'should return loadAttritionOverTimeOverviewFailure on REST error',
      marbles((m) => {
        const result = loadAttritionOverTimeOverviewFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        organizationalViewService.getAttritionOverTime = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAttritionOverTimeOverview$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          organizationalViewService.getAttritionOverTime
        ).toHaveBeenCalledWith(
          FilterDimension.ORG_UNIT,
          orgUnit,
          TimePeriod.LAST_THREE_YEARS
        );
      })
    );
  });

  describe('loadWorkforceBalanceMeta$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadWorkforceBalanceMeta({ request });
    });

    test(
      'should return loadWorkforceBalanceMetaSuccess action when REST call is successful',
      marbles((m) => {
        const data: OverviewWorkforceBalanceMeta = {
          totalEmployeesCount: 0,
          internalExitCount: 0,
          externalExitCount: 0,
          externalUnforcedExitCount: 0,
          internalEntryCount: 0,
          externalEntryCount: 0,
        };
        const result = loadWorkforceBalanceMetaSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        overviewService.getOverviewWorkforceBalanceMeta = jest.fn(
          () => response
        );

        m.expect(effects.loadWorkforceBalanceMeta$).toBeObservable(expected);
        m.flush();
        expect(
          overviewService.getOverviewWorkforceBalanceMeta
        ).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadWorkforceBalanceMetaFailure on REST error',
      marbles((m) => {
        const result = loadWorkforceBalanceMetaFailure({
          errorMessage: error.message,
        }) as any;

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        overviewService.getOverviewWorkforceBalanceMeta = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadWorkforceBalanceMeta$).toBeObservable(expected);
        m.flush();
        expect(
          overviewService.getOverviewWorkforceBalanceMeta
        ).toHaveBeenCalledWith(request);
      })
    );
  });

  describe('loadFluctuationRates$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadFluctuationRates({ request });
    });

    test(
      'should return loadFluctuationRatesSuccess action when REST call is successful',
      marbles((m) => {
        const data: FluctuationRate = {
          fluctuationRate: 1,
          unforcedFluctuationRate: 2,
        };
        const result = loadFluctuationRatesSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        overviewService.getFluctuationRates = jest.fn(() => response);

        m.expect(effects.loadFluctuationRates$).toBeObservable(expected);
        m.flush();
        expect(overviewService.getFluctuationRates).toHaveBeenCalledWith(
          request
        );
      })
    );

    test(
      'should return loadFluctuationRatesFailure on REST error',
      marbles((m) => {
        const result = loadFluctuationRatesFailure({
          errorMessage: error.message,
        }) as any;

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        overviewService.getFluctuationRates = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadFluctuationRates$).toBeObservable(expected);
        m.flush();
        expect(
          overviewService.getOverviewWorkforceBalanceMeta
        ).toHaveBeenCalledWith(request);
      })
    );
  });

  describe('loadFluctuationRatesChartData', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadFluctuationRatesChartData({ request });
    });
    it(
      'should load data',
      marbles((m) => {
        const data = {} as FluctuationRatesChartData;
        const result = loadFluctuationRatesChartDataSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        overviewService.getFluctuationRateChartData = jest.fn(() => response);

        m.expect(effects.loadFluctuationRatesChartData$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          overviewService.getFluctuationRateChartData
        ).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadFluctuationRatesChartDataFailure on REST error',
      marbles((m) => {
        const result = loadFluctuationRatesChartDataFailure({
          errorMessage: error.message,
        }) as any;

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        overviewService.getFluctuationRateChartData = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadFluctuationRatesChartData$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          overviewService.getFluctuationRateChartData
        ).toHaveBeenCalledWith(request);
      })
    );
  });

  describe('loadResignedEmployees', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: 'ABC123',
        timeRange: '123|456',
      };
      action = loadResignedEmployees();
    });

    it(
      'should load data',
      marbles((m) => {
        const data: ResignedEmployeesResponse = {
          employees: [],
          resignedEmployeesCount: 0,
          responseModified: true,
          synchronizedOn: '123',
        };
        store.overrideSelector(getCurrentFilters, request);

        const result = loadResignedEmployeesSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        overviewService.getResignedEmployees = jest.fn(() => response);

        m.expect(effects.loadResignedEmployees$).toBeObservable(expected);
        m.flush();
        expect(overviewService.getResignedEmployees).toHaveBeenCalledWith({
          filterDimension: request.filterDimension,
          value: request.value,
        } as EmployeesRequest);
      })
    );

    test(
      'should return loadResignedEmployeesFailure on REST error',
      marbles((m) => {
        const result = loadResignedEmployeesFailure({
          errorMessage: error.message,
        }) as any;

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        overviewService.getResignedEmployees = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadResignedEmployees$).toBeObservable(expected);
        m.flush();
        expect(overviewService.getResignedEmployees).toHaveBeenCalledWith({
          filterDimension: request.filterDimension,
          value: request.value,
        } as EmployeesRequest);
      })
    );
  });

  describe('loadOpenApplications', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      action = loadOpenApplications();
      request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: 'ABC123',
      } as EmployeesRequest;

      store.overrideSelector(getCurrentFilters, request);
    });
    it(
      'should load data',
      marbles((m) => {
        const data: OpenApplication[] = [];
        const result = loadOpenApplicationsSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        overviewService.getOpenApplications = jest.fn(() => response);

        m.expect(effects.loadOpenApplications$).toBeObservable(expected);
        m.flush();
        expect(overviewService.getOpenApplications).toHaveBeenCalledWith(
          request
        );
      })
    );

    test(
      'should return loadOpenApplicationsFailure on REST error',
      marbles((m) => {
        const result = loadOpenApplicationsFailure({
          errorMessage: error.message,
        }) as any;

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        overviewService.getOpenApplications = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOpenApplications$).toBeObservable(expected);
        m.flush();
        expect(overviewService.getOpenApplications).toHaveBeenCalledWith(
          request
        );
      })
    );
  });

  describe('loadOpenApplicationsCount', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: 'ABC123',
      } as EmployeesRequest;
      action = loadOpenApplicationsCount({
        request,
      });
    });
    it(
      'should load data',
      marbles((m) => {
        const openApplicationsCount = 32;
        const result = loadOpenApplicationsCountSuccess({
          openApplicationsCount,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: openApplicationsCount,
        });
        const expected = m.cold('--b', { b: result });

        overviewService.getOpenApplicationsCount = jest.fn(() => response);

        m.expect(effects.loadOpenApplicationsCount$).toBeObservable(expected);
        m.flush();
        expect(overviewService.getOpenApplicationsCount).toHaveBeenCalledWith(
          request
        );
      })
    );

    test(
      'should return loadOpenApplicationsCountFailure on REST error',
      marbles((m) => {
        const result = loadOpenApplicationsCountFailure({
          errorMessage: error.message,
        }) as any;

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        overviewService.getOpenApplicationsCount = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOpenApplicationsCount$).toBeObservable(expected);
        m.flush();
        expect(overviewService.getOpenApplicationsCount).toHaveBeenCalledWith(
          request
        );
      })
    );
  });

  describe('loadOverviewExitEmployees$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadOverviewExitEmployees();
      store.overrideSelector(getCurrentFilters, request);
    });

    test(
      'should return loadOverviewExitEmployeesSuccess action when REST call is successful',
      marbles((m) => {
        const data: ExitEntryEmployeesResponse = {
          employees: [],
          responseModified: true,
        };
        const result = loadOverviewExitEmployeesSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        overviewService.getOverviewExitEmployees = jest.fn(() => response);

        m.expect(effects.loadOverviewExitEmployees$).toBeObservable(expected);
        m.flush();
        expect(overviewService.getOverviewExitEmployees).toHaveBeenCalledWith(
          request
        );
      })
    );

    test(
      'should return loadOverviewExitEmployeesFailure on REST error',
      marbles((m) => {
        const result = loadOverviewExitEmployeesFailure({
          errorMessage: error.message,
        }) as any;

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        overviewService.getOverviewExitEmployees = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOverviewExitEmployees$).toBeObservable(expected);
        m.flush();
        expect(overviewService.getOverviewExitEmployees).toHaveBeenCalledWith(
          request
        );
      })
    );
  });

  describe('loadOverviewEntryEmployees$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadOverviewEntryEmployees();
      store.overrideSelector(getCurrentFilters, request);
    });

    test(
      'should return loadOverviewEntryEmployeesSuccess action when REST call is successful',
      marbles((m) => {
        const data: ExitEntryEmployeesResponse = {
          employees: [],
          responseModified: true,
        };
        const result = loadOverviewEntryEmployeesSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        overviewService.getOverviewEntryEmployees = jest.fn(() => response);

        m.expect(effects.loadOverviewEntryEmployees$).toBeObservable(expected);
        m.flush();
        expect(overviewService.getOverviewEntryEmployees).toHaveBeenCalledWith(
          request
        );
      })
    );

    test(
      'should return loadOverviewEntryEmployeesFailure on REST error',
      marbles((m) => {
        const result = loadOverviewEntryEmployeesFailure({
          errorMessage: error.message,
        }) as any;

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        overviewService.getOverviewEntryEmployees = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOverviewEntryEmployees$).toBeObservable(expected);
        m.flush();
        expect(overviewService.getOverviewEntryEmployees).toHaveBeenCalledWith(
          request
        );
      })
    );
  });

  describe('loadAttritionOverTimeEmployees$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadAttritionOverTimeEmployees(request);
      store.overrideSelector(getCurrentFilters, request);
    });

    test(
      'should return loadAttritionOverTimeEmployeesSuccess action when REST call is successful',
      marbles((m) => {
        const data: ExitEntryEmployeesResponse = {
          employees: [],
          responseModified: true,
        };
        const result = loadAttritionOverTimeEmployeesSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        overviewService.getAttritionOverTimeEmployees = jest.fn(() => response);

        m.expect(effects.loadAttritionOverTimeEmployees$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          overviewService.getAttritionOverTimeEmployees
        ).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadAttritionOverTimeEmployeesFailure on REST error',
      marbles((m) => {
        const result = loadAttritionOverTimeEmployeesFailure({
          errorMessage: error.message,
        }) as any;

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        overviewService.getAttritionOverTimeEmployees = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAttritionOverTimeEmployees$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          overviewService.getAttritionOverTimeEmployees
        ).toHaveBeenCalledWith(request);
      })
    );
  });

  describe('areRquiredFieldsDefined', () => {
    test('should return true when all required fields defined', () => {
      const request: EmployeesRequests = {
        selectedFilterRequest: {
          filterDimension: FilterDimension.ORG_UNIT,
          timeRange: '1-1',
          value: 'abc',
        },
        benchmarkRequest: {
          filterDimension: FilterDimension.ORG_UNIT,
          timeRange: '1-1',
          value: 'abc',
        },
      };

      const result = effects.areRquiredFieldsDefined(request);

      expect(result).toBeTruthy();
    });

    test('should return false when one required field of selected filter request is missing', () => {
      const request: EmployeesRequests = {
        selectedFilterRequest: {
          filterDimension: FilterDimension.ORG_UNIT,
          timeRange: undefined,
          value: 'abc',
        },
        benchmarkRequest: {
          filterDimension: FilterDimension.ORG_UNIT,
          timeRange: '1-1',
          value: 'abc',
        },
      };

      const result = effects.areRquiredFieldsDefined(request);

      expect(result).toBeFalsy();
    });

    test('should return false when one required field of benchmark request is missing', () => {
      const request: EmployeesRequests = {
        selectedFilterRequest: {
          filterDimension: FilterDimension.ORG_UNIT,
          timeRange: '1-1',
          value: 'abc',
        },
        benchmarkRequest: {
          filterDimension: undefined,
          timeRange: '1-1',
          value: 'abc',
        },
      };

      const result = effects.areRquiredFieldsDefined(request);

      expect(result).toBeFalsy();
    });
  });
});
