import { createAction, props, union } from '@ngrx/store';

import { EmployeesRequest } from '../../../shared/models';
import { LostJobProfilesResponse, OpenPosition } from '../../models';

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

export const loadOpenPositions = createAction(
  '[Loss of Skill] Load Open Positions',
  props<{ request: EmployeesRequest }>()
);

export const loadOpenPositionsSuccess = createAction(
  '[Loss of Skill] Load Open Positions Success',
  props<{ openPositions: OpenPosition[] }>()
);

export const loadOpenPositionsFailure = createAction(
  '[Loss of Skill] Load Open Positions Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadJobProfiles,
  loadJobProfilesSuccess,
  loadJobProfilesFailure,
  loadOpenPositions,
  loadOpenPositionsSuccess,
  loadOpenPositionsFailure,
});

export type LossOfSkillActions = typeof all;
