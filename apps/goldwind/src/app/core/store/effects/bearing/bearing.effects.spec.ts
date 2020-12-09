import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';

import { getAccessToken } from '@schaeffler/auth';

import { BEARING_MOCK } from '../../../../../testing/mocks';
import { UPDATE_SETTINGS } from '../../../../shared/constants';
import { RestService } from '../../../http/rest.service';
import {
  getBearing,
  getBearingId,
  getBearingSuccess,
  getShaft,
  getShaftFailure,
  getShaftId,
  getShaftSuccess,
  stopGetShaft,
} from '../../actions/bearing/bearing.actions';
import * as fromRouter from '../../reducers';
import { getShaftDeviceId } from '../../selectors/bearing/bearing.selector';
import { BearingEffects } from './bearing.effects';

describe('Search Effects', () => {
  let spectator: SpectatorService<BearingEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<BearingEffects>;
  let effects: BearingEffects;
  let restService: RestService;

  const mockUrl = '/bearing/666/load-sense';
  const mockLeaveUrl = '/overview';
  const shaftDeviceId = '123-456-789';

  const createService = createServiceFactory({
    service: BearingEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getBearing: jest.fn(),
          getShaftLatest: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(BearingEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);

    store.overrideSelector(getAccessToken, 'mockedAccessToken');
    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: '666' } },
    });
    store.overrideSelector(getShaftDeviceId, shaftDeviceId);
  });

  describe('router$', () => {
    test('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getBearingId', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', {
        a: {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: mockUrl } },
        },
      });

      const expected = cold('-b', { b: 'bearing' });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(getBearingId());
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

  describe('bearingId$', () => {
    test('should return getBearing', () => {
      action = getBearingId();

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: getBearing({ bearingId: '666' }),
      });

      expect(effects.bearingId$).toBeObservable(expected);
    });
  });

  describe('bearing$', () => {
    beforeEach(() => {
      action = getBearing({ bearingId: '123' });
    });

    test('should return getBearingSuccess action when REST call is successful', () => {
      const result = getBearingSuccess({
        bearing: BEARING_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: BEARING_MOCK,
      });
      const expected = cold('--b', { b: result });

      restService.getBearing = jest.fn(() => response);

      expect(effects.bearing$).toBeObservable(expected);
      expect(restService.getBearing).toHaveBeenCalledTimes(1);
      expect(restService.getBearing).toHaveBeenCalledWith('123');
    });
  });

  describe('shaftId$', () => {
    test('should return getShaft', () => {
      action = getShaftId();

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: getShaft({ shaftDeviceId }),
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
          b: getShaft({ shaftDeviceId }),
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
      action = getShaft({ shaftDeviceId: '420247' });
    });

    test('should return getShaftSuccess action when REST call is successful', () => {
      const SHAFT_MOCK = {
        id: 'fakeid',
        deviceId: 'fakedeviceid',
        timeStamp: '2020-11-12T18:31:56.954003Z',
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
      expect(restService.getShaftLatest).toHaveBeenCalledWith('420247');
    });
  });
});
