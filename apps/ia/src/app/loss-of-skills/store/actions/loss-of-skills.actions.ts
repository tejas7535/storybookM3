import { createAction, props, union } from '@ngrx/store';

import { EmployeesRequest, LostJobProfile } from '../../../shared/models';

export const loadLostJobProfiles = createAction(
  '[Loss of Skills] Load Lost Job Profiles',
  props<{ request: EmployeesRequest }>()
);

export const loadLostJobProfilesSuccess = createAction(
  '[Loss of Skills] Load Lost Job Profiles Success',
  props<{ lostJobProfiles: LostJobProfile[] }>()
);

export const loadLostJobProfilesFailure = createAction(
  '[Loss of Skills] Load Lost Job Profiles Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadLostJobProfiles,
  loadLostJobProfilesSuccess,
  loadLostJobProfilesFailure,
});

export type LossOfSkillsActions = typeof all;
