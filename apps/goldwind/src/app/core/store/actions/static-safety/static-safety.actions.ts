import { createAction, props, union } from '@ngrx/store';
import { StaticSafetyFactorEntity } from '../../../http/types/static-safety-factory.entity';

const TOPIC = 'Static Safety';

export const getStaticSafetyId = createAction(
  `[${TOPIC}] Load ${TOPIC} ID`,
  props<{ source: string }>()
);

export const getStaticSafetyLatest = createAction(
  `[${TOPIC}] Load latest ${TOPIC}`,
  props<{ deviceId: string }>()
);

export const getStaticSafetyLatestSuccess = createAction(
  `[${TOPIC}] Load latest ${TOPIC} Success`,
  props<{ result: StaticSafetyFactorEntity }>()
);

export const getStaticSafetyLatestFailure = createAction(
  `[${TOPIC}] Load latest ${TOPIC} Failure`
);

export const stopGetStaticSafetyLatest = createAction(
  `[${TOPIC}] Stop Load latest ${TOPIC}`
);

const all = union({
  getStaticSafetyId,
  getStaticSafetyLatest,
  stopGetStaticSafetyLatest,
  getStaticSafetyLatestSuccess,
  getStaticSafetyLatestFailure,
});

export type StaticSafetyActions = typeof all;
