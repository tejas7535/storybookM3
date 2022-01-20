import { LabelValue } from '@schaeffler/label-value';

import { Role } from '../models';

/**
 * Convert roles into a set of label-value pairs
 */
export const adaptLabelValuesFromRoles = (
  roles: Role[] | undefined
): LabelValue[] =>
  roles
    ? roles.map((role) => ({
        label: role.title,
        value: role.rights,
        valueTextClass: role.rightsMissing ? 'error' : undefined,
      }))
    : [];
