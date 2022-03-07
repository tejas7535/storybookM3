import { RolesGroup } from '@schaeffler/roles-and-rights';

import { getUserRoles } from '..';

describe('Auth Adapter Selector', () => {
  describe('getUserRoles', () => {
    test('should get user roles', () => {
      const result = getUserRoles.projector(['IA_ADMIN']);

      expect(result).toEqual([
        {
          title: 'Insight Attrition',
          roles: [{ title: 'IA_ADMIN' }],
        } as RolesGroup,
      ]);
    });

    test('should return empty array when user has no roles', () => {
      const result = getUserRoles.projector([]);

      expect(result.length).toEqual(0);
    });
  });
});
