import { throwError } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { RestService } from '../../../http/rest.service';

import {
  getEdm,
  getEdmId,
  setEdmInterval,
} from '../../actions/edm-monitor/edm-monitor.actions';
import * as fromRouter from '../../reducers';
import { getEdmInterval } from '../../selectors/edm-monitor/edm-monitor.selector';
import { EdmMonitorEffects } from './edm-monitor.effects';
import {
  getEdmHistogram,
  getEdmHistogramFailure,
  getEdmHistogramSuccess,
  stopEdmHistogramPolling,
} from '../..';
import {
  EdmAntennaValue,
  EdmHistogram,
} from '../../reducers/edm-monitor/edm-histogram.reducer';
import { LegacyAPIService } from '../../../http/legacy.service';

describe('Edm Monitor Effects', () => {
  let spectator: SpectatorService<EdmMonitorEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let effects: EdmMonitorEffects;
  let restService: RestService;
  let legacyService: LegacyAPIService;

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
      {
        provide: LegacyAPIService,
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
    legacyService = spectator.inject(LegacyAPIService);

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

  describe('edmHistogram$', () => {
    const mock: EdmHistogram = {
      edm1: [
        {
          clazz0: 1,
          clazz1: 2,
          clazz2: 3,
          clazz3: 4,
          clazz4: 5,
          timestamp: 'mu',
        } as EdmAntennaValue,
      ],
      edm2: [],
    };

    beforeAll(() => {
      action = getEdmHistogram({ deviceId });
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
          a: getEdmHistogramSuccess({ histogram: { edm1: [], edm2: [] } }),
        });

        const expected = m.cold('-b', {
          b: getEdmHistogram({ deviceId: '' }),
        });
        m.expect(effects.pollingEDMHistogram$).toBeObservable(expected);
        m.flush();
      })
    );
  });
});
