import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UPDATE_SETTINGS } from '../../../../shared/constants';
import { marbles } from 'rxjs-marbles';
import { StaticSafetyEffects } from '..';
import {
  getStaticSafetyId,
  getStaticSafetyLatest,
  stopGetStaticSafetyLatest,
} from '../..';
import { RestService } from '../../../http/rest.service';
import {
  getStaticSafetyLatestFailure,
  getStaticSafetyLatestSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';
import { StaticSafetyStatus } from '../../reducers/static-safety/models/static-safety.model';

describe('StaticSafetyEffects', () => {
  let spectator: SpectatorService<StaticSafetyEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<StaticSafetyEffects>;
  let effects: StaticSafetyEffects;
  let restService: RestService;

  const deviceId = 'my-device-id';
  const mockUrl = `/bearing/${deviceId}/condition-monitoring`;
  const mockLeaveUrl = '/overview';

  const createService = createServiceFactory({
    service: StaticSafetyEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getShaftLatest: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(StaticSafetyEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);

    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: deviceId } },
    });
  });

  describe('$router', () => {
    it('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    it(
      'should dispatch getStaticSafetyId',
      marbles((m) => {
        store.dispatch = jest.fn();
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const expected = m.cold('-b', {
          b: 'condition-monitoring' as any,
        });

        m.expect(effects.router$).toBeObservable(expected);
        m.flush();

        expect(store.dispatch).toHaveBeenCalledWith(
          getStaticSafetyId({ source: 'condition-monitoring' })
        );
      })
    );
    it(
      'should dispatch stopGetShaft when leaving the bearing route',
      marbles((m) => {
        store.dispatch = jest.fn();
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockLeaveUrl } },
          },
        });

        const expected = m.cold('-b', {
          b: 'overview' as any,
        });

        m.expect(effects.router$).toBeObservable(expected);
        m.flush();

        expect(store.dispatch).toHaveBeenCalledWith(
          stopGetStaticSafetyLatest()
        );
      })
    );
  });

  describe('staticSafetyId$', () => {
    it('should not return an action', () => {
      expect(metadata.staticSafetyId$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    it(
      'should return getStaticSafetyLatest',
      marbles((m) => {
        store.dispatch = jest.fn();
        action = getStaticSafetyId({ source: 'condition-monitoring' });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: {
            deviceId,
          },
        });

        m.expect(effects.staticSafetyId$).toBeObservable(expected);
        m.flush();

        expect(effects['isPollingActive']).toBe(true);
        expect(store.dispatch).toHaveBeenCalledWith(
          getStaticSafetyLatest({ deviceId })
        );
      })
    );
  });

  describe('continueStaticSafetyId$', () => {
    it('dispatch an action', () => {
      expect(metadata.continueStaticSafetyId$).not.toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    it(
      'should return getShaftLatest',
      marbles((m) => {
        effects['isPollingActive'] = true;
        action = getStaticSafetyLatestFailure();

        actions$ = m.hot('-a', { a: action });

        const expected = {
          b: getStaticSafetyLatest({ deviceId }),
        };

        m.expect(effects.continueStaticSafetyId$).toBeObservable(
          `- ${UPDATE_SETTINGS.staticSafety.refresh}s b`,
          expected
        );
      })
    );
  });

  describe('stopGetStaticSafetyLatest$', () => {
    it(
      'should set isPollingActive to false',
      marbles((m) => {
        effects['isPollingActive'] = true;
        action = stopGetStaticSafetyLatest();

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: undefined });
        m.expect(effects.stopGetStaticSafetyLatest$).toBeObservable(expected);
        m.flush();

        expect(effects['isPollingActive']).toBe(false);
      })
    );
  });

  describe('staticsafetyLatest$', () => {
    beforeEach(() => {
      action = getStaticSafetyLatest({ deviceId });
    });

    it(
      'should return getStaticSafetyLatest action when REST call is successful',
      marbles((m) => {
        const STATIC_SAFETY_MOCK: StaticSafetyStatus = {
          deviceId: 'fakedeviceid',
          timestamp: new Date(),
          value: 21,
          property: 'fake',
        };
        const result = getStaticSafetyLatestSuccess({
          result: STATIC_SAFETY_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: [STATIC_SAFETY_MOCK],
        });
        const expected = m.cold('--b', { b: result });

        restService.getStaticSafety = jest.fn(() => response);

        m.expect(effects.staticsafetyLatest$).toBeObservable(expected);
        m.flush();

        expect(restService.getStaticSafety).toHaveBeenCalledTimes(1);
        expect(restService.getStaticSafety).toHaveBeenCalledWith(deviceId);
      })
    );
  });
});
