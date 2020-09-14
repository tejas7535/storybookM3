import { TestBed } from '@angular/core/testing';

import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { getAccessToken } from '@schaeffler/auth';

import { StompService } from '../../../http/stomp.service';
import {
  connectStomp,
  disconnectStomp,
  getStompStatus,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
} from '../../actions';
import { ConditionMonitoringEffects } from './condition-monitoring.effects';

describe('Search Effects', () => {
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<ConditionMonitoringEffects>;
  let effects: ConditionMonitoringEffects;
  let stompService: StompService;

  const mockUrl = '/bearing/666/condition-monitoring';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ConditionMonitoringEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
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
    stompService = TestBed.inject(StompService);

    store.overrideSelector(getAccessToken, 'mockedAccessToken');
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
