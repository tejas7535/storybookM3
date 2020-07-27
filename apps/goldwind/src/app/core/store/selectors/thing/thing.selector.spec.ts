import { initialState } from '../../reducers/thing/thing.reducer';
import {
  getCurrentMessage,
  getCurrentMessageId,
  getMessagesEvents,
  getSocketStatus,
  getThingLoading,
  getThingThing,
} from './thing.selector';

describe('Thing Selector', () => {
  const fakeState = {
    thing: {
      ...initialState,
      thing: {
        thing: {
          name: 'Thingname',
        },
        loading: false,
        socketStatus: 0,
        messages: {
          events: [
            {
              id: 'olderEvent',
              timestamp: 1594987541846,
            },
            {
              id: 'newerEvent',
              timestamp: 1594987541847,
            },
          ],
          contents: {
            olderEvent: 'olderEventBody',
            newerEvent: 'newerEventBody',
          },
        },
      },
    },
  };

  describe('getThingLoading', () => {
    test('should return loading status', () => {
      expect(getThingLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getThingThing', () => {
    test('should return a thing', () => {
      expect(getThingThing(fakeState)).toEqual(fakeState.thing.thing.thing);
    });
  });

  describe('getSocketStatus ', () => {
    test('should return numeric socket status', () => {
      expect(getSocketStatus(fakeState)).toEqual(0);
    });
  });

  describe('getMessagesEvents  ', () => {
    test('should return array of events', () => {
      expect(getMessagesEvents(fakeState)).toEqual(
        fakeState.thing.thing.messages.events
      );
    });
  });

  describe('getCurrentMessageId', () => {
    test('should return event with the highest (most current) timestamp', () => {
      const newestEvent = {
        id: 'newerEvent',
        timestamp: 1594987541847,
      };

      expect(getCurrentMessageId(fakeState)).toEqual(newestEvent);
    });

    test('should return undefined when there are no events', () => {
      const emptyFakeState = {
        thing: {
          ...initialState,
        },
      };
      expect(getCurrentMessageId(emptyFakeState)).toEqual(undefined);
    });
  });

  describe('getCurrentMessage', () => {
    test('should return object containing the most current message body and timestamp', () => {
      const newestEvent = {
        id: 'newerEvent',
        timestamp: 1594987541847,
      };

      const expectedResult = {
        timestamp: newestEvent.timestamp,
        body: fakeState.thing.thing.messages.contents['newerEvent'],
      };

      expect(getCurrentMessage(fakeState)).toEqual(expectedResult);
    });

    test('should return undefined when there are no events', () => {
      const emptyFakeState = {
        thing: {
          ...initialState,
        },
      };

      expect(getCurrentMessage(emptyFakeState)).toEqual(undefined);
    });
  });
});
