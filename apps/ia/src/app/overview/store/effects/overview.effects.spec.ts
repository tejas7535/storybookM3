import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { filterSelected, triggerLoad } from '../../../core/store/actions';
import { getCurrentFilters } from '../../../core/store/selectors';
import { OrganizationalViewService } from '../../../organizational-view/organizational-view.service';
import {
  AttritionOverTime,
  EmployeesRequest,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import {
  FluctuationRatesChartData,
  OpenApplication,
  OverviewFluctuationRates,
  ResignedEmployee,
} from '../../models';
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
  loadOpenApplications,
  loadOpenApplicationsFailure,
  loadOpenApplicationsSuccess,
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
      'filterSelected - should do nothing when organization is not set',
      marbles((m) => {
        const filter = new SelectedFilter('nice', {
          id: 'best',
          value: 'best',
        });
        action = filterSelected({ filter });
        store.overrideSelector(getCurrentFilters, {});

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

        organizationalViewService.getAttritionOverTime = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAttritionOverTimeOverview$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          organizationalViewService.getAttritionOverTime
        ).toHaveBeenCalledWith(request, TimePeriod.LAST_THREE_YEARS);
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
        ).toHaveBeenCalledWith(request, TimePeriod.LAST_THREE_YEARS);
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
          entryEmployees: [],
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

        overviewService.getUnforcedFluctuationRateChartData = jest.fn(
          () => response
        );

        m.expect(effects.loadUnforcedFluctuationRatesChartData$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          overviewService.getUnforcedFluctuationRateChartData
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

        overviewService.getUnforcedFluctuationRateChartData = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadUnforcedFluctuationRatesChartData$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          overviewService.getUnforcedFluctuationRateChartData
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

  describe('loadOpenApplications', () => {
    let orgUnit: string;

    beforeEach(() => {
      orgUnit = 'ABC123';
      action = loadOpenApplications({ orgUnit });
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
          orgUnit
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
