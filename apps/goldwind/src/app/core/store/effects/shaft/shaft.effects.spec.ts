import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { UPDATE_SETTINGS } from '../../../../shared/constants';
import { RestService } from '../../../http/rest.service';
import {
  getShaftId,
  getShaftLatest,
  getShaftLatestFailure,
  getShaftLatestSuccess,
  stopGetShaftLatest,
} from '../../actions/shaft/shaft.actions';
import * as fromRouter from '../../reducers';
import { ShaftStatus } from '../../reducers/shaft/models';
import { ShaftEffects } from './shaft.effects';

describe('Shaft Effects', () => {
  let spectator: SpectatorService<ShaftEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<ShaftEffects>;
  let effects: ShaftEffects;
  let restService: RestService;

  const deviceId = 'my-device-id';
  const mockUrl = `/bearing/${deviceId}/condition-monitoring`;
  const mockLeaveUrl = '/overview';

  const createService = createServiceFactory({
    service: ShaftEffects,
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
    effects = spectator.inject(ShaftEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);

    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: deviceId } },
    });
  });

  describe('router$', () => {
    it('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    it(
      'should dispatch getShaftId',
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
          getShaftId({ source: 'condition-monitoring' })
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

        expect(store.dispatch).toHaveBeenCalledWith(stopGetShaftLatest());
      })
    );
  });

  describe('shaftId$', () => {
    it('should not return an action', () => {
      expect(metadata.shaftId$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    it(
      'should return getShaftLatest',
      marbles((m) => {
        store.dispatch = jest.fn();
        action = getShaftId({ source: 'condition-monitoring' });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: {
            deviceId,
          },
        });

        m.expect(effects.shaftId$).toBeObservable(expected);
        m.flush();

        expect(effects['isPollingActive']).toBe(true);
        expect(store.dispatch).toHaveBeenCalledWith(
          getShaftLatest({ deviceId })
        );
      })
    );
  });

  describe('continueShaftId$', () => {
    it(
      'should return getShaftLatest',
      marbles((m) => {
        effects['isPollingActive'] = true;
        action = getShaftLatestFailure();

        actions$ = m.hot('-a', { a: action });

        const expected = {
          b: getShaftLatest({ deviceId }),
        };

        m.expect(effects.continueShaftId$).toBeObservable(
          `- ${UPDATE_SETTINGS.shaft.refresh}s b`,
          expected
        );
      })
    );
  });

  describe('stopGetShaftLatest$', () => {
    it('should not return an action', () => {
      expect(metadata.stopGetShaftLatest$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
    it(
      'should set isPollingActive to false',
      marbles((m) => {
        effects['isPollingActive'] = true;
        action = stopGetShaftLatest();

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: undefined });
        m.expect(effects.stopGetShaftLatest$).toBeObservable(expected);
        m.flush();

        expect(effects['isPollingActive']).toBe(false);
      })
    );
  });

  describe('shaftLatest$', () => {
    beforeEach(() => {
      action = getShaftLatest({ deviceId });
    });

    it(
      'should return getShaftLatestSuccess action when REST call is successful',
      marbles((m) => {
        const SHAFT_MOCK: ShaftStatus = {
          deviceId: 'fakedeviceid',
          timestamp: '2020-11-12T18:31:56.954003Z',
          rsm01ShaftSpeed: 3,
          rsm01Shaftcountervalue: 666,
        };
        const result = getShaftLatestSuccess({
          shaft: SHAFT_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: [SHAFT_MOCK],
        });
        const expected = m.cold('--b', { b: result });

        restService.getShaftLatest = jest.fn(() => response);

        m.expect(effects.shaftLatest$).toBeObservable(expected);
        m.flush();

        expect(restService.getShaftLatest).toHaveBeenCalledTimes(1);
        expect(restService.getShaftLatest).toHaveBeenCalledWith(deviceId);
      })
    );
  });
});
