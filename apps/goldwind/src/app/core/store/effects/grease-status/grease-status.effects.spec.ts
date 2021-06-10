import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { UPDATE_SETTINGS } from '../../../../shared/constants';
import { RestService } from '../../../http/rest.service';
import {
  getGreaseStatus,
  getGreaseStatusId,
  getGreaseStatusLatest,
  getGreaseStatusLatestFailure,
  getGreaseStatusLatestSuccess,
  getGreaseStatusSuccess,
  setGreaseInterval,
  stopGetGreaseStatusLatest,
} from '../../actions/grease-status/grease-status.actions';
import {
  getLoadAverage,
  getLoadAverageSuccess,
} from '../../actions/load-sense/load-sense.actions';
import * as fromRouter from '../../reducers';
import { LoadSense } from '../../reducers/load-sense/models';
import { ShaftStatus } from '../../reducers/shaft/models';
import { getGreaseInterval } from '../../selectors/grease-status/grease-status.selector';
import { GreaseStatusEffects } from './grease-status.effects';

/* eslint-disable max-lines */
jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('Search Effects', () => {
  let spectator: SpectatorService<GreaseStatusEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<GreaseStatusEffects>;
  let effects: GreaseStatusEffects;
  let restService: RestService;

  const deviceId = 'device-id-in-url';
  const mockRoute = 'grease-status';
  const mockUrl = `/bearing/${deviceId}/${mockRoute}`;

  const createService = createServiceFactory({
    service: GreaseStatusEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getGreaseStatus: jest.fn(),
          getGreaseStatusLatest: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(GreaseStatusEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);

    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: deviceId } },
    });

    store.overrideSelector(getGreaseInterval, {
      startDate: 1599651508,
      endDate: 1599651509,
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
      'should dispatch getGreaseStatusId',
      marbles((m) => {
        store.dispatch = jest.fn();
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const expected = m.cold('-b', {
          b: mockRoute as any,
        });

        m.expect(effects.router$).toBeObservable(expected);
        m.flush();

        expect(store.dispatch).toHaveBeenCalledWith(
          stopGetGreaseStatusLatest()
        );
        expect(store.dispatch).toHaveBeenCalledWith(
          getGreaseStatusId({ source: mockRoute })
        );
      })
    );
  });

  describe('setGreaseInterval$', () => {
    it(
      'should return return getGreaseStatusId',
      marbles((m) => {
        action = setGreaseInterval({
          interval: {
            endDate: 1599651509,
            startDate: 1599651508,
          },
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: getGreaseStatusId({ source: 'grease-status' }),
        });

        m.expect(effects.interval$).toBeObservable(expected);
      })
    );
  });

  describe('greaseStatusId$', () => {
    it('should not return an action', () => {
      expect(metadata.greaseStatusId$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    it(
      'should return getGreaseStatus',
      marbles((m) => {
        store.dispatch = jest.fn();
        action = getGreaseStatusId({ source: 'grease-status' });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: {
            deviceId,
            source: 'grease-status',
          },
        });

        m.expect(effects.greaseStatusId$).toBeObservable(expected);
        m.flush();

        expect(effects['isPollingActive']).toBe(false);
        expect(store.dispatch).toHaveBeenCalledWith(
          getGreaseStatus({ deviceId })
        );
        expect(store.dispatch).toHaveBeenCalledWith(
          getLoadAverage({ deviceId })
        );
      })
    );

    it(
      'should return getGreaseStatusLatest',
      marbles((m) => {
        store.dispatch = jest.fn();
        action = getGreaseStatusId({ source: 'condition-monitoring' });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: {
            deviceId,
            source: 'condition-monitoring',
          },
        });

        m.expect(effects.greaseStatusId$).toBeObservable(expected);
        m.flush();

        expect(effects['isPollingActive']).toBe(true);
        expect(store.dispatch).toHaveBeenCalledWith(
          getGreaseStatusLatest({ deviceId })
        );
      })
    );
  });

  describe('greaseStatus$', () => {
    beforeEach(() => {
      action = getGreaseStatus({ deviceId });
    });

    it(
      'should return getGreaseStatusSuccess action when REST call is successful',
      marbles((m) => {
        const mockGcmProcessed = {
          deviceId: '1',
          gcm01TemperatureOptics: 500,
          gcm01TemperatureOpticsMin: 1,
          gcm01TemperatureOpticsMax: 1000,
          gcm01Deterioration: 19,
          gcm01DeteriorationMin: 22,
          gcm01DeteriorationMax: 33,
          gcm01WaterContent: 0,
          gcm01WaterContentMin: 0,
          gcm01WaterContentMax: 1,
          gcm02TemperatureOptics: 0,
          gcm02TemperatureOpticsMin: 0,
          gcm02TemperatureOpticsMax: 0,
          gcm02Deterioration: 0,
          gcm02DeteriorationMin: 0,
          gcm02DeteriorationMax: 0,
          gcm02WaterContent: 0,
          gcm02WaterContentMin: 0,
          gcm02WaterContentMax: 0,
          timestamp: '2020-08-02T16:18:59Z',
        };

        const mockShaftStatus: ShaftStatus[] = [
          {
            deviceId: '1',
            rsm01ShaftSpeed: 13,
            rsm01Shaftcountervalue: 3,
            timestamp: '2020-08-02T16:18:59Z',
          },
        ];

        const mockGcmStatus = {
          GcmProcessed: [mockGcmProcessed],
          RsmShafts: mockShaftStatus,
        };

        const result = getGreaseStatusSuccess({
          gcmStatus: mockGcmStatus,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: mockGcmStatus,
        });
        const expected = m.cold('--b', { b: result });

        restService.getGreaseStatus = jest.fn(() => response);

        m.expect(effects.greaseStatus$).toBeObservable(expected);
        m.flush();

        expect(restService.getGreaseStatus).toHaveBeenCalledTimes(1);
        expect(restService.getGreaseStatus).toHaveBeenCalledWith({
          id: deviceId,
          startDate: 1599651508,
          endDate: 1599651509,
        });
      })
    );
  });

  describe('loadAverage$', () => {
    beforeEach(() => {
      action = getLoadAverage({ deviceId });
    });

    it(
      'should return getLoadAverage action when REST call is successful',
      marbles((m) => {
        const mockAverage: LoadSense = {
          lsp01Strain: 2666.925857162287,
          lsp02Strain: 2862.7850295843746,
          lsp03Strain: 1029.066039711919,
          lsp04Strain: 1197.0452518575266,
          lsp05Strain: 1764.0509199538271,
          lsp06Strain: 1908.1549786913706,
          lsp07Strain: 2768.88648856736,
          lsp08Strain: 1786.153885813422,
          lsp09Strain: 1454.445470021493,
          lsp10Strain: 1301.790787653976,
          lsp11Strain: 1769.612550842888,
          lsp12Strain: 1569.480195591359,
          lsp13Strain: 1096.408815157941,
          lsp14Strain: 1427.2028369240074,
          lsp15Strain: 1066.072787878487,
          lsp16Strain: 1392.7892699377624,
          deviceId: 'edge-goldwind-qa-009',
          id: 'id-load-sense-average',
          timestamp: '2020-08-02T16:18:59Z',
        };

        const result = getLoadAverageSuccess({
          loadAverage: mockAverage,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: [mockAverage],
        });
        const expected = m.cold('--b', { b: result });

        restService.getBearingLoadAverage = jest.fn(() => response);

        m.expect(effects.loadAverage$).toBeObservable(expected);
        m.flush();

        expect(restService.getBearingLoadAverage).toHaveBeenCalledTimes(1);
        expect(restService.getBearingLoadAverage).toHaveBeenCalledWith({
          id: deviceId,
          startDate: 1599651508,
          endDate: 1599651509,
        });
      })
    );
  });

  describe('continueGraseId$', () => {
    it(
      'should return getShaft',
      marbles((m) => {
        effects['isPollingActive'] = true;
        action = getGreaseStatusLatestFailure();

        actions$ = m.hot('-a', { a: action });

        const expected = {
          b: getGreaseStatusLatest({ deviceId }),
        };

        m.expect(effects.continueGraseId$).toBeObservable(
          `- ${UPDATE_SETTINGS.grease.refresh}s b`,
          expected
        );
      })
    );
  });

  describe('stopGrease$', () => {
    it('should not return an action', () => {
      expect(metadata.stopGrease$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
    it(
      'should set isPollingActive to false',
      marbles((m) => {
        effects['isPollingActive'] = true;
        action = stopGetGreaseStatusLatest();

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: undefined });
        m.expect(effects.stopGrease$).toBeObservable(expected);
        m.flush();

        expect(effects['isPollingActive']).toBe(false);
      })
    );
  });

  describe('greaseStatusLatest$', () => {
    beforeEach(() => {
      action = getGreaseStatusLatest({ deviceId });
    });

    it(
      'should return getGreaseStatusLatest action when REST call is successful',
      marbles((m) => {
        const mockGreaseStatusLatest = {
          deviceId: '1',
          gcm01TemperatureOptics: 500,
          gcm01TemperatureOpticsMin: 1,
          gcm01TemperatureOpticsMax: 1000,
          gcm01Deterioration: 19,
          gcm01DeteriorationMin: 22,
          gcm01DeteriorationMax: 33,
          gcm01WaterContent: 0,
          gcm01WaterContentMin: 0,
          gcm01WaterContentMax: 1,
          gcm02TemperatureOptics: 0,
          gcm02TemperatureOpticsMin: 0,
          gcm02TemperatureOpticsMax: 0,
          gcm02Deterioration: 0,
          gcm02DeteriorationMin: 0,
          gcm02DeteriorationMax: 0,
          gcm02WaterContent: 0,
          gcm02WaterContentMin: 0,
          gcm02WaterContentMax: 0,
          timestamp: '2020-08-02T16:18:59Z',
        };

        const result = getGreaseStatusLatestSuccess({
          greaseStatusLatest: mockGreaseStatusLatest,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: [mockGreaseStatusLatest],
        });
        const expected = m.cold('--b', { b: result });

        restService.getGreaseStatusLatest = jest.fn(() => response);

        m.expect(effects.greaseStatusLatest$).toBeObservable(expected);
        m.flush();

        expect(restService.getGreaseStatusLatest).toHaveBeenCalledTimes(1);
        expect(restService.getGreaseStatusLatest).toHaveBeenCalledWith(
          deviceId
        );
      })
    );
  });
});
