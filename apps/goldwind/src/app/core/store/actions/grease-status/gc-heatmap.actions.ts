import { createAction, props, union } from '@ngrx/store';

import { GCMHeatmapEntry } from '../../../../shared/models';

const TYPE = 'Grease Heatmap';

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

export const getGreaseHeatMapId = createAction(
  `[${TYPE}] Load Grease Sensor ID`,
  props<{ source: string }>()
);

const all = union({
  getGreaseHeatMap,
  getGreaseHeatMapLatest,
  getGreaseHeatMapFailure,
  getGreaseHeatMapSuccess,
});

export type GreaseHeatmapStatusActions = typeof all;
