import { createAction, props, union } from '@ngrx/store';
import { LoadAssessmentData } from '../../../http/rest.service';

import { LoadAssessmentDisplay } from '../../reducers/load-assessment/models';
import { Interval } from '../../reducers/shared/models';

const NAMESPACE = 'Load Assessment';

export const getLoadAssessmentId = createAction(
  `[${NAMESPACE}] Load ${NAMESPACE} ID`
);

export const setLoadAssessmentDisplay = createAction(
  `[${NAMESPACE}] Set ${NAMESPACE} Display`,
  props<{ loadAssessmentDisplay: LoadAssessmentDisplay }>()
);

export const setLoadAssessmentInterval = createAction(
  `[${NAMESPACE}] Set Interval`,
  props<{ interval: Interval }>()
);

export const getLoadAssessmentData = createAction(
  `[${NAMESPACE}] Get Data`,
  props<{ deviceId: string }>()
);
export const getLoadAssessmentDataSuccess = createAction(
  `[${NAMESPACE}] Return Data`,
  props<{ data: LoadAssessmentData[] }>()
);
export const getLoadAssessmentDataFailure = createAction(
  `[${NAMESPACE}] Failed Data`
);

const all = union({
  setLoadAssessmentDisplay,
  setLoadAssessmentInterval,
});

export type LoadAssessmentActions = typeof all;
