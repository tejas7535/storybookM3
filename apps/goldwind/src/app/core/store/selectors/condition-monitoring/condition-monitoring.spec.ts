import { initialState } from '../../reducers/condition-monitoring/condition-monitoring.reducer';
import {
  getCurrentMessage,
  getCurrentMessageId,
  getEdmResult,
  getMessagesEvents,
  getSensorId,
  getSocketStatus,
} from './condition-monitoring.selector';

describe('ConditionMonitoring Selector', () => {
  const fakeState = {
    conditionMonitoring: {
      ...initialState,
      edm: {
        loading: false,
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
      },
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

  describe('getSensorId', () => {
    test('should a a static id, will change to actual one', () => {
      // adjust in future
      expect(getSensorId(fakeState)).toEqual(
        'ee7bffbe-2e87-49f0-b763-ba235dd7c876'
      );
    });
  });

  describe('getEdmResult', () => {
    test('should return EDM measurements', () => {
      expect(getEdmResult(fakeState)).toEqual(
        fakeState.conditionMonitoring.edm.measurements
      );
    });
  });

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
