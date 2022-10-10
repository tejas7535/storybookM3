import { EMPTY } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { RouterReducerState } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { AppRoutePath } from '../../../app-route-path.enum';
import { RouterStateUrl, selectRouterState } from '../../../core/store';
import { getCurrentFilters } from '../../../core/store/selectors';
import { OrganizationalViewService } from '../../../organizational-view/organizational-view.service';
import {
  AttritionOverTime,
  EmployeesRequest,
  FilterDimension,
  TimePeriod,
} from '../../../shared/models';
import {
  FluctuationRatesChartData,
  OpenApplication,
  OverviewExitEntryEmployeesResponse,
  OverviewFluctuationRates,
  ResignedEmployeesResponse,
} from '../../models';
import { OverviewService } from '../../overview.service';
import {
  loadAttritionOverTimeEmployees,
  loadAttritionOverTimeEmployeesFailure,
  loadAttritionOverTimeEmployeesSuccess,
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataFailure,
  loadFluctuationRatesChartDataSuccess,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewFailure,
  loadFluctuationRatesOverviewSuccess,
  loadOpenApplications,
  loadOpenApplicationsCount,
  loadOpenApplicationsCountFailure,
  loadOpenApplicationsCountSuccess,
  loadOpenApplicationsFailure,
  loadOpenApplicationsSuccess,
  loadOverviewData,
  loadOverviewEntryEmployees,
  loadOverviewEntryEmployeesFailure,
  loadOverviewEntryEmployeesSuccess,
  loadOverviewExitEmployees,
  loadOverviewExitEmployeesFailure,
  loadOverviewExitEmployeesSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
} from '../actions/overview.action';
import { OverviewEffects } from './overview.effects';

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

  describe('filterChange', () => {
    test(
      'should return loadOverviewData when url /overview',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.OverviewPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = loadOverviewData();
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

  describe('loadOverviewData$', () => {
    test(
      'loadOverviewData - should do nothing when organization is not set',
      marbles((m) => {
        action = loadOverviewData();
        store.overrideSelector(getCurrentFilters, {} as EmployeesRequest);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.loadOverviewData$).toBeObservable(expected);
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

  describe('loadOverviewFluctuationRates$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadFluctuationRatesOverview({ request });
    });

    test(
      'should return loadFluctuationRatesOverviewSuccess action when REST call is successful',
      marbles((m) => {
        const data: OverviewFluctuationRates = {
          totalEmployeesCount: 0,
          fluctuationRate: { global: 0, dimension: 0 },
          unforcedFluctuationRate: { global: 0, dimension: 0 },
          internalExitCount: 0,
          externalExitCount: 0,
          externalUnforcedExitCount: 0,
          internalEntryCount: 0,
          externalEntryCount: 0,
        };
        const result = loadFluctuationRatesOverviewSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        overviewService.getOverviewFluctuationRates = jest.fn(() => response);

        m.expect(effects.loadOverviewFluctuationRates$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          overviewService.getOverviewFluctuationRates
        ).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadFluctuationRatesOverviewFailure on REST error',
      marbles((m) => {
        const result = loadFluctuationRatesOverviewFailure({
          errorMessage: error.message,
        }) as any;

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        overviewService.getOverviewFluctuationRates = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOverviewFluctuationRates$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          overviewService.getOverviewFluctuationRates
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
    let orgUnit: string;

    beforeEach(() => {
      orgUnit = 'ABC123';
      action = loadResignedEmployees({
        request: {
          filterDimension: FilterDimension.ORG_UNIT,
          value: orgUnit,
        } as EmployeesRequest,
      });
    });
    it(
      'should load data',
      marbles((m) => {
        const data: ResignedEmployeesResponse = {
          employees: [],
          resignedEmployeesCount: 0,
          responseModified: true,
        };
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
        expect(overviewService.getResignedEmployees).toHaveBeenCalledWith(
          FilterDimension.ORG_UNIT,
          orgUnit
        );
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
        expect(overviewService.getResignedEmployees).toHaveBeenCalledWith(
          FilterDimension.ORG_UNIT,
          orgUnit
        );
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
        const data: OverviewExitEntryEmployeesResponse = {
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
        const data: OverviewExitEntryEmployeesResponse = {
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
        const data: OverviewExitEntryEmployeesResponse = {
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
