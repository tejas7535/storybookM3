import { RolesState } from '@cdba/core/store/reducers/roles/models/roles-state.model';
import { initialState } from '@cdba/core/store/reducers/roles/roles.reducer';
import { ROLES_STATE_MOCK } from '@cdba/testing/mocks/state/roles-state.mock';

import {
  getRoleDescriptions,
  getRoleDescriptionsErrorMessage,
  getRoleDescriptionsLoading,
} from './roles.selector';

describe('Roles Selectors', () => {
  const mockState: { roles: RolesState } = { roles: ROLES_STATE_MOCK };

  const initialRolesState: { roles: RolesState } = {
    roles: initialState,
  };

  describe('getRoleDescriptions', () => {
    test('should return roleDescriptions', () => {
      expect(getRoleDescriptions(mockState)).toEqual(
        mockState.roles.roleDescriptions.items
      );
    });

    test('should return empty role descriptions', () => {
      expect(getRoleDescriptions(initialRolesState)).toEqual(
        initialState.roleDescriptions.items
      );
    });
  });

  describe('getRoleDescriptionsLoading', () => {
    test('should return true', () => {
      expect(getRoleDescriptionsLoading(mockState)).toBeTruthy();
    });

    test('should return false', () => {
      expect(getRoleDescriptionsLoading(initialRolesState)).toBeFalsy();
    });
  });

  describe('getRoleDescriptionsErrorMessage', () => {
    test('should return error message', () => {
      expect(getRoleDescriptionsErrorMessage(mockState)).toEqual(
        'API error message'
      );
    });

    test('should return undefined', () => {
      expect(
        getRoleDescriptionsErrorMessage(initialRolesState)
      ).toBeUndefined();
    });
  });
});
