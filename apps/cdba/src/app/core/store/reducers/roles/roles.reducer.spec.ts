import {
  ROLE_DESCRIPTIONS_MOCK,
  ROLES_STATE_ERROR_MOCK,
  ROLES_STATE_SUCCESS_MOCK,
} from '@cdba/testing/mocks';

import {
  loadRoleDescriptionsFailure,
  loadRoleDescriptionsSuccess,
} from '../../actions/roles/roles.actions';
import { initialState, rolesReducer } from './roles.reducer';

describe('rolesReducer', () => {
  describe('on loadRoleDescriptionsSuccess', () => {
    test('should set roleDescriptions', () => {
      const action = loadRoleDescriptionsSuccess({
        roleDescriptions: ROLE_DESCRIPTIONS_MOCK,
      });
      const state = rolesReducer(initialState, action);

      expect(state).toEqual(ROLES_STATE_SUCCESS_MOCK);
    });
  });

  describe('on loadRoleDescriptionsFailure', () => {
    test('should set errorMessage', () => {
      const action = loadRoleDescriptionsFailure({
        errorMessage: ROLES_STATE_ERROR_MOCK.roleDescriptions.errorMessage,
      });
      const state = rolesReducer(initialState, action);

      expect(state).toEqual(ROLES_STATE_ERROR_MOCK);
    });
  });
});
