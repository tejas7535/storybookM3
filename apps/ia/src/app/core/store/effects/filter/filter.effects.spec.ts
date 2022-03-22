import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { FilterService } from '../../../../filter-section/filter.service';
import { IdValue } from '../../../../shared/models';
import {
  loadOrgUnits,
  loadOrgUnitsFailure,
  loadOrgUnitsSuccess,
} from '../../actions/filter/filter.action';
import { getSelectedTimeRange } from '../../selectors';
import { FilterEffects } from './filter.effects';

describe('Filter Effects', () => {
  let spectator: SpectatorService<FilterEffects>;
  let actions$: any;
  let filterService: FilterService;
  let action: any;
  let effects: FilterEffects;
  let store: MockStore;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: FilterEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: FilterService,
        useValue: {
          getOrgUnits: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(FilterEffects);
    filterService = spectator.inject(FilterService);
    store = spectator.inject(MockStore);
  });

  describe('loadOrgUnits$', () => {
    const searchFor = 'search';
    const timeRange = '123|456';

    beforeEach(() => {
      action = loadOrgUnits({ searchFor });
      store.overrideSelector(getSelectedTimeRange, {
        id: timeRange,
        value: timeRange,
      });
    });

    test(
      'should return loadOrgUnitsSuccess action when REST call is successful',
      marbles((m) => {
        const items = [new IdValue('Department1', 'Department1')];
        const result = loadOrgUnitsSuccess({
          items,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-c', { c: items });

        const expected = m.cold('--b', { b: result });

        filterService.getOrgUnits = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOrgUnits$).toBeObservable(expected);
        m.flush();
        expect(filterService.getOrgUnits).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return loadOrgUnitsFailure on REST error',
      marbles((m) => {
        const result = loadOrgUnitsFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        filterService.getOrgUnits = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadOrgUnits$).toBeObservable(expected);
        m.flush();
        expect(filterService.getOrgUnits).toHaveBeenCalledTimes(1);
      })
    );
  });
});
