import { createAction, props, union } from '@ngrx/store';

import { MaintenanceAssessmentDisplay } from '../../reducers/maintenance-assessment/maintenance.assessment.model';
import { Interval } from '../../reducers/shared/models';
const NAMESPACE = 'Maintenance Assessment';

export const getMaintenanceAssessmentId = createAction(
  `[${NAMESPACE}] Load ${NAMESPACE} ID`
);

export const setMaintenanceAssessmentDisplay = createAction(
  `[${NAMESPACE}] Set ${NAMESPACE} Display`,
  props<{ maintenanceAssessmentDisplay: MaintenanceAssessmentDisplay }>()
);

export const setMaintenanceAssessmentInterval = createAction(
  `[${NAMESPACE}] Set Interval`,
  props<{ interval: Interval }>()
);

const all = union({
  setMaintenanceAssessmentDisplay,
  setMaintenanceAssessmentInterval,
});

export type MaintenanceAssessmentActions = typeof all;
