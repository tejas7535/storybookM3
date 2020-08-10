import { TestBed } from '@angular/core/testing';

import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { getAccessToken } from '@schaeffler/auth';

import { IOT_THING_MOCK } from '../../../../../testing/mocks';
import { DataService } from '../../../http/data.service';
import { StompService } from '../../../http/stomp.service';
import {
  connectStomp,
  disconnectStomp,
  getStompStatus,
  getThing,
  getThingEdm,
  getThingEdmId,
  getThingEdmSuccess,
  getThingId,
  getThingSuccess,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
} from '../../actions/thing/thing.actions';
import * as fromRouter from '../../reducers';
import { getThingSensorId } from '../../selectors/thing/thing.selector';
import { ThingEffects } from './thing.effects';

describe('Search Effects', () => {
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<ThingEffects>;
  let effects: ThingEffects;
  let dataService: DataService;
  let stompService: StompService;

  const mockUrl = '/bearing/666/condition-monitoring';
  const mockSensorID = 'ee7bffbe-2e87-49f0-b763-ba235dd7c876';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ThingEffects,
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
    effects = TestBed.inject(ThingEffects);
    metadata = getEffectsMetadata(effects);
    dataService = TestBed.inject(DataService);
    stompService = TestBed.inject(StompService);

    store.overrideSelector(getAccessToken, 'mockedAccessToken');
    store.overrideSelector(getThingSensorId, mockSensorID);
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

      const expected = cold('-b', { b: 'bearing' });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(getThingId());
      expect(store.dispatch).toHaveBeenCalledWith(connectStomp());
      expect(store.dispatch).toHaveBeenCalledWith(subscribeBroadcast());
      expect(store.dispatch).toHaveBeenCalledWith(getThingEdmId()); // will also be moved
    });
  });

  describe('thingId$', () => {
    test('should not return an action', () => {
      expect(metadata.thingId$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getThing', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', { a: getThingId() });

      const expected = cold('-b', { b: 666 });

      expect(effects.thingId$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(
        getThing({
          thingId: 666,
        })
      );
    });
  });

  describe('thing$', () => {
    beforeEach(() => {
      action = getThing({ thingId: 123 });
    });

    test('should return getThingSuccess action when REST call is successful', () => {
      const result = getThingSuccess({
        thing: IOT_THING_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: IOT_THING_MOCK,
      });
      const expected = cold('--b', { b: result });

      dataService.getThing = jest.fn(() => response);

      expect(effects.thing$).toBeObservable(expected);
      expect(dataService.getThing).toHaveBeenCalledTimes(1);
      expect(dataService.getThing).toHaveBeenCalledWith(123);
    });
  });

  describe('thingEdmId$', () => {
    test('should not return an action', () => {
      expect(metadata.thingEdmId$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getThingEdm', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', { a: getThingEdmId() });

      const expected = cold('-b', {
        b: mockSensorID,
      });

      expect(effects.thingEdmId$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(
        getThingEdm({
          sensorId: mockSensorID,
        })
      );
    });
  });

  describe('thingEdm$', () => {
    beforeEach(() => {
      action = getThingEdm({
        sensorId: mockSensorID,
      });
    });

    test('should return getThingEdmSuccess action when REST call is successful', () => {
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

      const result = getThingEdmSuccess({
        measurements: mockMeasurements,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: mockMeasurements,
      });
      const expected = cold('--b', { b: result });

      dataService.getEdm = jest.fn(() => response);

      expect(effects.thingEdm$).toBeObservable(expected);
      expect(dataService.getEdm).toHaveBeenCalledTimes(1);
      expect(dataService.getEdm).toHaveBeenCalledWith(mockSensorID);
    });
  });

  describe('thingStream$', () => {
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

      expect(effects.thingStream$).toBeObservable(expected);
      expect(stompService.connect).toHaveBeenCalledTimes(1);
      expect(stompService.connect).toHaveBeenCalledWith(mockToken);
    });
  });

  describe('thingStreamEnd$', () => {
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

      expect(effects.thingStreamEnd$).toBeObservable(expected);
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
