import { createAction, props, union } from '@ngrx/store';
import { GCMHeatmapEntry } from '../../../../shared/models';

import { GcmStatus } from '../../reducers/grease-status/models';

const TYPE = 'GreaseStatus';

export const getGreaseStatusId = createAction(
  `[${TYPE}] Load Grease Sensor ID`,
  props<{ source: string }>()
);

export const getGreaseStatus = createAction(
  `[${TYPE}] Load ${TYPE}`,
  props<{ deviceId: string }>()
);

export const getGreaseStatusSuccess = createAction(
  `[${TYPE}] Load ${TYPE} Success`,
  props<{ gcmStatus: GcmStatus[] }>()
);

export const getGreaseStatusFailure = createAction(
  `[${TYPE}] Load ${TYPE} Failure`
);

export const getGreaseStatusLatest = createAction(
  `[${TYPE}] Load Latest ${TYPE}`,
  props<{ deviceId: string }>()
);

export const stopGetGreaseStatusLatest = createAction(
  `[${TYPE}] Stop Load Latest ${TYPE}`
);

export const getGreaseHeatMap = createAction(
  `[${TYPE}] Load ${TYPE} Heatmap`,
  props<{ deviceId: string }>()
);

export const getGreaseHeatMapLatest = createAction(
  `[${TYPE}] Load Latest ${TYPE} Heatmap`,
  props<{ deviceId: string }>()
);

export const getGreaseHeatMapSuccess = createAction(
  `[${TYPE}] Load ${TYPE} Heatmap Success`,
  props<{ gcmheatmap: GCMHeatmapEntry[] }>()
);
export const getGreaseHeatMapFailure = createAction(
  `[${TYPE}] Load ${TYPE} Heatmap Failure`
);

export const getGreaseStatusLatestSuccess = createAction(
  `[${TYPE}] Load Latest ${TYPE} Success`,
  props<{ greaseStatusLatest: GcmStatus }>()
);

export const getGreaseStatusLatestFailure = createAction(
  `[${TYPE}] Load Latest ${TYPE} Failure`
);

export const getGreaseHeatMapId = createAction(
  `[${TYPE}] Load Grease Sensor ID`,
  props<{ source: string }>()
);

const all = union({
  getGreaseStatusId,
  getGreaseStatus,
  getGreaseStatusSuccess,
  getGreaseStatusFailure,
  stopGetGreaseStatusLatest,
  getGreaseHeatMap,
  getGreaseHeatMapLatest,
  getGreaseHeatMapFailure,
  getGreaseHeatMapSuccess,
});

export type GreaseStatusActions = typeof all;
