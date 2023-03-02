import { createAction, props, union } from '@ngrx/store';

export const pingHealthCheck = createAction(
  '[Health Check] Ping Health Check Endpoint'
);
export const pingHealthCheckSuccess = createAction(
  '[Health Check] Ping Health Check Endpoint Success'
);
export const pingHealthCheckFailure = createAction(
  '[Health Check] Ping Health Check Endpoint Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  pingHealthCheck,
  pingHealthCheckSuccess,
  pingHealthCheckFailure,
});

export type createHealthCheckActions = typeof all;
