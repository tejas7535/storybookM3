import {
  initialState,
  RolesState,
} from '@cdba/core/store/reducers/roles/roles.reducer';

import {
  EMPTY_ROLE_DESCRIPTIONS_MOCK,
  ROLE_DESCRIPTIONS_MOCK,
} from '../models';

export const ROLES_STATE_SUCCESS_MOCK: RolesState = {
  ...initialState,
  roleDescriptions: {
    loaded: true,
    items: ROLE_DESCRIPTIONS_MOCK,
    errorMessage: undefined,
  },
};

export const ROLES_STATE_ERROR_MOCK: RolesState = {
  ...initialState,
  roleDescriptions: {
    loaded: false,
    items: EMPTY_ROLE_DESCRIPTIONS_MOCK,
    errorMessage: 'API error message',
  },
};
