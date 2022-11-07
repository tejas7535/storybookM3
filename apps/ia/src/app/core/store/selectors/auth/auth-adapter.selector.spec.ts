import { RolesGroup } from '@schaeffler/roles-and-rights';

import { getUserRoles } from '..';

describe('Auth Adapter Selector', () => {
  describe('getUserRoles', () => {
    test('should get user roles', () => {
      const result = getUserRoles.projector([
        'IA_ADMIN',
        'HR_PA_TEST',
        'IGNORE_ME',
      ]);

      expect(result).toEqual([
        {
          title: 'translate it',
          roles: [{ title: 'IA_ADMIN', rights: 'translate it' }],
        } as RolesGroup,
        {
          title: 'translate it',
          roles: [{ title: 'HR_PA_TEST' }],
          showOnlyRoles: true,
        } as RolesGroup,
      ]);
    });

    test('should return empty array when user has no roles', () => {
      const result = getUserRoles.projector([]);

      expect(result.length).toEqual(0);
    });
  });
});
