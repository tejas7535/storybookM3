import {
  connectStomp,
  disconnectStomp,
  getStompStatus,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
} from '..';

describe('ConditionMonitoring Actions', () => {
  describe('Get ConditionMonitoring Actions', () => {
    test('connectStomp', () => {
      const action = connectStomp();

      expect(action).toEqual({
        type: '[ConditionMonitoring] Establish Stomp Connection',
      });
    });

    test('disconnectStomp', () => {
      const action = disconnectStomp();

      expect(action).toEqual({
        type: '[ConditionMonitoring] End Stomp Connection',
      });
    });

    test('getStompStatus', () => {
      const status = 1;
      const action = getStompStatus({ status });

      expect(action).toEqual({
        status,
        type: '[ConditionMonitoring] Establish Stomp Connection Status',
      });
    });

    test('subscribeBroadcast', () => {
      const action = subscribeBroadcast();

      expect(action).toEqual({
        type: '[ConditionMonitoring] Subscribe Broadcast',
      });
    });

    test('subscribeBroadcastSuccess', () => {
      const id = 'test-id';
      const body = 'anything really';
      const action = subscribeBroadcastSuccess({ id, body });

      expect(action).toEqual({
        id,
        body,
        type: '[ConditionMonitoring] Subscribe Broadcast Success',
      });
    });
  });
});
