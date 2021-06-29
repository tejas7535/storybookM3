import { marbles } from 'rxjs-marbles/jest';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  filterSelected,
  timeRangeSelected,
  triggerLoad,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import {
  AttritionOverTime,
  EmployeesRequest,
  FluctuationRatesChartData,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import { OverviewFluctuationRates } from '../../../shared/models/overview-fluctuation-rates.model';
import { EmployeeService } from '../../../shared/services/employee.service';
import { ResignedEmployee } from '../../models';
import { OverviewService } from '../../overview.service';
import {
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataFailure,
  loadFluctuationRatesChartDataSuccess,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
  loadUnforcedFluctuationRatesChartData,
  loadUnforcedFluctuationRatesChartDataFailure,
  loadUnforcedFluctuationRatesChartDataSuccess,
} from '../actions/overview.action';
import { OverviewEffects } from './overview.effects';

describe('Overview Effects', () => {
  let spectator: SpectatorService<OverviewEffects>;
  let actions$: any;
  let employeesService: EmployeeService;
  let overviewService: OverviewService;
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
        provide: EmployeeService,
        useValue: {
          getInitialFilters: jest.fn(),
        },
      },
      {
        provide: OverviewService,
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
    employeesService = spectator.inject(EmployeeService);
    overviewService = spectator.inject(OverviewService);
    store = spectator.inject(MockStore);
  });

  describe('filterChange$', () => {
    test(
      'timeRangeSelected - should trigger load actions if orgUnit and time range are set',
      marbles((m) => {
        const timeRange = '123|456';
        const request = {
          orgUnit: 'orgUnit',
          timeRange,
        } as unknown as EmployeesRequest;
        action = timeRangeSelected({ timeRange });
        store.overrideSelector(getCurrentFiltersAndTime, request);

        const resultAttrition = loadAttritionOverTimeOverview({ request });
        const resultFluctuation = loadFluctuationRatesOverview({ request });
        const resultFluctuationChartData = loadFluctuationRatesChartData({
          request,
        });
        const resultUnforcedFluctuationChartData =
          loadUnforcedFluctuationRatesChartData({ request });
        const resultResignedEmployees = loadResignedEmployees({
          orgUnit: request.orgUnit,
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(bcdef)', {
          b: resultAttrition,
          c: resultFluctuation,
          d: resultFluctuationChartData,
          e: resultUnforcedFluctuationChartData,
          f: resultResignedEmployees,
        });
        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'filterSelected - should do nothing when organization is not set',
      marbles((m) => {
        const filter = new SelectedFilter('nice', 'best');
        action = filterSelected({ filter });
        store.overrideSelector(getCurrentFiltersAndTime, {});

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'timeRangeSelected - should do nothing when organization is not set',
      marbles((m) => {
        const timeRange = '123|456';
        action = timeRangeSelected({ timeRange });
        store.overrideSelector(getCurrentFiltersAndTime, {});

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );
  });

  describe('loadAttritionOverTimeOverview$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadAttritionOverTimeOverview({ request });
    });

    test(
      'should return loadAttritionOverTimeOverviewSuccess action when REST call is successful',
      marbles((m) => {
        const data: AttritionOverTime = { events: [], data: {} };
        const result = loadAttritionOverTimeOverviewSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        employeesService.getAttritionOverTime = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAttritionOverTimeOverview$).toBeObservable(
          expected
        );
        m.flush();
        expect(employeesService.getAttritionOverTime).toHaveBeenCalledWith(
          request,
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

        employeesService.getAttritionOverTime = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAttritionOverTimeOverview$).toBeObservable(
          expected
        );
        m.flush();
        expect(employeesService.getAttritionOverTime).toHaveBeenCalledWith(
          request,
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
      'should return loadOverviewFluctuationRatesSuccess action when REST call is successful',
      marbles((m) => {
        const data: OverviewFluctuationRates = {
          allEmployees: [],
          exitEmployees: [],
          fluctuationRate: { company: 0, orgUnit: 0 },
          unforcedFluctuationRate: { company: 0, orgUnit: 0 },
        };
        const result = loadFluctuationRatesOverviewSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        employeesService.getOverviewFluctuationRates = jest.fn(() => response);

        m.expect(effects.loadOverviewFluctuationRates$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          employeesService.getOverviewFluctuationRates
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

        employeesService.getFluctuationRateChartData = jest.fn(() => response);

        m.expect(effects.loadFluctuationRatesChartData$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          employeesService.getFluctuationRateChartData
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

        employeesService.getFluctuationRateChartData = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadFluctuationRatesChartData$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          employeesService.getFluctuationRateChartData
        ).toHaveBeenCalledWith(request);
      })
    );
  });

  describe('loadUnforcedFluctuationRatesChartData', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadUnforcedFluctuationRatesChartData({ request });
    });
    it(
      'should load data',
      marbles((m) => {
        const data = {} as FluctuationRatesChartData;
        const result = loadUnforcedFluctuationRatesChartDataSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        employeesService.getUnforcedFluctuationRateChartData = jest.fn(
          () => response
        );

        m.expect(effects.loadUnforcedFluctuationRatesChartData$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          employeesService.getUnforcedFluctuationRateChartData
        ).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadUnforcedFluctuationRatesChartDataFailure on REST error',
      marbles((m) => {
        const result = loadUnforcedFluctuationRatesChartDataFailure({
          errorMessage: error.message,
        }) as any;

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        employeesService.getUnforcedFluctuationRateChartData = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadUnforcedFluctuationRatesChartData$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          employeesService.getUnforcedFluctuationRateChartData
        ).toHaveBeenCalledWith(request);
      })
    );
  });

  describe('loadResignedEmployees', () => {
    let orgUnit: string;

    beforeEach(() => {
      orgUnit = 'ABC123';
      action = loadResignedEmployees({ orgUnit });
    });
    it(
      'should load data',
      marbles((m) => {
        const data: ResignedEmployee[] = [];
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
          orgUnit
        );
      })
    );
  });

  describe('ngrxOnInitEffects', () => {
    it('should return triggerLoad Action', () => {
      expect(effects.ngrxOnInitEffects()).toEqual(triggerLoad());
    });
  });
});
