import { createAction, props } from '@ngrx/store';
import { EdmHistogram } from '../../reducers/edm-monitor/edm-histogram.reducer';

const NAMESPACE = 'EDM Histogram';

export const getEdmHistogram = createAction(
  `[${NAMESPACE}] Load EDM Histogram`,
  props<{ deviceId: string }>()
);

export const getEdmHistogramSuccess = createAction(
  `[${NAMESPACE}] Load EDM Success`,
  props<{ histogram: EdmHistogram }>()
);

export const getEdmHistogramFailure = createAction(
  `[${NAMESPACE}] Load EDM Failure`
);

export const stopEdmHistogramPolling = createAction(
  `[${NAMESPACE}] stop Polling`
);

export const setEdmChannel = createAction(
  '[EDM Monitor] Set Channel',
  props<{ channel: string }>()
);
