import { marbles } from 'rxjs-marbles/marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { filterSelected, timeRangeSelected } from '../../../core/store/actions';
import { getCurrentFiltersAndTime } from '../../../core/store/selectors';
import { EmployeesRequest, SelectedFilter } from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import { ReasonsAndCounterMeasuresService } from '../../reasons-and-counter-measures.service';
import {
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
} from '../actions/reasons-and-counter-measures.actions';
import { ReasonsAndCounterMeasuresEffects } from './reasons-and-counter-measures.effects';

describe('ReasonsAndCounterMeasures Effects', () => {
  let spectator: SpectatorService<ReasonsAndCounterMeasuresEffects>;
  let actions$: any;
  let reasonsAndCounterMeasuresService: ReasonsAndCounterMeasuresService;
  let action: any;
  let effects: ReasonsAndCounterMeasuresEffects;
  let store: MockStore;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: ReasonsAndCounterMeasuresEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: ReasonsAndCounterMeasuresService,
        useValue: {
          getResignedEmployees: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ReasonsAndCounterMeasuresEffects);
    reasonsAndCounterMeasuresService = spectator.inject(
      ReasonsAndCounterMeasuresService
    );
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

        const resultReasonsWhyPeopleLeft = loadReasonsWhyPeopleLeft({
          request,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: resultReasonsWhyPeopleLeft,
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

  describe('loadReasonsWhyPeopleLeft$', () => {
    let request: EmployeesRequest;

    beforeEach(() => {
      request = {} as unknown as EmployeesRequest;
      action = loadReasonsWhyPeopleLeft({ request });
    });

    test(
      'should return loadReasonsWhyPeopleLeftSuccess action when REST call is successful',
      marbles((m) => {
        const data: ReasonForLeavingStats[] = [];
        const result = loadReasonsWhyPeopleLeftSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        reasonsAndCounterMeasuresService.getReasonsWhyPeopleLeft = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadReasonsWhyPeopleLeft$).toBeObservable(expected);
        m.flush();
        expect(
          reasonsAndCounterMeasuresService.getReasonsWhyPeopleLeft
        ).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return loadReasonsWhyPeopleLeftFailure on REST error',
      marbles((m) => {
        const result = loadReasonsWhyPeopleLeftFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        reasonsAndCounterMeasuresService.getReasonsWhyPeopleLeft = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadReasonsWhyPeopleLeft$).toBeObservable(expected);
        m.flush();
        expect(
          reasonsAndCounterMeasuresService.getReasonsWhyPeopleLeft
        ).toHaveBeenCalledWith(request);
      })
    );
  });
});
