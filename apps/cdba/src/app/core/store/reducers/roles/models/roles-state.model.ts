import { RoleDescriptions } from '@cdba/core/auth/models/roles.models';

export interface RolesState {
  roleDescriptions: {
    loading: boolean;
    items: RoleDescriptions;
    errorMessage: string;
  };
}
