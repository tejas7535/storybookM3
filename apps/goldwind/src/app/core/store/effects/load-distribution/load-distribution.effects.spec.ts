import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { RestService } from '../../../http/rest.service';
import {
  getLoadDistributionLatest,
  getLoadDistributionLatestSuccess,
} from '../../actions';
import { LoadDistribution } from '../../selectors/load-distribution/load-distribution.interface';
import { LoadDistributionEffects } from '..';

/* eslint-disable max-lines */
describe('LoadDistributionEffects', () => {
  let spectator: SpectatorService<LoadDistributionEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let effects: LoadDistributionEffects;
  let restService: RestService;

  const deviceId = 'device-id-in-url';
  const mockRoute = 'load-assessment';
  const mockUrl = `/bearing/${deviceId}/${mockRoute}`;

  const createService = createServiceFactory({
    service: LoadDistributionEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getLoadDistribution: jest.fn(),
          getBearingLoadLatest: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(LoadDistributionEffects);
    restService = spectator.inject(RestService);
  });
  describe('pollingLoadDistribution$', () => {
    it(
      'should effect something',
      marbles((m) => {
        action = getLoadDistributionLatestSuccess({
          row1: {} as LoadDistribution,
        });

        store.dispatch = jest.fn();
        effects.currentDeviceId = deviceId;
        effects.isPollingActive = true;
        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('- 60000ms b', {
          b: getLoadDistributionLatest({ deviceId }),
        });

        m.expect(effects.pollingLoadDistribution$).toBeObservable(expected);
      })
    );
  });
});
