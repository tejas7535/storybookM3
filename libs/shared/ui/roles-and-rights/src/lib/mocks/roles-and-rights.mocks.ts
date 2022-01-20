import { LabelValue } from '@schaeffler/label-value';

import { Role } from '../models';

export const mockRoleTitle = 'mockRoleTitle';

export const mockRoleRights = 'mockRoleRights';

export const mockLabelValueAvailable: LabelValue = {
  label: mockRoleTitle,
  value: mockRoleRights,
  valueTextClass: undefined,
};

export const mockLabelValueUnavailable: LabelValue = {
  ...mockLabelValueAvailable,
  valueTextClass: 'error',
};

export const mockRoleAvailable: Role = {
  title: mockRoleTitle,
  rights: mockRoleRights,
};

export const mockRoleUnavailable: Role = {
  ...mockRoleAvailable,
  rightsMissing: true,
};
