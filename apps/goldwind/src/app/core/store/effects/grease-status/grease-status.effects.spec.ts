import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { provideMockStore } from '@ngrx/store/testing';
import { Context, marbles } from 'rxjs-marbles';

import { UPDATE_SETTINGS } from '../../../../shared/constants';
import { RestService } from '../../../http/rest.service';
import {
  getGreaseStatusId,
  getGreaseStatusLatest,
  getGreaseStatusLatestFailure,
  getGreaseStatusLatestSuccess,
  stopGetGreaseStatusLatest,
} from '../../actions/grease-status/grease-status.actions';
import * as fromRouter from '../../reducers';
import { GreaseStatusEffects } from './grease-status.effects';
import { LiveAPIService } from '../../../http/liveapi.service';
import { GcmProcessedEntity } from '../../../http/types';

/* eslint-disable max-lines */
describe('Grease Status Effects', () => {
  let spectator: SpectatorService<GreaseStatusEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<GreaseStatusEffects>;
  let effects: GreaseStatusEffects;
  let liveapiservice: LiveAPIService;

  const deviceId = 'device-id-in-url';
  const mockRoute = 'condition-monitoring';
  const mockUrl = `/bearing/${deviceId}/${mockRoute}`;
  const mockLeaveUrl = '/overview';

  const createService = createServiceFactory({
    service: GreaseStatusEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: LiveAPIService,
        useValue: {
          getGreaseStatusLatest: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(GreaseStatusEffects);
    metadata = getEffectsMetadata(effects);
    liveapiservice = spectator.inject(LiveAPIService);

    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: deviceId } },
    });
  });

  describe('router$', () => {
    it(
      'should dispatch getGreaseStatusId on bearing route',
      marbles((m) => {
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const result = getGreaseStatusId({ source: mockRoute });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
      })
    );

    it(
      'should dispatch stopGetGreaseStatusLatest when leaving the condition monitoring route',
      marbles((m) => {
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockLeaveUrl } },
          },
        });

        const result = stopGetGreaseStatusLatest();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
      })
    );
  });

  describe('greaseStatusId$', () => {
    it(
      'should return getGreaseStatusLatest',
      marbles((m) => {
        store.dispatch = jest.fn();
        action = getGreaseStatusId({ source: 'condition-monitoring' });

        actions$ = m.hot('-a', { a: action });

        const result = getGreaseStatusLatest({ deviceId });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.greaseStatusId$).toBeObservable(expected);
        m.flush();

        expect(effects['isPollingActive']).toBe(true);
      })
    );
  });

  describe('continueGraseId$', () => {
    it(
      'should return getShaft',
      marbles((m) => {
        effects['isPollingActive'] = true;
        action = getGreaseStatusLatestFailure();

        actions$ = m.hot('-a', { a: action });

        const expected = {
          b: getGreaseStatusLatest({ deviceId }),
        };

        m.expect(effects.continueGraseId$).toBeObservable(
          `- ${UPDATE_SETTINGS.grease.refresh}s b`,
          expected
        );
      })
    );
  });

  describe('stopGrease$', () => {
    it('should not return an action', () => {
      expect(metadata.stopGrease$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
    it(
      'should set isPollingActive to false',
      marbles((m) => {
        effects['isPollingActive'] = true;
        action = stopGetGreaseStatusLatest();

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: undefined });
        m.expect(effects.stopGrease$).toBeObservable(expected);
        m.flush();

        expect(effects['isPollingActive']).toBe(false);
      })
    );
  });

  describe('greaseStatusLatest$', () => {
    beforeEach(() => {
      action = getGreaseStatusLatest({ deviceId });
    });

    it(
      'should return getGreaseStatusLatest action when REST call is successful',
      marbles((m) => {
        const mockGreaseStatusLatest: GcmProcessedEntity = {
          deviceId: '1',
          gcm01TemperatureOptics: 500,
          gcm01TemperatureOpticsMin: 1,
          gcm01TemperatureOpticsMax: 1000,
          gcm01Deterioration: 19,
          gcm01DeteriorationMin: 22,
          gcm01DeteriorationMax: 33,
          gcm01WaterContent: 0,
          gcm01WaterContentMin: 0,
          gcm01WaterContentMax: 1,
          gcm02TemperatureOptics: 0,
          gcm02TemperatureOpticsMin: 0,
          gcm02TemperatureOpticsMax: 0,
          gcm02Deterioration: 0,
          gcm02DeteriorationMin: 0,
          gcm02DeteriorationMax: 0,
          gcm02WaterContent: 0,
          gcm02WaterContentMin: 0,
          gcm02WaterContentMax: 0,
          timestamp: '2020-08-02T16:18:59Z',
        };

        const result = getGreaseStatusLatestSuccess({
          greaseStatusLatest: mockGreaseStatusLatest,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: mockGreaseStatusLatest,
        });
        const expected = m.cold('--b', { b: result });

        liveapiservice.getGcmProcessed = jest.fn(() => response);

        m.expect(effects.greaseStatusLatest$).toBeObservable(expected);
        m.flush();

        expect(liveapiservice.getGcmProcessed).toHaveBeenCalledTimes(1);
        expect(liveapiservice.getGcmProcessed).toHaveBeenCalledWith(deviceId);
      })
    );
  });
});

const expectEffectRest = (options: {
  mock: any;
  action: any & TypedAction<any>;
  propname: string;
  marble: Context;
  marbleE: string;
  marbleR: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  restMethod: Function;
  effect: any;
}) => {
  const result = options.action({ [options.propname]: options.mock });
  options.marble.hot(options.marbleE, { a: options.action });

  const response = options.marble.cold(`${options.marbleE}|`, {
    a: options.mock,
  });
  const expected = options.marble.cold(options.marbleR, { b: result });

  options.restMethod = jest.fn(() => response);

  options.marble.expect(options.effect).toBeObservable(expected);
  options.marble.flush();
};
