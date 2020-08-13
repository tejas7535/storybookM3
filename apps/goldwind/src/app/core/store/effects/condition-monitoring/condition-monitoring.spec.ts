import { TestBed } from '@angular/core/testing';

import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { getAccessToken } from '@schaeffler/auth';

import { DataService } from '../../../http/data.service';
import { StompService } from '../../../http/stomp.service';
import {
  connectStomp,
  disconnectStomp,
  getEdm,
  getEdmId,
  getEdmSuccess,
  getStompStatus,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
} from '../../actions/condition-monitoring/condition-monitoring.actions';
import * as fromRouter from '../../reducers';
import { getSensorId } from '../../selectors/condition-monitoring/condition-monitoring.selector';
import { ConditionMonitoringEffects } from './condition-monitoring.effects';

describe('Search Effects', () => {
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<ConditionMonitoringEffects>;
  let effects: ConditionMonitoringEffects;
  let dataService: DataService;
  let stompService: StompService;

  const mockUrl = '/bearing/666/condition-monitoring';
  const mockSensorID = 'ee7bffbe-2e87-49f0-b763-ba235dd7c876';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ConditionMonitoringEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: DataService,
          useValue: {
            getThing: jest.fn(),
            getEdm: jest.fn(),
          },
        },
        {
          provide: StompService,
          useValue: {
            connect: jest.fn(),
            getTopicBroadcast: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(Store);
    effects = TestBed.inject(ConditionMonitoringEffects);
    metadata = getEffectsMetadata(effects);
    dataService = TestBed.inject(DataService);
    stompService = TestBed.inject(StompService);

    store.overrideSelector(getAccessToken, 'mockedAccessToken');
    store.overrideSelector(getSensorId, mockSensorID);
    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: 666 } },
    });
  });

  describe('router$', () => {
    test('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getThingId, connectStomp, subscribeBroadcast and for now getThingEdmId', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', {
        a: {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: mockUrl } },
        },
      });

      const expected = cold('-b', { b: 'condition-monitoring' });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(connectStomp());
      expect(store.dispatch).toHaveBeenCalledWith(subscribeBroadcast());
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

    test('should dispatch getThingEdm', () => {
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
          id: 0,
          sensorId: 'fantasyID',
          endDate: '2020-07-30T11:02:35',
          startDate: '2020-07-30T11:02:25',
          sampleRatio: 500,
          edmValue1Counter: 100,
          edmValue2Counter: 200,
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
      expect(dataService.getEdm).toHaveBeenCalledWith(mockSensorID);
    });
  });

  describe('stream$', () => {
    beforeEach(() => {
      action = connectStomp();
    });

    test('should return connectStompStatus action when websocket connection is done', () => {
      const mockToken = 'mockedAccessToken';

      const status = 1;

      const result = getStompStatus({
        status,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: status,
      });
      const expected = cold('--b', { b: result });

      stompService.connect = jest.fn(() => response);

      expect(effects.stream$).toBeObservable(expected);
      expect(stompService.connect).toHaveBeenCalledTimes(1);
      expect(stompService.connect).toHaveBeenCalledWith(mockToken);
    });
  });

  describe('streamEnd$', () => {
    beforeEach(() => {
      action = disconnectStomp();
    });

    test('should return connectStompStatus action when websocket connection close is done', () => {
      const status = 0;

      const result = getStompStatus({
        status,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: status,
      });
      const expected = cold('--b', { b: result });

      stompService.disconnect = jest.fn(() => response);

      expect(effects.streamEnd$).toBeObservable(expected);
      expect(stompService.disconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('topicBroadcast$', () => {
    beforeEach(() => {
      action = subscribeBroadcast();
    });

    test('should return subscribeBroadcastSuccess action when getTopicBroadcast service returns a message', () => {
      const id = 'abc1-def2-ghi3-jkl4';
      const body = { can: 'contain anything for now' };

      const message = {
        body,
        headers: {
          'message-id': id,
        },
      };

      const result = subscribeBroadcastSuccess({
        id,
        body,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: message,
      });
      const expected = cold('--b', { b: result });

      stompService.getTopicBroadcast = jest.fn(() => response);

      expect(effects.topicBroadcast$).toBeObservable(expected);
      expect(stompService.getTopicBroadcast).toHaveBeenCalledTimes(1);
    });
  });
});
