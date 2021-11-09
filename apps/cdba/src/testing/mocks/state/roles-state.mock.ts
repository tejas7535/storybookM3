import { RolesState } from '@cdba/core/store/reducers/roles/models/roles-state.model';
import { initialState } from '@cdba/core/store/reducers/roles/roles.reducer';

import { ROLE_DESCRIPTIONS_MOCK } from '../models';

export const ROLES_STATE_MOCK: RolesState = {
  ...initialState,
  roleDescriptions: {
    loading: true,
    items: ROLE_DESCRIPTIONS_MOCK,
    errorMessage: 'API error message',
  },
};
