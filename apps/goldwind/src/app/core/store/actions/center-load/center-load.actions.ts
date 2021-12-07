import { createAction, props, union } from '@ngrx/store';

import { CenterLoadStatus } from '../../../../shared/models/center-load';

const NAMESPACE = 'CenterLoad';

export const getCenterLoad = createAction(
  `[${NAMESPACE}] Load CenterLoad`,
  props<{ deviceId: string }>()
);

export const getCenterLoadSuccess = createAction(
  `[${NAMESPACE}] Load CenterLoad Success`,
  props<{ centerLoad: CenterLoadStatus[] }>()
);

export const getCenterLoadFailure = createAction(
  `[${NAMESPACE}] Load CenterLoad Failure`
);

const all = union({
  getCenterLoad,
  getCenterLoadFailure,
  getCenterLoadSuccess,
});

export type CenterLoadActions = typeof all;
