import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import {
  filterSelected,
  timeRangeSelected,
  triggerLoad,
} from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import { EmployeesRequest, SelectedFilter } from '../../../shared/models';
import { LossOfSkillService } from '../../loss-of-skill.service';
import { JobProfile, OpenPosition } from '../../models';
import {
  loadJobProfiles,
  loadJobProfilesFailure,
  loadJobProfilesSuccess,
  loadOpenPositions,
  loadOpenPositionsFailure,
  loadOpenPositionsSuccess,
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
        const resultJobProfiles = loadJobProfiles({ request });
        const resultOpenPositions = loadOpenPositions({ request });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(bc)', {
          b: resultJobProfiles,
          c: resultOpenPositions,
        });

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
        const resultJobProfiles = loadJobProfiles({ request });
        const resultOpenPositions = loadOpenPositions({ request });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(bc)', {
          b: resultJobProfiles,
          c: resultOpenPositions,
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

  describe('loadJobProfiles$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadJobProfiles({ request });
    });

    test(
      'should return loadJobProfilesSuccess action when REST call is successful',
      marbles((m) => {
        const jobProfiles: JobProfile[] = [
          {
            positionDescription: 'Data Scientist',
            employees: [],
            leavers: [],
          },
          {
            positionDescription: 'Software Engineer',
            employees: [],
            leavers: [],
          },
        ];
        const result = loadJobProfilesSuccess({
          jobProfiles,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: jobProfiles,
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

  describe('loadOpenPositions$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadOpenPositions({ request });
    });

    test(
      'should return loadOpenPositionsSuccess action when REST call is successful',
      marbles((m) => {
        const openPositions: OpenPosition[] = [
          {
            positionDescription: 'Data Scientist',
          } as OpenPosition,
          {
            positionDescription: 'Software Engineer',
          } as OpenPosition,
        ];
        const result = loadOpenPositionsSuccess({
          openPositions,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: openPositions,
        });
        const expected = m.cold('--b', { b: result });

        lossOfSkillService.getOpenPositions = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOpenPositions$).toBeObservable(expected);
        m.flush();
        expect(lossOfSkillService.getOpenPositions).toHaveBeenCalledWith(
          request
        );
      })
    );

    test(
      'should return loadOpenPositionsFailure on REST error',
      marbles((m) => {
        const result = loadOpenPositionsFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        lossOfSkillService.getOpenPositions = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOpenPositions$).toBeObservable(expected);
        m.flush();
        expect(lossOfSkillService.getOpenPositions).toHaveBeenCalledWith(
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
