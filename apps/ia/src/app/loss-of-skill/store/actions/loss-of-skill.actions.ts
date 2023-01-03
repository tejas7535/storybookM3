import { createAction, props, union } from '@ngrx/store';

import { ExitEntryEmployeesResponse } from '../../../overview/models';
import { EmployeesRequest } from '../../../shared/models';
import { LostJobProfilesResponse, WorkforceResponse } from '../../models';

export const loadLossOfSkillData = createAction(
  '[Loss of Skill] Load Loss of Skill Data'
);

export const loadJobProfiles = createAction(
  '[Loss of Skill] Load Job Profiles',
  props<{ request: EmployeesRequest }>()
);

export const loadJobProfilesSuccess = createAction(
  '[Loss of Skill] Load Job Profiles Success',
  props<{ lostJobProfilesResponse: LostJobProfilesResponse }>()
);

export const loadJobProfilesFailure = createAction(
  '[Loss of Skill] Load Job Profiles Failure',
  props<{ errorMessage: string }>()
);

export const loadLossOfSkillWorkforce = createAction(
  '[Loss of Skill] Load Loss of Skill Workforce',
  props<{ positionDescription: string }>()
);

export const loadLossOfSkillWorkforceSuccess = createAction(
  '[Loss of Skill] Load Loss of Skill Workforce Success',
  props<{ data: WorkforceResponse }>()
);

export const loadLossOfSkillWorkforceFailure = createAction(
  '[Loss of Skill] Load Loss of Skill Workforce Failure',
  props<{ errorMessage: string }>()
);

export const loadLossOfSkillLeavers = createAction(
  '[Loss of Skill] Load Loss of Skill Leavers',
  props<{ positionDescription: string }>()
);

export const loadLossOfSkillLeaversSuccess = createAction(
  '[Loss of Skill] Load Loss of Skill Leavers Success',
  props<{ data: ExitEntryEmployeesResponse }>()
);

export const loadLossOfSkillLeaversFailure = createAction(
  '[Loss of Skill] Load Loss of Skill Leavers Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadJobProfiles,
  loadJobProfilesSuccess,
  loadJobProfilesFailure,
});

export type LossOfSkillActions = typeof all;
