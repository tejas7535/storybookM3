import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { RestService } from '../../../http/rest.service';
import {
  getLoadDistributionLatest,
  getLoadDistributionLatestSuccess,
} from '../../actions';
import { LoadDistributionEffects } from '..';
import { LoadDistribution } from '../../selectors/load-distribution/load-distribution.interface';
import { LoadSense } from '../../reducers/load-sense/models';
import { marbles } from 'rxjs-marbles';

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
        const expected = m.cold('- 10000ms b', {
          b: getLoadDistributionLatest({ deviceId }),
        });

        m.expect(effects.pollingLoadDistribution$).toBeObservable(expected);
      })
    );
  });

  // describe('loadDistributionLatest$', () => {
  //   it(
  //     'should do something',
  //     marbles((m) => {
  //       action = getLoadDistributionLatest({ deviceId });
  //       const mockLDRow = {
  //         deviceId,
  //         rollingElement1: 1,
  //       } as LoadDistribution;
  //       const mockLDRow2 = {
  //         deviceId,
  //         rollingElement1: 2,
  //       } as LoadDistribution;

  //       const mockLSP = {
  //         deviceId: 'LSP_Ping',
  //         lsp01Strain: 1,
  //       } as LoadSense;

  //       const result = getLoadDistributionLatestSuccess({
  //         lsp: mockLSP,
  //         row1: mockLDRow,
  //         row2: mockLDRow2,
  //       });

  //       store.dispatch = jest.fn();
  //       actions$ = m.hot('-a', { a: action });

  //       const responseBearing = m.cold('-a|', { a: [mockLSP] });
  //       const responseA = m.cold('-a|', { a: [mockLDRow] });
  //       const responseB = m.cold('-b|', { b: [mockLDRow2] });

  //       restService.getLoadDistribution = jest
  //         .fn()
  //         .mockReturnValue('default')
  //         .mockReturnValueOnce(responseA)
  //         .mockReturnValueOnce(responseB);
  //       restService.getBearingLoad = jest.fn(() => responseBearing);

  //       const expected = m.cold('---b', { b: result });
  //       m.expect(effects.loadDistributionLatest$).toBeObservable(expected);
  //       m.flush();
  //     })
  //   );
  // });
});
