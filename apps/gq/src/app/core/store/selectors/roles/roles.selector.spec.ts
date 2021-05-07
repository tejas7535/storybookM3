import { UserRoles } from '../../../../shared/roles/user-roles.enum';
import {
  filterRoles,
  getAllRoles,
  userHasGPCRole,
  userHasManualPriceRole,
} from './roles.selector';

describe('shared selector', () => {
  describe('get all roles', () => {
    test('should set roles', () => {
      const roles = [UserRoles.BASIC, UserRoles.REGION_WORLD];

      expect(getAllRoles.projector(roles)).toEqual([
        {
          key: 'geoRoles',
          roles: [UserRoles.REGION_WORLD],
        },
        {
          key: 'sectoralRoles',
          roles: [],
        },
        {
          key: 'costRoles',
          roles: [],
        },
        {
          key: 'priceRoles',
          roles: [],
        },
      ]);
    });
    test('should return empty array', () => {
      expect(getAllRoles.projector(undefined)).toEqual([]);
    });
  });
  describe('filter roles', () => {
    test('should filter roles', () => {
      const roles = [UserRoles.COST_SQV, UserRoles.MANUAL_PRICE];
      const result = filterRoles(roles, UserRoles.COST_PREFIX);
      expect(result).toEqual([UserRoles.COST_SQV]);
    });
  });
  describe('userHasGPCRole', () => {
    test('should return true', () => {
      const roles = [UserRoles.BASIC, UserRoles.COST_GPC];

      expect(userHasGPCRole.projector(roles)).toBeTruthy();
    });
    test('should return false', () => {
      const roles = [UserRoles.BASIC, UserRoles.REGION_WORLD];

      expect(userHasGPCRole.projector(roles)).toBeFalsy();
    });
  });
  describe('userHasManualPriceRole', () => {
    test('should return true', () => {
      const roles = [UserRoles.BASIC, UserRoles.MANUAL_PRICE];

      expect(userHasManualPriceRole.projector(roles)).toBeTruthy();
    });
    test('should return false', () => {
      const roles = [UserRoles.BASIC, UserRoles.REGION_WORLD];

      expect(userHasManualPriceRole.projector(roles)).toBeFalsy();
    });
  });
});
