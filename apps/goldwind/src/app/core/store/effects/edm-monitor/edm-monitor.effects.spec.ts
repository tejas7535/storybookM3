import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { getAccessToken } from '@schaeffler/auth';

import { DataService } from '../../../http/data.service';
import {
  getEdm,
  getEdmId,
  getEdmSuccess,
  setEdmInterval,
} from '../../actions/edm-monitor/edm-monitor.actions';
import {
  getEdmInterval,
  getSensorId,
} from '../../selectors/edm-monitor/edm-monitor.selector';
import { EdmMonitorEffects } from './edm-monitor.effects';

describe('Search Effects', () => {
  let spectator: SpectatorService<EdmMonitorEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<EdmMonitorEffects>;
  let effects: EdmMonitorEffects;
  let dataService: DataService;

  const mockUrl = '/bearing/666/condition-monitoring';
  const mockSensorID = 'ee7bffbe-2e87-49f0-b763-ba235dd7c876';

  const createService = createServiceFactory({
    service: EdmMonitorEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: DataService,
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
    dataService = spectator.inject(DataService);

    store.overrideSelector(getAccessToken, 'mockedAccessToken');
    store.overrideSelector(getEdmInterval, {
      startDate: 1599651508,
      endDate: 1599651509,
    });
    store.overrideSelector(getSensorId, mockSensorID);
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

  describe('setEdmInterval$', () => {
    test('should not return an action', () => {
      expect(metadata.interval$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getEdmId', () => {
      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };

      store.dispatch = jest.fn();
      actions$ = hot('-a', { a: setEdmInterval({ interval: mockInterval }) });

      expect(effects.interval$).toBeObservable(actions$);
      expect(store.dispatch).toHaveBeenCalledWith(getEdmId()); // will also be moved
    });
  });

  describe('edmId$', () => {
    test('should not return an action', () => {
      expect(metadata.edmId$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getEdm', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', { a: getEdmId() });

      const expected = cold('-b', {
        b: mockSensorID,
      });

      expect(effects.edmId$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(
        getEdm({
          sensorId: mockSensorID,
        })
      );
    });
  });

  describe('edm$', () => {
    beforeEach(() => {
      action = getEdm({
        sensorId: mockSensorID,
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

      dataService.getEdm = jest.fn(() => response);

      expect(effects.edm$).toBeObservable(expected);
      expect(dataService.getEdm).toHaveBeenCalledTimes(1);
      expect(dataService.getEdm).toHaveBeenCalledWith({
        id: mockSensorID,
        startDate: 1599651508,
        endDate: 1599651509,
      });
    });
  });
});
