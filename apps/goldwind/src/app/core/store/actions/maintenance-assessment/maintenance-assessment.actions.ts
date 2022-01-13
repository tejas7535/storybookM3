import { createAction, props, union } from '@ngrx/store';

import { MaintenanceAssessmentDisplay } from '../../reducers/maintenance-assessment/maintenance.assessment.model';
import { MaintenaceSensorData } from '../../../http/types';
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

export const getMaintenanceAssessmentData = createAction(
  `[${NAMESPACE}] Get Data`,
  props<{ deviceId: string }>()
);
export const getMaintenanceAssessmentDataSuccess = createAction(
  `[${NAMESPACE}] Return Data`,
  props<{ data: MaintenaceSensorData[] }>()
);
export const getMaintenanceAssessmentDataFailure = createAction(
  `[${NAMESPACE}] Failed Data`
);

const all = union({
  setMaintenanceAssessmentDisplay,
  setMaintenanceAssessmentInterval,
});

export type MaintenanceAssessmentActions = typeof all;
