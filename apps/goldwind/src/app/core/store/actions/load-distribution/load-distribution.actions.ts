import { createAction, props, union } from '@ngrx/store';
import { LoadSense } from '../../reducers/load-sense/models';
import { LoadDistribution } from '../../selectors/load-distribution/load-distribution.interface';

const TOPIC = 'LoadDistribution';

export const getLoadDistributionId = createAction(
  `[${TOPIC}] Load ${TOPIC} ID`,
  props<{ source: string }>()
);

export const getLoadDistributionLatest = createAction(
  `[${TOPIC}] Load latest ${TOPIC}`,
  props<{ deviceId: string }>()
);
export const getLoadDistributionAverage = createAction(
  `[${TOPIC}] Load Average ${TOPIC}`,
  props<{ deviceId: string }>()
);

export const getLoadDistributionLatestSuccess = createAction(
  `[${TOPIC}] Load latest ${TOPIC} Success`,
  props<{
    row1?: LoadDistribution;
    row2?: LoadDistribution;
    lsp?: LoadSense;
  }>()
);

export const getLoadDistributionLatestFailure = createAction(
  `[${TOPIC}] Load latest ${TOPIC} Failure`
);

export const stopLoadDistributionGet = createAction(
  `[${TOPIC}] Stop Load latest ${TOPIC}`
);

const all = union({
  getLoadDistributionId,
  getLoadDistributionLatest,
  getLoadDistributionLatestSuccess,
  getLoadDistributionLatestFailure,
  stopLoadDistributionGet,
});

export type LoadDistributionActions = typeof all;
