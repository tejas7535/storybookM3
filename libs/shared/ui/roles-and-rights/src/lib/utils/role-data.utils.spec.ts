import {
  mockLabelValueAvailable,
  mockLabelValueUnavailable,
  mockRoleAvailable,
  mockRoleUnavailable,
} from '../mocks/roles-and-rights.mocks';
import { adaptLabelValuesFromRoles } from './role-data.utils';

describe('RoleDateUtils', () => {
  describe('adaptLabelValuesFromRoles', () => {
    it('should convert roles into a set of label-value pairs', () => {
      const fromRolesAvailable = adaptLabelValuesFromRoles([mockRoleAvailable]);
      const fromRolesUnavailable = adaptLabelValuesFromRoles([
        mockRoleUnavailable,
      ]);
      const fromRolesEmpty = adaptLabelValuesFromRoles(undefined);

      expect(fromRolesAvailable).toStrictEqual([mockLabelValueAvailable]);
      expect(fromRolesUnavailable).toStrictEqual([mockLabelValueUnavailable]);
      expect(fromRolesEmpty).toStrictEqual([]);
    });
  });
});
