import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { DEVICES_MOCK } from '../../../../../testing/mocks';
import { RestService } from '../../../http/rest.service';
import {
  getDevices,
  getDevicesSuccess,
} from '../../actions/devices/devices.actions';
import { DevicesEffects } from './devices.effects';

describe('Devices Effects', () => {
  let spectator: SpectatorService<DevicesEffects>;
  let actions$: any;
  let action: any;
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
    effects = spectator.inject(DevicesEffects);
    restService = spectator.inject(RestService);
  });

  describe('router$', () => {
    it(
      'should dispatch getDevicesId',
      marbles((m) => {
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const result = getDevices();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
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
