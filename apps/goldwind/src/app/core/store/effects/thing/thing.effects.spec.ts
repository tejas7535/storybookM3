import { TestBed } from '@angular/core/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { getAccessToken } from '@schaeffler/shared/auth';

import { IOT_THING_MOCK } from '../../../../../testing/mocks';
import { DataService } from '../../../http/data.service';
import {
  getStomp,
  getStompStatus,
  getThing,
  getThingSuccess,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
} from '../../actions/thing/thing.actions';
import { ThingEffects } from './thing.effects';

describe('Search Effects', () => {
  let actions$: any;
  let action: any;
  let store: any;
  let effects: ThingEffects;
  let dataService: DataService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ThingEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: DataService,
          useValue: {
            getIotThings: jest.fn(),
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
    dataService = TestBed.inject(DataService);

    store.overrideSelector(getAccessToken, 'mockedAccessToken');
  });

  describe('thing$', () => {
    beforeEach(() => {
      action = getThing({ thingId: 123 });
    });

    test('should return searchSuccess action when REST call is successful', () => {
      const result = getThingSuccess({
        thing: IOT_THING_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: IOT_THING_MOCK,
      });
      const expected = cold('--b', { b: result });

      dataService.getIotThings = jest.fn(() => response);

      expect(effects.thing$).toBeObservable(expected);
      expect(dataService.getIotThings).toHaveBeenCalledTimes(1);
      expect(dataService.getIotThings).toHaveBeenCalledWith(123);
    });
  });

  describe('thingStream$', () => {
    beforeEach(() => {
      action = getStomp();
    });

    test('should return getStompStatus action when websocket connection attempt is done', () => {
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

      dataService.connect = jest.fn(() => response);

      expect(effects.thingStream$).toBeObservable(expected);
      expect(dataService.connect).toHaveBeenCalledTimes(1);
      expect(dataService.connect).toHaveBeenCalledWith(mockToken);
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

      dataService.getTopicBroadcast = jest.fn(() => response);

      expect(effects.topicBroadcast$).toBeObservable(expected);
      expect(dataService.getTopicBroadcast).toHaveBeenCalledTimes(1);
    });
  });
});
