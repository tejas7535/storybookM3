import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

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
  });

  describe('router$', () => {
    it('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    it(
      'should dispatch getDevicesId',
      marbles((m) => {
        store.dispatch = jest.fn();
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const expected = m.cold('-b', { b: 'overview' });

        m.expect(effects.router$).toBeObservable(expected);
        m.flush();

        expect(store.dispatch).toHaveBeenCalledWith(getDevices());
      })
    );
  });

  describe('devices$', () => {
    beforeEach(() => {
      action = getDevices();
    });

    it(
      'should return getDevicesSuccess action when REST call is successful',
      marbles((m) => {
        const result = getDevicesSuccess({
          devices: DEVICES_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: DEVICES_MOCK,
        });
        const expected = m.cold('--b', { b: result });

        restService.getDevices = jest.fn(() => response);

        m.expect(effects.devices$).toBeObservable(expected);
        m.flush();
        expect(restService.getDevices).toHaveBeenCalledTimes(1);
      })
    );
  });
});
