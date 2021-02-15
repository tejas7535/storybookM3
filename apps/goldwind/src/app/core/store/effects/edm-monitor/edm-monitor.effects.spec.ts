import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { getAccessToken } from '@schaeffler/auth';

import { RestService } from '../../../http/rest.service';
import {
  getEdm,
  getEdmId,
  getEdmSuccess,
  setEdmInterval,
} from '../../actions/edm-monitor/edm-monitor.actions';
import * as fromRouter from '../../reducers';
import { getEdmInterval } from '../../selectors/edm-monitor/edm-monitor.selector';
import { EdmMonitorEffects } from './edm-monitor.effects';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('Search Effects', () => {
  let spectator: SpectatorService<EdmMonitorEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<EdmMonitorEffects>;
  let effects: EdmMonitorEffects;
  let restService: RestService;

  const deviceId = 'device-id-in-url';
  const mockUrl = `/bearing/${deviceId}/condition-monitoring`;

  const createService = createServiceFactory({
    service: EdmMonitorEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getEdm: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(EdmMonitorEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);

    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: deviceId } },
    });

    store.overrideSelector(getAccessToken, 'mockedAccessToken');
    store.overrideSelector(getEdmInterval, {
      startDate: 1599651508,
      endDate: 1599651509,
    });
  });

  describe('router$', () => {
    test('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getEdmId', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', {
        a: {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: mockUrl } },
        },
      });

      const expected = cold('-b', { b: 'condition-monitoring' });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(getEdmId()); // will also be moved
    });
  });

  describe('interval$', () => {
    test('should return getEdmId', () => {
      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };

      action = setEdmInterval({ interval: mockInterval });

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: getEdmId(),
      });

      expect(effects.interval$).toBeObservable(expected);
    });
  });

  describe('edmId$', () => {
    test('should return getEdm', () => {
      action = getEdmId();

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: getEdm({ deviceId }),
      });

      expect(effects.edmId$).toBeObservable(expected);
    });
  });

  describe('edm$', () => {
    beforeEach(() => {
      action = getEdm({
        deviceId,
      });
    });

    test('should return getEdmSuccess action when REST call is successful', () => {
      const mockMeasurements = [
        {
          startDate: '2020-07-30T11:02:25',
          edmValue1Counter: 100,
          edmValue2Counter: 200,
          edmValue1CounterMax: 300,
          edmValue2CounterMax: 400,
        },
      ];

      const result = getEdmSuccess({
        measurements: mockMeasurements,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: mockMeasurements,
      });
      const expected = cold('--b', { b: result });

      restService.getEdm = jest.fn(() => response);

      expect(effects.edm$).toBeObservable(expected);
      expect(restService.getEdm).toHaveBeenCalledTimes(1);
      expect(restService.getEdm).toHaveBeenCalledWith({
        id: deviceId,
        startDate: 1599651508,
        endDate: 1599651509,
      });
    });
  });
});
