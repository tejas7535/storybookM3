import { EMPTY } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { RouterReducerState } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { AppRoutePath } from '../../../app-route-path.enum';
import { RouterStateUrl, selectRouterState } from '../../../core/store';
import { filterSelected } from '../../../core/store/actions';
import {
  getCurrentDimensionValue,
  getCurrentFilters,
} from '../../../core/store/selectors';
import { ExitEntryEmployeesResponse } from '../../../overview/models';
import {
  EmployeesRequest,
  FilterDimension,
  SelectedFilter,
} from '../../../shared/models';
import { LossOfSkillService } from '../../loss-of-skill.service';
import { LostJobProfilesResponse, WorkforceResponse } from '../../models';
import {
  clearLossOfSkillDimensionData,
  loadJobProfiles,
  loadJobProfilesFailure,
  loadJobProfilesSuccess,
  loadLossOfSkillData,
  loadLossOfSkillLeavers,
  loadLossOfSkillLeaversFailure,
  loadLossOfSkillLeaversSuccess,
  loadLossOfSkillWorkforce,
  loadLossOfSkillWorkforceFailure,
  loadLossOfSkillWorkforceSuccess,
} from '../actions/loss-of-skill.actions';
import { LossOfSkillEffects } from './loss-of-skill.effects';

describe('LossOfSkill Effects', () => {
  let spectator: SpectatorService<LossOfSkillEffects>;
  let actions$: any;
  let lossOfSkillService: LossOfSkillService;
  let action: any;
  let effects: LossOfSkillEffects;
  let store: MockStore;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: LossOfSkillEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: LossOfSkillService,
        useValue: {
          getLostJobProfiles: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(LossOfSkillEffects);
    lossOfSkillService = spectator.inject(LossOfSkillService);
    store = spectator.inject(MockStore);
  });

  describe('filterChange$', () => {
    test(
      'should return loadLossOfSkillData when url /loss-of-skill',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.LossOfSkillPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = loadLossOfSkillData();
        actions$ = m.hot('-', { a: action });
        const expected = m.cold('-');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'should not return loadLossOfSkillData when url different than /loss-of-skill',
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

  describe('loadLossOfSkillData$', () => {
    test(
      'loadLossOfSkillData - should trigger loadLostJobProfiles if orgUnit is set',
      marbles((m) => {
        const request = {
          filterDimension: FilterDimension.ORG_UNIT,
          value: 'AVC',
          timeRange: '12',
        } as EmployeesRequest;
        action = loadLossOfSkillData();
        store.overrideSelector(getCurrentFilters, request);
        const resultJobProfiles = loadJobProfiles({ request });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', {
          b: resultJobProfiles,
        });

        m.expect(effects.loadLossOfSkillData$).toBeObservable(expected);
      })
    );

    test(
      'filterSelected - should do nothing when organization is not set',
      marbles((m) => {
        const filter = new SelectedFilter('nice', {
          id: 'best',
          value: 'best',
        });
        action = filterSelected({ filter });
        store.overrideSelector(getCurrentFilters, {} as EmployeesRequest);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );
  });

  describe('clearDimensionDataOnDimensionChange$', () => {
    const value = 'ABC';

    test(
      'loadJobProfilesSuccess - should trigger loss of skill dimension data clear',
      marbles((m) => {
        action = loadJobProfilesSuccess({
          lostJobProfilesResponse: {} as LostJobProfilesResponse,
        });
        store.overrideSelector(getCurrentDimensionValue, undefined as string);

        actions$ = m.hot('-a', { a: action });
        const result = clearLossOfSkillDimensionData();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadLossOfSkillWorkforceSuccess - should trigger loss of skill dimension data clear',
      marbles((m) => {
        action = loadLossOfSkillWorkforceSuccess({
          data: {} as WorkforceResponse,
        });
        store.overrideSelector(getCurrentDimensionValue, undefined as string);

        actions$ = m.hot('-a', { a: action });
        const result = clearLossOfSkillDimensionData();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadLossOfSkillLeaversSuccess - should trigger loss of skill dimension data clear',
      marbles((m) => {
        action = loadLossOfSkillLeaversSuccess({
          data: {} as ExitEntryEmployeesResponse,
        });
        store.overrideSelector(getCurrentDimensionValue, undefined as string);

        actions$ = m.hot('-a', { a: action });
        const result = clearLossOfSkillDimensionData();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadJobProfilesSuccess - should not trigger loss of skill dimension data clear',
      marbles((m) => {
        action = loadJobProfilesSuccess({
          lostJobProfilesResponse: {} as LostJobProfilesResponse,
        });
        store.overrideSelector(getCurrentDimensionValue, value);

        actions$ = m.hot('-a', { a: action });
        const result = clearLossOfSkillDimensionData();
        const expected = m.cold('--', { b: result });

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadLossOfSkillWorkforceSuccess - should not trigger loss of skill dimension data clear',
      marbles((m) => {
        action = loadLossOfSkillWorkforceSuccess({
          data: {} as WorkforceResponse,
        });
        store.overrideSelector(getCurrentDimensionValue, value);

        actions$ = m.hot('-a', { a: action });
        const result = clearLossOfSkillDimensionData();
        const expected = m.cold('--', { b: result });

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );

    test(
      'loadLossOfSkillLeaversSuccess - should not trigger loss of skill dimension data clear',
      marbles((m) => {
        action = loadLossOfSkillLeaversSuccess({
          data: {} as ExitEntryEmployeesResponse,
        });
        store.overrideSelector(getCurrentDimensionValue, value);

        actions$ = m.hot('-a', { a: action });
        const result = clearLossOfSkillDimensionData();
        const expected = m.cold('--', { b: result });

        m.expect(effects.clearDimensionDataOnDimensionChange$).toBeObservable(
          expected
        );
      })
    );
  });

  describe('loadJobProfiles$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadJobProfiles({ request });
    });

    test(
      'should return loadJobProfilesSuccess action when REST call is successful',
      marbles((m) => {
        const lostJobProfilesResponse = {
          lostJobProfiles: [
            {
              positionDescription: 'Data Scientist',
              employeesCount: 0,
              leaversCount: 0,
            },
            {
              positionDescription: 'Software Engineer',
              employeesCount: 0,
              leaversCount: 0,
            },
          ],
          responseModified: false,
        } as LostJobProfilesResponse;

        const result = loadJobProfilesSuccess({
          lostJobProfilesResponse,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: lostJobProfilesResponse,
        });
        const expected = m.cold('--b', { b: result });

        lossOfSkillService.getJobProfiles = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadJobProfiles$).toBeObservable(expected);
        m.flush();
        expect(lossOfSkillService.getJobProfiles).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadJobProfilesFailure on REST error',
      marbles((m) => {
        const result = loadJobProfilesFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        lossOfSkillService.getJobProfiles = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadJobProfiles$).toBeObservable(expected);
        m.flush();
        expect(lossOfSkillService.getJobProfiles).toHaveBeenCalledWith(request);
      })
    );
  });

  describe('loadLossOfSkillWorkforce$', () => {
    let request: EmployeesRequest;
    const jobKey = 'Developer';

    beforeEach(() => {
      action = loadLossOfSkillWorkforce({ jobKey });
      request = {
        filterDimension: FilterDimension.ORG_UNIT,
        jobKey,
        value: 'AVC',
        timeRange: '12',
      } as EmployeesRequest;
      store.overrideSelector(getCurrentFilters, request);
    });

    test(
      'should return loadLossOfSkillWorkforceSuccess action when REST call is successful',
      marbles((m) => {
        const data: WorkforceResponse = {
          employees: [],
          responseModified: false,
        };

        const result = loadLossOfSkillWorkforceSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        lossOfSkillService.getWorkforce = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadLossOfSkillWorkforce$).toBeObservable(expected);
        m.flush();
        expect(lossOfSkillService.getWorkforce).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadLossOfSkillWorkforceFailure on REST error',
      marbles((m) => {
        const result = loadLossOfSkillWorkforceFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        lossOfSkillService.getWorkforce = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadLossOfSkillWorkforce$).toBeObservable(expected);
        m.flush();
        expect(lossOfSkillService.getWorkforce).toHaveBeenCalledWith(request);
      })
    );
  });

  describe('loadLossOfSkillLeavers$', () => {
    let request: EmployeesRequest;
    const jobKey = 'Developer';

    beforeEach(() => {
      action = loadLossOfSkillLeavers({ jobKey });
      request = {
        filterDimension: FilterDimension.ORG_UNIT,
        jobKey,
        value: 'AVC',
        timeRange: '12',
      } as EmployeesRequest;
      store.overrideSelector(getCurrentFilters, request);
    });

    test(
      'should return loadLossOfSkillLeaversSuccess action when REST call is successful',
      marbles((m) => {
        const data: ExitEntryEmployeesResponse = {
          employees: [],
          responseModified: false,
        };

        const result = loadLossOfSkillLeaversSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        lossOfSkillService.getLeavers = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadLossOfSkillLeavers$).toBeObservable(expected);
        m.flush();
        expect(lossOfSkillService.getLeavers).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadLossOfSkillLeaversFailure on REST error',
      marbles((m) => {
        const result = loadLossOfSkillLeaversFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        lossOfSkillService.getLeavers = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadLossOfSkillLeavers$).toBeObservable(expected);
        m.flush();
        expect(lossOfSkillService.getLeavers).toHaveBeenCalledWith(request);
      })
    );
  });
});
