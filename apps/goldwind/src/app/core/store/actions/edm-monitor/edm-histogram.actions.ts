import { createAction, props, union } from '@ngrx/store';

import { EdmHistogram } from '../../reducers/edm-monitor/edm-histogram.reducer';
import { EdmStatus } from '../../reducers/edm-monitor/models';
import { Interval } from '../../reducers/shared/models';

const NAMESPACE = 'EDM Histogram';

export const getEdmHistogram = createAction(
  `[${NAMESPACE}] Load EDM Histogram`,
  props<{ deviceId: string; channel: string }>()
);

export const getEdmHistogramSuccess = createAction(
  `[${NAMESPACE}] Load EDM Success`,
  props<{ histogram: EdmHistogram[] }>()
);

export const getEdmHistogramFailure = createAction(
  `[${NAMESPACE}] Load EDM Failure`
);

export const stopEdmHistogramPolling = createAction(
  `[${NAMESPACE}] stop Polling`
);
