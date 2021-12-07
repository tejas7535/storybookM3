import { of, throwError } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { RestService } from '../../../http/rest.service';
import {
  getEdmHistogram,
  getEdmHistogramFailure,
  getEdmHistogramSuccess,
  stopEdmHistogramPolling,
} from '../..';
import {
  getEdm,
  getEdmFailure,
  getEdmId,
  getEdmSuccess,
  setEdmInterval,
} from '../../actions/edm-monitor/edm-monitor.actions';
import * as fromRouter from '../../reducers';
import { EdmHistogram } from '../../reducers/edm-monitor/edm-histogram.reducer';
import { EdmStatus } from '../../reducers/edm-monitor/models';
import { getEdmInterval } from '../../selectors/edm-monitor/edm-monitor.selector';
import { EdmMonitorEffects } from './edm-monitor.effects';

describe('Edm Monitor Effects', () => {
  let spectator: SpectatorService<EdmMonitorEffects>;
  let actions$: any;
  let action: any;
  let store: any;
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
    it(
      'should dispatch getEdmId',
      marbles((m) => {
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const result = getEdmId();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
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
        const mockMeasurements: EdmStatus[] = [
          {
            deviceId: 'Y-Wing',
            timestamp: '2020-07-30T11:02:25',
            startTimestamp: '2020-07-30T11:02:25',
            endTimestamp: '2020-07-30T11:02:25',
            edm01Ai01Counter: 100,
            edm01Ai02Counter: 200,
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
          start: 1_599_651_508,
          end: 1_599_651_509,
        });
      })
    );

    it(
      'should catch errors',
      marbles((m) => {
        const result = getEdmFailure();
        restService.getEdm = jest.fn(() => throwError(() => 's'));
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });
        m.expect(effects.edm$).toBeObservable(expected);
        m.flush();

        expect(restService.getEdm).toHaveBeenCalled();
      })
    );
  });

  describe('edmHistogram$', () => {
    const mock: EdmHistogram[] = [
      {
        deviceId: 'Old Deathstar',
        channel: '1',
        clazz0: 1,
        clazz1: 2,
        clazz2: 3,
        clazz3: 4,
        clazz4: 5,
        timestamp: 'mu',
      },
    ];

    beforeAll(() => {
      action = getEdmHistogram({ deviceId, channel: '1' });
    });

    it(
      'should return EdmHistogramSuccess when REST call is successful',
      marbles((m) => {
        const response = m.cold('-a|', { a: mock });
        const result = getEdmHistogramSuccess({ histogram: mock });
        restService.getEdmHistogram = jest.fn(() => response);
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--b', { b: result });

        m.expect(effects.edmHistogram$).toBeObservable(expected);
        m.flush();

        expect(restService.getEdmHistogram).toHaveBeenCalled();
      })
    );

    it(
      'should catch errors',
      marbles((m) => {
        const result = getEdmHistogramFailure();
        restService.getEdmHistogram = jest.fn(() => throwError(() => 's'));
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.edmHistogram$).toBeObservable(expected);
        m.flush();

        expect(restService.getEdmHistogram).toHaveBeenCalled();
      })
    );
  });

  describe('stopEdmHistogram$', () => {
    it.skip(
      'should set polling to false',
      marbles((m) => {
        effects.isPolling = true;
        actions$ = m.hot('-a', { a: stopEdmHistogramPolling() });
        const expected = m.cold('-b', { b: undefined });
        m.flush();
        expect(effects.isPolling).toBe(false);
      })
    );
  });

  describe('pollingEDMHistogram$', () => {
    it.skip(
      'should trigger action after delay of configured settings',
      marbles((m) => {
        actions$ = m.hot('-a', {
          a: getEdmHistogramSuccess({ histogram: [] }),
        });

        const expected = m.cold('-b', {
          b: getEdmHistogram({ channel: '1', deviceId: '' }),
        });
        m.expect(effects.pollingEDMHistogram$).toBeObservable(expected);
        m.flush();
      })
    );
  });
});
