import {
  pingHealthCheck,
  pingHealthCheckFailure,
  pingHealthCheckSuccess,
} from './health-check.actions';

describe('Health Check Actions', () => {
  test('pingHealthCheck', () => {
    const action = pingHealthCheck();

    expect(action).toEqual({
      type: '[Health Check] Ping Health Check Endpoint',
    });
  });
  test('pingHealthCheckSuccess', () => {
    const action = pingHealthCheckSuccess();

    expect(action).toEqual({
      type: '[Health Check] Ping Health Check Endpoint Success',
    });
  });
  test('pingHealthCheckFailure', () => {
    const errorMessage = 'errorTest';
    const action = pingHealthCheckFailure({ errorMessage });

    expect(action).toEqual({
      type: '[Health Check] Ping Health Check Endpoint Failure',
      errorMessage,
    });
  });
});
