import { RouterTestingModule } from '@angular/router/testing';

import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { RestService } from '../../../services/rest/rest.service';
import {
  bearingSearchSuccess,
  searchBearing,
} from './../../actions/bearing/bearing.actions';
import { BearingEffects } from './bearing.effects';

describe('Bearing Effects', () => {
  let action: any;
  let actions$: any;
  let effects: BearingEffects;
  let spectator: SpectatorService<BearingEffects>;
  let restService: RestService;

  const createService = createServiceFactory({
    service: BearingEffects,
    imports: [RouterTestingModule],
    providers: [
      provideMockActions(() => actions$),
      {
        provide: RestService,
        useValue: {
          getBearingSearch: jest.fn(),
        },
      },
      provideMockStore({}),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(BearingEffects);
    restService = spectator.inject(RestService);
  });

  describe('bearingSearch$', () => {
    it(
      'should fetch the bearing list',
      marbles((m) => {
        action = searchBearing({ query: 'the query' });

        actions$ = m.hot('-a', { a: action });

        const resultList = ['bearing', 'bear', 'ring', 'ringbear'];

        const response = m.cold('-a|', { a: resultList });
        restService.getBearingSearch = jest.fn(() => response);

        const result = bearingSearchSuccess({ resultList });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.bearingSearch$).toBeObservable(expected);
        m.flush();

        expect(restService.getBearingSearch).toHaveBeenCalledWith('the query');
      })
    );
  });
});
