import { initialState } from '../../reducers/thing/thing.reducer';
import {
  getCurrentMessage,
  getCurrentMessageId,
  getEdm,
  getMessagesEvents,
  getSocketStatus,
  getThingLoading,
  getThingSensorId,
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
        measurements: [
          {
            id: 0,
            sensorId: 'fantasyID',
            endDate: '2020-07-30T11:02:35',
            startDate: '2020-07-30T11:02:25',
            sampleRatio: 500,
            edmValue1Counter: 100,
            edmValue2Counter: 200,
          },
        ],
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

  describe('getThingSensorId', () => {
    test('should a a static id, will change to actual one', () => {
      // adjust in future
      expect(getThingSensorId(fakeState)).toEqual(
        'ee7bffbe-2e87-49f0-b763-ba235dd7c876'
      );
    });
  });

  describe('getEdm', () => {
    test('should return EDM measurements', () => {
      expect(getEdm(fakeState)).toEqual(fakeState.thing.thing.measurements);
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
