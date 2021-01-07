import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';

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
  getGreaseInterval,
  getGreaseSensorId,
} from '../../selectors/grease-status/grease-status.selector';
import { GreaseStatusEffects } from './grease-status.effects';

describe('Search Effects', () => {
  let spectator: SpectatorService<GreaseStatusEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<GreaseStatusEffects>;
  let effects: GreaseStatusEffects;
  let restService: RestService;

  const mockUrl = '/bearing/sensor-id-in-url/grease-status';
  const mockRoute = 'grease-status';
  const mockGreaseSensorId = 'ee7bffbe-2e87-49f0-b763-ba235dd7c876';

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

    store.overrideSelector(getGreaseSensorId, mockGreaseSensorId);
    store.overrideSelector(getGreaseInterval, {
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

    test('should dispatch getGreaseStatusId', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', {
        a: {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: mockUrl } },
        },
      });

      const expected = cold('-b', { b: mockRoute });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(stopGetGreaseStatusLatest());
      expect(store.dispatch).toHaveBeenCalledWith(
        getGreaseStatusId({ source: mockRoute })
      );
    });
  });

  describe('setGreaseInterval$', () => {
    test('should return return getGreaseStatusId', () => {
      action = setGreaseInterval({
        interval: {
          endDate: 1599651509,
          startDate: 1599651508,
        },
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: getGreaseStatusId({ source: 'grease-status' }),
      });

      expect(effects.interval$).toBeObservable(expected);
    });
  });

  describe('greaseStatusId$', () => {
    test('should not return an action', () => {
      expect(metadata.greaseStatusId$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should return getGreaseStatus', () => {
      store.dispatch = jest.fn();
      action = getGreaseStatusId({ source: 'grease-status' });

      actions$ = hot('-a', { a: action });

      const expected = cold('-b', {
        b: {
          greaseStatusId: mockGreaseSensorId,
          source: 'grease-status',
        },
      });

      expect(effects.greaseStatusId$).toBeObservable(expected);
      expect(effects['isPollingActive']).toBe(false);
      expect(store.dispatch).toHaveBeenCalledWith(
        getGreaseStatus({ greaseStatusId: mockGreaseSensorId })
      );
    });

    test('should return getGreaseStatusLatest', () => {
      store.dispatch = jest.fn();
      action = getGreaseStatusId({ source: 'condition-monitoring' });

      actions$ = hot('-a', { a: action });

      const expected = cold('-b', {
        b: {
          greaseStatusId: mockGreaseSensorId,
          source: 'condition-monitoring',
        },
      });

      expect(effects.greaseStatusId$).toBeObservable(expected);
      expect(effects['isPollingActive']).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        getGreaseStatusLatest({ greaseStatusId: mockGreaseSensorId })
      );
    });
  });

  describe('greaseStatus$', () => {
    beforeEach(() => {
      action = getGreaseStatus({ greaseStatusId: mockGreaseSensorId });
    });

    test('should return getGreaseStatusSuccess action when REST call is successful', () => {
      const mockGreaseStatus = [
        {
          deviceId: '1',
          gcm01Deterioration: 19,
          gcm01DeteriorationMin: 22,
          gcm01DeteriorationMax: 33,
          gcm01WaterContent: 0,
          gcm01WaterContentMin: 0,
          gcm01WaterContentMax: 1,
          gcm02Deterioration: 0,
          gcm02DeteriorationMin: 0,
          gcm02DeteriorationMax: 0,
          gcm02WaterContent: 0,
          gcm02WaterContentMin: 0,
          gcm02WaterContentMax: 0,
          timestamp: '2020-08-02T16:18:59Z',
        },
      ];

      const result = getGreaseStatusSuccess({
        greaseStatus: mockGreaseStatus,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: mockGreaseStatus,
      });
      const expected = cold('--b', { b: result });

      restService.getGreaseStatus = jest.fn(() => response);

      expect(effects.greaseStatus$).toBeObservable(expected);
      expect(restService.getGreaseStatus).toHaveBeenCalledTimes(1);
      expect(restService.getGreaseStatus).toHaveBeenCalledWith({
        id: mockGreaseSensorId,
        startDate: 1599651508,
        endDate: 1599651509,
      });
    });
  });

  describe('continueGraseId$', () => {
    test('should return getShaft', () => {
      const scheduler = getTestScheduler();
      scheduler.run((helpers) => {
        effects['isPollingActive'] = true;
        action = getGreaseStatusLatestFailure();

        actions$ = helpers.hot('-a', { a: action });

        const expected = {
          b: getGreaseStatusLatest({ greaseStatusId: mockGreaseSensorId }),
        };

        helpers
          .expectObservable(effects.continueGraseId$)
          .toBe(`- ${UPDATE_SETTINGS.grease.refresh}s b`, expected);
      });
    });
  });

  describe('stopGrease$', () => {
    test('should not return an action', () => {
      expect(metadata.stopGrease$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
    test('should set isPollingActive to false', () => {
      effects['isPollingActive'] = true;
      action = stopGetGreaseStatusLatest();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: undefined });
      expect(effects.stopGrease$).toBeObservable(expected);
      expect(effects['isPollingActive']).toBe(false);
    });
  });

  describe('greaseStatusLatest$', () => {
    beforeEach(() => {
      action = getGreaseStatusLatest({ greaseStatusId: mockGreaseSensorId });
    });

    test('should return getGreaseStatusLatest action when REST call is successful', () => {
      const mockGreaseStatusLatest = {
        deviceId: '1',
        gcm01Deterioration: 19,
        gcm01DeteriorationMin: 22,
        gcm01DeteriorationMax: 33,
        gcm01WaterContent: 0,
        gcm01WaterContentMin: 0,
        gcm01WaterContentMax: 1,
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

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: mockGreaseStatusLatest,
      });
      const expected = cold('--b', { b: result });

      restService.getGreaseStatusLatest = jest.fn(() => response);

      expect(effects.greaseStatusLatest$).toBeObservable(expected);
      expect(restService.getGreaseStatusLatest).toHaveBeenCalledTimes(1);
      expect(restService.getGreaseStatusLatest).toHaveBeenCalledWith(
        mockGreaseSensorId
      );
    });
  });
});
