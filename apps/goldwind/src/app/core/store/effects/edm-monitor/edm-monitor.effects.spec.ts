import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

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

    store.overrideSelector(getEdmInterval, {
      startDate: 1_599_651_508,
      endDate: 1_599_651_509,
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
      'should dispatch getEdmId',
      marbles((m) => {
        store.dispatch = jest.fn();
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const expected = m.cold('-b', { b: 'condition-monitoring' });

        m.expect(effects.router$).toBeObservable(expected);
        m.flush();

        expect(store.dispatch).toHaveBeenCalledWith(getEdmId()); // will also be moved
      })
    );
  });

  describe('interval$', () => {
    it(
      'should return getEdmId',
      marbles((m) => {
        const mockInterval = {
          startDate: 1_599_651_508,
          endDate: 1_599_651_509,
        };

        action = setEdmInterval({ interval: mockInterval });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: getEdmId(),
        });

        m.expect(effects.interval$).toBeObservable(expected);
      })
    );
  });

  describe('edmId$', () => {
    it(
      'should return getEdm',
      marbles((m) => {
        action = getEdmId();

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: getEdm({ deviceId }),
        });

        m.expect(effects.edmId$).toBeObservable(expected);
      })
    );
  });

  describe('edm$', () => {
    beforeEach(() => {
      action = getEdm({
        deviceId,
      });
    });

    it(
      'should return getEdmSuccess action when REST call is successful',
      marbles((m) => {
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

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: mockMeasurements,
        });
        const expected = m.cold('--b', { b: result });

        restService.getEdm = jest.fn(() => response);

        m.expect(effects.edm$).toBeObservable(expected);
        m.flush();

        expect(restService.getEdm).toHaveBeenCalledTimes(1);
        expect(restService.getEdm).toHaveBeenCalledWith({
          id: deviceId,
          startDate: 1_599_651_508,
          endDate: 1_599_651_509,
        });
      })
    );
  });
});
