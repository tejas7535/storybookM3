import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import {
  filterSelected,
  timeRangeSelected,
  triggerLoad,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import {
  EmployeesRequest,
  LostJobProfile,
  SelectedFilter,
} from '../../../shared/models';
import { EmployeeService } from '../../../shared/services/employee.service';
import {
  loadLostJobProfiles,
  loadLostJobProfilesFailure,
  loadLostJobProfilesSuccess,
} from '../actions/loss-of-skills.actions';
import { LossOfSkillsEffects } from './loss-of-skills.effects';

describe('LossOfSkills Effects', () => {
  let spectator: SpectatorService<LossOfSkillsEffects>;
  let actions$: any;
  let employeesService: EmployeeService;
  let action: any;
  let effects: LossOfSkillsEffects;
  let store: MockStore;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: LossOfSkillsEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: EmployeeService,
        useValue: {
          getLostJobProfiles: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(LossOfSkillsEffects);
    employeesService = spectator.inject(EmployeeService);
    store = spectator.inject(MockStore);
  });

  describe('filterChange$', () => {
    test('filterSelected - should trigger loadLostJobProfiles if orgUnit is set', () => {
      const filter = new SelectedFilter('orgUnit', 'best');
      const request = ({ orgUnit: {} } as unknown) as EmployeesRequest;
      action = filterSelected({ filter });
      store.overrideSelector(getCurrentFiltersAndTime, request);
      const resultJobProfiles = loadLostJobProfiles({ request });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: resultJobProfiles });

      expect(effects.filterChange$).toBeObservable(expected);
    });

    test('timeRangeSelected - should trigger loadLostJobProfiles if timerange is set', () => {
      const timeRange = '123|456';
      const request = ({ orgUnit: {} } as unknown) as EmployeesRequest;
      action = timeRangeSelected({ timeRange });
      store.overrideSelector(getCurrentFiltersAndTime, request);
      const resultJobProfiles = loadLostJobProfiles({ request });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: resultJobProfiles });

      expect(effects.filterChange$).toBeObservable(expected);
    });

    test('filterSelected - should do nothing when organization is not set', () => {
      const filter = new SelectedFilter('nice', 'best');
      action = filterSelected({ filter });
      store.overrideSelector(getCurrentFiltersAndTime, {});

      actions$ = hot('-a', { a: action });
      const expected = cold('--');

      expect(effects.filterChange$).toBeObservable(expected);
    });

    test('timeRangeSelected - should do nothing when organization is not set', () => {
      const timeRange = '123|456';
      action = timeRangeSelected({ timeRange });
      store.overrideSelector(getCurrentFiltersAndTime, {});

      actions$ = hot('-a', { a: action });
      const expected = cold('--');

      expect(effects.filterChange$).toBeObservable(expected);
    });
  });

  describe('loadLostJobProfiles$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = ({} as unknown) as EmployeesRequest;
      action = loadLostJobProfiles({ request });
    });

    test('should return loadLostJobProfilesSuccess action when REST call is successful', () => {
      const lostJobProfiles: LostJobProfile[] = [
        {
          amountOfEmployees: 10,
          amountOfLeavers: 3,
          job: 'Data Scientist',
          employees: [],
          leavers: [],
          openPositions: 1,
        },
        {
          amountOfEmployees: 10,
          amountOfLeavers: 3,
          job: 'Software Engineer',
          employees: [],
          leavers: [],
          openPositions: 1,
        },
      ];
      const result = loadLostJobProfilesSuccess({
        lostJobProfiles,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: lostJobProfiles,
      });
      const expected = cold('--b', { b: result });

      employeesService.getLostJobProfiles = jest.fn(() => response);

      expect(effects.loadLostJobProfiles$).toBeObservable(expected);
      expect(employeesService.getLostJobProfiles).toHaveBeenCalledWith(request);
    });

    test('should return loadLostJobProfilesFailure on REST error', () => {
      const result = loadLostJobProfilesFailure({
        errorMessage: error.message,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      employeesService.getLostJobProfiles = jest.fn(() => response);

      expect(effects.loadLostJobProfiles$).toBeObservable(expected);
      expect(employeesService.getLostJobProfiles).toHaveBeenCalledWith(request);
    });
  });

  describe('ngrxOnInitEffects', () => {
    it('should return triggerLoad Action', () => {
      expect(effects.ngrxOnInitEffects()).toEqual(triggerLoad());
    });
  });
});
