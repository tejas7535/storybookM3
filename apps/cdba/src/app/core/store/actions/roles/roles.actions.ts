import { createAction, props } from '@ngrx/store';

import { RoleDescriptions } from '@cdba/core/auth/models/roles.models';

export const loadRoleDescriptions = createAction(
  '[Roles] Load Role Descriptions'
);

export const loadRoleDescriptionsSuccess = createAction(
  '[Roles] Load Role Descriptions Success',
  props<{ roleDescriptions: RoleDescriptions }>()
);

export const loadRoleDescriptionsFailure = createAction(
  '[Roles] Load Role Descriptions Failure',
  props<{ errorMessage: string }>()
);
