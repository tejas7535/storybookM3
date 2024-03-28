import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { getBackendRoles } from '@schaeffler/azure-auth';
import { Role } from '@schaeffler/roles-and-rights';

import {
  GENERAL_ROLES_PREFIXES,
  GEOGRAPHICAL_ROLES_PREFIXES,
} from '../../../../shared/constants';

export const getUserRoles = createSelector(
  getBackendRoles,
  (roles: string[]) => {
    const generalRoles = filterRoles(roles, GENERAL_ROLES_PREFIXES);
    const geoRoles = filterRoles(roles, GEOGRAPHICAL_ROLES_PREFIXES);

    const roleGroups = [];

    if (generalRoles.length > 0) {
      const generalRolesEntry = {
        title: translate('user.userSettings.roles.generalRoles'),
        roles: generalRoles.map((role) => {
          const title = getTranslationKeyFromRole(role, GENERAL_ROLES_PREFIXES);

          return {
            title,
            rights: translate(`user.userSettings.roles.prefixes.${title}`),
          } as Role;
        }),
      };

      roleGroups.push(generalRolesEntry);
    }

    if (geoRoles.length > 0) {
      const geoRolesEntry = {
        title: translate('user.userSettings.roles.geographicalRoles'),
        roles: geoRoles.map((role) => ({ title: role }) as Role),
        showOnlyRoles: true,
      };

      roleGroups.push(geoRolesEntry);
    }

    return roleGroups;
  }
);

const filterRoles = (roles: string[], prefixes: string[]) =>
  roles.filter((role) => prefixes.some((prefix) => role.includes(prefix)));

const getTranslationKeyFromRole = (role: string, prefixes: string[]): string =>
  prefixes.find((prefix) => role.includes(prefix));
