import { initialState } from '../../reducers/condition-monitoring/condition-monitoring.reducer';
import {
  getCurrentMessage,
  getCurrentMessageId,
  getMessagesEvents,
  getSocketStatus,
} from './condition-monitoring.selector';

describe('ConditionMonitoring Selector', () => {
  const fakeState = {
    conditionMonitoring: {
      ...initialState,
      centerLoad: {
        socketStatus: 0,
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
  };

  describe('getSocketStatus ', () => {
    test('should return numeric socket status', () => {
      expect(getSocketStatus(fakeState)).toEqual(0);
    });
  });

  describe('getMessagesEvents', () => {
    test('should return array of events', () => {
      expect(getMessagesEvents(fakeState)).toEqual(
        fakeState.conditionMonitoring.centerLoad.events
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
        conditionMonitoring: {
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
        body: fakeState.conditionMonitoring.centerLoad.contents['newerEvent'],
      };

      expect(getCurrentMessage(fakeState)).toEqual(expectedResult);
    });

    test('should return undefined when there are no events', () => {
      const emptyFakeState = {
        conditionMonitoring: {
          ...initialState,
        },
      };

      expect(getCurrentMessage(emptyFakeState)).toEqual(undefined);
    });
  });
});
