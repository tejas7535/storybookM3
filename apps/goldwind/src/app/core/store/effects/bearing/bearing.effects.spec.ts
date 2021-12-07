import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { BEARING_MOCK } from '../../../../../testing/mocks';
import { RestService } from '../../../http/rest.service';
import {
  getBearing,
  getBearingId,
  getBearingSuccess,
} from '../../actions/bearing/bearing.actions';
import * as fromRouter from '../../reducers';
import { BearingEffects } from './bearing.effects';

describe('Bearing Effects', () => {
  let spectator: SpectatorService<BearingEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let effects: BearingEffects;
  let restService: RestService;

  const mockUrl = '/bearing/666/load-sense';

  const createService = createServiceFactory({
    service: BearingEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getBearing: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(BearingEffects);
    restService = spectator.inject(RestService);

    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: '666' } },
    });
  });

  describe('router$', () => {
    it(
      'should dispatch getBearingId',
      marbles((m) => {
        store.dispatch = jest.fn();
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const result = getBearingId();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
      })
    );
  });

  describe('bearingId$', () => {
    it(
      'should return getBearing',
      marbles((m) => {
        action = getBearingId();

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: getBearing({ bearingId: '666' }),
        });

        m.expect(effects.bearingId$).toBeObservable(expected);
      })
    );
  });

  describe('bearing$', () => {
    beforeEach(() => {
      action = getBearing({ bearingId: '123' });
    });

    it(
      'should return getBearingSuccess action when REST call is successful',
      marbles((m) => {
        const result = getBearingSuccess({
          bearing: BEARING_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: BEARING_MOCK,
        });
        const expected = m.cold('--b', { b: result });

        restService.getBearing = jest.fn(() => response);

        m.expect(effects.bearing$).toBeObservable(expected);
        m.flush();

        expect(restService.getBearing).toHaveBeenCalledTimes(1);
        expect(restService.getBearing).toHaveBeenCalledWith('123');
      })
    );
  });
});
