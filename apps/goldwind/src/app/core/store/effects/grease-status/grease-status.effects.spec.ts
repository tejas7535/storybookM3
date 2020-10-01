import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { DataService } from '../../../http/data.service';
import {
  getGreaseStatus,
  getGreaseStatusId,
  getGreaseStatusLatest,
  getGreaseStatusLatestSuccess,
  getGreaseStatusSuccess,
  setGreaseInterval,
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
  let dataService: DataService;

  const mockUrl = '/bearing/sensor-id-in-url/grease-status';
  const mockRoute = 'grease-status';
  const mockGreaseSensorId = 'ee7bffbe-2e87-49f0-b763-ba235dd7c876';

  const createService = createServiceFactory({
    service: GreaseStatusEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: DataService,
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
    dataService = spectator.inject(DataService);

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
    test('should return getGreaseStatus', () => {
      action = getGreaseStatusId({ source: 'grease-status' });

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: getGreaseStatus({ greaseStatusId: mockGreaseSensorId }),
      });

      expect(effects.greaseStatusId$).toBeObservable(expected);
    });

    test('should return getGreaseStatusLatest', () => {
      action = getGreaseStatusId({ source: 'condition-monitoring' });

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: getGreaseStatusLatest({ greaseStatusId: mockGreaseSensorId }),
      });

      expect(effects.greaseStatusId$).toBeObservable(expected);
    });
  });

  describe('greaseStatus$', () => {
    beforeEach(() => {
      action = getGreaseStatus({ greaseStatusId: mockGreaseSensorId });
    });

    test('should return getGreaseStatusSuccess action when REST call is successful', () => {
      const mockGreaseStatus = [
        {
          id: 1,
          sensorId: '123-abc-456',
          endDate: '2020-08-12T18:09:25',
          startDate: '2020-08-12T18:09:19',
          sampleRatio: 9999,
          waterContentPercent: 69,
          deteriorationPercent: 96,
          temperatureCelsius: 9000,
          isAlarm: true,
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

      dataService.getGreaseStatus = jest.fn(() => response);

      expect(effects.greaseStatus$).toBeObservable(expected);
      expect(dataService.getGreaseStatus).toHaveBeenCalledTimes(1);
      expect(dataService.getGreaseStatus).toHaveBeenCalledWith({
        id: mockGreaseSensorId,
        startDate: 1599651508,
        endDate: 1599651509,
      });
    });
  });

  describe('greaseStatusLatest$', () => {
    beforeEach(() => {
      action = getGreaseStatusLatest({ greaseStatusId: mockGreaseSensorId });
    });

    test('should return getGreaseStatusLatest action when REST call is successful', () => {
      const mockGreaseStatusLatest = {
        id: 1,
        sensorId: '123-abc-456',
        endDate: '2020-08-12T18:09:25',
        startDate: '2020-08-12T18:09:19',
        sampleRatio: 9999,
        waterContentPercent: 69,
        deteriorationPercent: 96,
        temperatureCelsius: 9000,
        isAlarm: true,
      };

      const result = getGreaseStatusLatestSuccess({
        greaseStatusLatest: mockGreaseStatusLatest,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: mockGreaseStatusLatest,
      });
      const expected = cold('--b', { b: result });

      dataService.getGreaseStatusLatest = jest.fn(() => response);

      expect(effects.greaseStatusLatest$).toBeObservable(expected);
      expect(dataService.getGreaseStatusLatest).toHaveBeenCalledTimes(1);
      expect(dataService.getGreaseStatusLatest).toHaveBeenCalledWith(
        mockGreaseSensorId
      );
    });
  });
});
