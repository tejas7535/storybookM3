import { UserRoles } from '../../../../shared/roles/user-roles.enum';
import { filterRoles, getAllRoles } from './roles.selector';

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
});
