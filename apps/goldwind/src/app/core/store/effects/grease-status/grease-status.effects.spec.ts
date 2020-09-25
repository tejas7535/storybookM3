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

      const expected = cold('-b', { b: 'grease-status' });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(getGreaseStatusId());
    });
  });

  describe('setGreaseInterval$', () => {
    test('should not return an action', () => {
      expect(metadata.interval$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getGreaseStatusId', () => {
      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };

      store.dispatch = jest.fn();
      actions$ = hot('-a', {
        a: setGreaseInterval({ interval: mockInterval }),
      });

      expect(effects.interval$).toBeObservable(actions$);
      expect(store.dispatch).toHaveBeenCalledWith(getGreaseStatusId()); // will also be moved
    });
  });

  describe('greaseStatusId$', () => {
    test('should not return an action', () => {
      expect(metadata.greaseStatusId$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getGreaseStatus', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', { a: getGreaseStatusId() });

      const expected = cold('-b', { b: mockGreaseSensorId });

      expect(effects.greaseStatusId$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(
        getGreaseStatus({
          greaseStatusId: mockGreaseSensorId,
        })
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
});
