import { createAction, props, union } from '@ngrx/store';

import { LoadAssessmentDisplay } from '../../reducers/load-assessment/models';
import { Interval } from '../../reducers/shared/models';

export const getLoadAssessmentId = createAction(
  '[Load Assessment] Load Load Assessment ID'
);

export const setLoadAssessmentDisplay = createAction(
  '[Load Assessment] Set Load Assessment Display',
  props<{ loadAssessmentDisplay: LoadAssessmentDisplay }>()
);

export const setLoadAssessmentInterval = createAction(
  '[Load Assessment] Set Interval',
  props<{ interval: Interval }>()
);

const all = union({
  setLoadAssessmentDisplay,
  setLoadAssessmentInterval,
});

export type LoadAssessmentActions = typeof all;
