import { TestBed } from '@angular/core/testing';

import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { getAccessToken } from '@schaeffler/auth';

import { DEVICES_MOCK } from '../../../../../testing/mocks';
import { DataService } from '../../../http/data.service';
import {
  getDevices,
  getDevicesSuccess,
} from '../../actions/devices/devices.actions';
import { DevicesEffects } from './devices.effects';

describe('Search Effects', () => {
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<DevicesEffects>;
  let effects: DevicesEffects;
  let dataService: DataService;

  const mockUrl = '/overview';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: DataService,
          useValue: {
            getDevices: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(Store);
    effects = TestBed.inject(DevicesEffects);
    metadata = getEffectsMetadata(effects);
    dataService = TestBed.inject(DataService);

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

      dataService.getDevices = jest.fn(() => response);

      expect(effects.devices$).toBeObservable(expected);
      expect(dataService.getDevices).toHaveBeenCalledTimes(1);
    });
  });
});
