import { RoleDescriptions } from '@cdba/core/auth/models/roles.models';

export interface RolesState {
  roleDescriptions: {
    loaded: boolean;
    items: RoleDescriptions;
    errorMessage: string;
  };
}
