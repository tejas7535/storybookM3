import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';

import { getAccessToken } from '@schaeffler/auth';

import { UPDATE_SETTINGS } from '../../../../shared/constants';
import { RestService } from '../../../http/rest.service';
import {
  getShaft,
  getShaftFailure,
  getShaftId,
  getShaftSuccess,
  stopGetShaft,
} from '../../actions/shaft/shaft.actions';
import * as fromRouter from '../../reducers';
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

    store.overrideSelector(getAccessToken, 'mockedAccessToken');
    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: deviceId } },
    });
  });

  describe('router$', () => {
    test('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getShaftId', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', {
        a: {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: mockUrl } },
        },
      });

      const expected = cold('-b', { b: 'condition-monitoring' });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(getShaftId());
    });

    test('should dispatch stopGetShaft when leaving the bearing route', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', {
        a: {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: mockLeaveUrl } },
        },
      });

      const expected = cold('-b', { b: 'overview' });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(stopGetShaft());
    });
  });

  describe('shaftId$', () => {
    test('should return getShaft', () => {
      action = getShaftId();

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: getShaft({ deviceId }),
      });

      expect(effects.shaftId$).toBeObservable(expected);
    });
  });

  describe('continueShaftId$', () => {
    test('should return getShaft', () => {
      const scheduler = getTestScheduler();
      scheduler.run((helpers) => {
        effects['isPollingActive'] = true;
        action = getShaftFailure();

        actions$ = helpers.hot('-a', { a: action });

        const expected = {
          b: getShaft({ deviceId }),
        };

        helpers
          .expectObservable(effects.continueShaftId$)
          .toBe(`- ${UPDATE_SETTINGS.shaft.refresh}s b`, expected);
      });
    });
  });

  describe('stopShaft$', () => {
    test('should not return an action', () => {
      expect(metadata.stopShaft$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
    test('should set isPollingActive to false', () => {
      effects['isPollingActive'] = true;
      action = stopGetShaft();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: undefined });
      expect(effects.stopShaft$).toBeObservable(expected);
      expect(effects['isPollingActive']).toBe(false);
    });
  });

  describe('shaft$', () => {
    beforeEach(() => {
      action = getShaft({ deviceId });
    });

    test('should return getShaftSuccess action when REST call is successful', () => {
      const SHAFT_MOCK = {
        id: 'fakeid',
        deviceId: 'fakedeviceid',
        timestamp: '2020-11-12T18:31:56.954003Z',
        rsm01ShaftSpeed: 3,
        rsm01Shaftcountervalue: 666,
      };

      const result = getShaftSuccess({
        shaft: SHAFT_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: SHAFT_MOCK,
      });
      const expected = cold('--b', { b: result });

      restService.getShaftLatest = jest.fn(() => response);

      expect(effects.shaft$).toBeObservable(expected);
      expect(restService.getShaftLatest).toHaveBeenCalledTimes(1);
      expect(restService.getShaftLatest).toHaveBeenCalledWith(deviceId);
    });
  });
});
