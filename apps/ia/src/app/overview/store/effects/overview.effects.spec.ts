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
  getCurrentFilters,
  getLast6MonthsTimeRange,
  getSelectedBenchmarkValue,
  getTimeRangeForAllAvailableData,
} from '../../../core/store/selectors';
import {
  EmployeesRequest,
  FilterDimension,
  MonthlyFluctuation,
  MonthlyFluctuationOverTime,
} from '../../../shared/models';
import { SharedService } from '../../../shared/shared.service';
import {
  ExitEntryEmployeesResponse,
  FluctuationRate,
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
import { OverviewEffects } from './overview.effects';

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
  let sharedService: SharedService;
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
        provide: SharedService,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(OverviewEffects);
    overviewService = spectator.inject(OverviewService);
    sharedService = spectator.inject(SharedService);
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
    test(
      'loadAttritionOverTimeOverviewSuccess - should return clearOverviewDimensionData when dimension is not selected',
      marbles((m) => {
        action = loadAttritionOverTimeOverviewSuccess({
          monthlyFluctuation: {} as MonthlyFluctuation,
        });
        store.overrideSelector(getCurrentFilters, {
          value: 'abc',
          timeRange: '123|321',
          filterDimension: undefined,
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-a', { a: clearOverviewDimensionData() });

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
        store.overrideSelector(getCurrentFilters, {
          filterDimension: FilterDimension.BOARD,
          value: 'BR02',
          timeRange: '123|321',
        });

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
        store.overrideSelector(getCurrentFilters, {
          filterDimension: FilterDimension.BOARD,
          value: 'BR02',
          timeRange: '123|321',
        });

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
        store.overrideSelector(getCurrentFilters, {
          filterDimension: FilterDimension.BOARD,
          value: 'BR02',
          timeRange: '123|321',
        });

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
          monthlyFluctuation: {} as MonthlyFluctuation,
        });
        store.overrideSelector(getCurrentFilters, {
          timeRange: '123|231',
          value: 'abc',
          filterDimension: undefined,
        });

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
        store.overrideSelector(getCurrentFilters, {
          value: 'BR02',
          timeRange: '123|321',
          filterDimension: undefined,
        });

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
          monthlyFluctuation: {} as MonthlyFluctuation,
        });
        store.overrideSelector(getCurrentFilters, {
          value: 'BR02',
          timeRange: '123|321',
          filterDimension: undefined,
        });

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
        store.overrideSelector(getCurrentFilters, {
          value: 'BR02',
          timeRange: '123|321',
          filterDimension: undefined,
        });

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
        store.overrideSelector(getCurrentFilters, {
          value: 'BR02',
          timeRange: '123|321',
          filterDimension: undefined,
        });

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
          monthlyFluctuation: {} as MonthlyFluctuation,
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
          monthlyFluctuation: {} as MonthlyFluctuation,
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
        const timeRange = '123|321';
        const monthlyFluctuation = {
          fluctuationRates: { distribution: [1, 2, 3] },
        } as MonthlyFluctuation;
        const result = loadAttritionOverTimeOverviewSuccess({
          monthlyFluctuation,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: monthlyFluctuation,
        });
        const expected = m.cold('--b', { b: result });

        sharedService.getFluctuationRateChartData = jest
          .fn()
          .mockImplementation(() => response);
        store.overrideSelector(getTimeRangeForAllAvailableData, timeRange);

        m.expect(effects.loadAttritionOverTimeOverview$).toBeObservable(
          expected
        );
        m.flush();
        expect(sharedService.getFluctuationRateChartData).toHaveBeenCalledWith({
          filterDimension: FilterDimension.ORG_UNIT,
          value: orgUnit,
          timeRange,
          type: [MonthlyFluctuationOverTime.UNFORCED_LEAVERS],
        });
      })
    );

    test(
      'should return loadAttritionOverTimeOverviewFailure on REST error',
      marbles((m) => {
        const timeRange = '123|321';
        const result = loadAttritionOverTimeOverviewFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        sharedService.getFluctuationRateChartData = jest
          .fn()
          .mockImplementation(() => response);
        store.overrideSelector(getTimeRangeForAllAvailableData, timeRange);

        m.expect(effects.loadAttritionOverTimeOverview$).toBeObservable(
          expected
        );
        m.flush();
        expect(sharedService.getFluctuationRateChartData).toHaveBeenCalledWith({
          filterDimension: FilterDimension.ORG_UNIT,
          value: orgUnit,
          timeRange,
          type: [MonthlyFluctuationOverTime.UNFORCED_LEAVERS],
        });
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
          responseModified: false,
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
    const monthlyFluctuation = {
      fluctuationRates: { distribution: [1, 2, 3] },
    } as MonthlyFluctuation;

    beforeEach(() => {
      request = {
        timeRange: '123|456',
        type: [
          MonthlyFluctuationOverTime.FLUCTUATION_RATES,
          MonthlyFluctuationOverTime.UNFORCED_FLUCTUATION_RATES,
        ],
        filterDimension: FilterDimension.ORG_UNIT,
        value: 'ABC123',
      } as EmployeesRequest;
      action = loadFluctuationRatesChartData({ request });
    });
    it(
      'should load data',
      marbles((m) => {
        const result = loadFluctuationRatesChartDataSuccess({
          monthlyFluctuation,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: monthlyFluctuation,
        });
        const expected = m.cold('--b', { b: result });

        sharedService.getFluctuationRateChartData = jest.fn(() => response);
        store.overrideSelector(getLast6MonthsTimeRange, request.timeRange);

        m.expect(effects.loadFluctuationRatesChartData$).toBeObservable(
          expected
        );
        m.flush();
        expect(sharedService.getFluctuationRateChartData).toHaveBeenCalledWith(
          request
        );
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

        sharedService.getFluctuationRateChartData = jest
          .fn()
          .mockImplementation(() => response);
        store.overrideSelector(getLast6MonthsTimeRange, request.timeRange);

        m.expect(effects.loadFluctuationRatesChartData$).toBeObservable(
          expected
        );
        m.flush();
        expect(sharedService.getFluctuationRateChartData).toHaveBeenCalledWith(
          request
        );
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
});
