import { ROLE_DESCRIPTIONS_MOCK } from '@cdba/testing/mocks/models';

import {
  loadRoleDescriptions,
  loadRoleDescriptionsFailure,
  loadRoleDescriptionsSuccess,
} from './roles.actions';

describe('Roles actions', () => {
  const errorMessage = 'API error message';

  describe('Role descriptions actions', () => {
    test('loadRoleDescriptions', () => {
      const action = loadRoleDescriptions();

      expect(action).toEqual({
        type: '[Roles] Load Role Descriptions',
      });
    });

    test('loadRoleDescriptionsSuccess', () => {
      const roleDescriptions = ROLE_DESCRIPTIONS_MOCK;
      const action = loadRoleDescriptionsSuccess({ roleDescriptions });

      expect(action).toEqual({
        roleDescriptions,
        type: '[Roles] Load Role Descriptions Success',
      });
    });

    test('loadRoleDescriptionsFailure', () => {
      const action = loadRoleDescriptionsFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Roles] Load Role Descriptions Failure',
      });
    });
  });
});
