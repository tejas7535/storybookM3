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
import { EmployeesRequest, SelectedFilter } from '../../../shared/models';
import { LossOfSkillService } from '../../loss-of-skill.service';
import { LostJobProfile } from '../../models';
import {
  loadLostJobProfiles,
  loadLostJobProfilesFailure,
  loadLostJobProfilesSuccess,
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
      'filterSelected - should trigger loadLostJobProfiles if orgUnit is set',
      marbles((m) => {
        const filter = new SelectedFilter('orgUnit', 'best');
        const request = { orgUnit: {} } as unknown as EmployeesRequest;
        action = filterSelected({ filter });
        store.overrideSelector(getCurrentFiltersAndTime, request);
        const resultJobProfiles = loadLostJobProfiles({ request });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: resultJobProfiles });

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'timeRangeSelected - should trigger loadLostJobProfiles if timerange is set',
      marbles((m) => {
        const timeRange = '123|456';
        const request = { orgUnit: {} } as unknown as EmployeesRequest;
        action = timeRangeSelected({ timeRange });
        store.overrideSelector(getCurrentFiltersAndTime, request);
        const resultJobProfiles = loadLostJobProfiles({ request });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: resultJobProfiles });

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

  describe('loadLostJobProfiles$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadLostJobProfiles({ request });
    });

    test(
      'should return loadLostJobProfilesSuccess action when REST call is successful',
      marbles((m) => {
        const lostJobProfiles: LostJobProfile[] = [
          {
            job: 'Data Scientist',
            employees: [],
            leavers: [],
            openPositions: 1,
          },
          {
            job: 'Software Engineer',
            employees: [],
            leavers: [],
            openPositions: 1,
          },
        ];
        const result = loadLostJobProfilesSuccess({
          lostJobProfiles,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: lostJobProfiles,
        });
        const expected = m.cold('--b', { b: result });

        lossOfSkillService.getLostJobProfiles = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadLostJobProfiles$).toBeObservable(expected);
        m.flush();
        expect(lossOfSkillService.getLostJobProfiles).toHaveBeenCalledWith(
          request
        );
      })
    );

    test(
      'should return loadLostJobProfilesFailure on REST error',
      marbles((m) => {
        const result = loadLostJobProfilesFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        lossOfSkillService.getLostJobProfiles = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadLostJobProfiles$).toBeObservable(expected);
        m.flush();
        expect(lossOfSkillService.getLostJobProfiles).toHaveBeenCalledWith(
          request
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
