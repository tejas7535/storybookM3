import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { getAccessToken } from '@schaeffler/auth';

import { DEVICES_MOCK } from '../../../../../testing/mocks';
import { RestService } from '../../../http/rest.service';
import {
  getDevices,
  getDevicesSuccess,
} from '../../actions/devices/devices.actions';
import { DevicesEffects } from './devices.effects';

describe('Search Effects', () => {
  let spectator: SpectatorService<DevicesEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<DevicesEffects>;
  let effects: DevicesEffects;
  let restService: RestService;

  const mockUrl = '/overview';

  const createService = createServiceFactory({
    service: DevicesEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getDevices: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(DevicesEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);

    store.overrideSelector(getAccessToken, 'mockedAccessToken');
  });

  describe('router$', () => {
    test('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getDevicesId', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', {
        a: {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: mockUrl } },
        },
      });

      const expected = cold('-b', { b: 'overview' });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(getDevices());
    });
  });

  describe('devices$', () => {
    beforeEach(() => {
      action = getDevices();
    });

    test('should return getDevicesSuccess action when REST call is successful', () => {
      const result = getDevicesSuccess({
        devices: DEVICES_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: DEVICES_MOCK,
      });
      const expected = cold('--b', { b: result });

      restService.getDevices = jest.fn(() => response);

      expect(effects.devices$).toBeObservable(expected);
      expect(restService.getDevices).toHaveBeenCalledTimes(1);
    });
  });
});
