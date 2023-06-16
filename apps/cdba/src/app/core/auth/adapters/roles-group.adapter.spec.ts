import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { Role, RolesGroup } from '@schaeffler/roles-and-rights';

import { PRODUCT_LINE_ROLE_DESCRIPTION_MOCK } from '@cdba/testing/mocks';

import { RoleDescription } from '../models/roles.models';
import { RolesGroupAdapter } from './roles-group.adapter';

describe('RolesGroupAdapter', () => {
  let spectator: SpectatorService<RolesGroupAdapter>;
  let service: RolesGroupAdapter;

  const createService = createServiceFactory({
    service: RolesGroupAdapter,
  });

  const mockTitle = 'mockTitle';
  const mockRoles: Role[] = [
    {
      title: PRODUCT_LINE_ROLE_DESCRIPTION_MOCK.id,
      rights: PRODUCT_LINE_ROLE_DESCRIPTION_MOCK.description,
    },
  ];

  const adapterSourceValid: RoleDescription[] = [
    PRODUCT_LINE_ROLE_DESCRIPTION_MOCK,
  ];

  const adapterTargetValid: RolesGroup = {
    title: mockTitle,
    roles: mockRoles,
  };

  const adapterTargetInvalid: RolesGroup = {
    title: '',
    roles: [],
  };

  const adapterTargetInvalidTitle: RolesGroup = {
    title: '',
    roles: mockRoles,
  };

  const adapterTargetInvalidRoles: RolesGroup = {
    title: mockTitle,
    roles: [],
  };

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('adaptFromRoleDescriptions', () => {
    it('should convert valid role descriptions to a roles group', () => {
      expect(
        service.adaptFromRoleDescriptions(mockTitle, adapterSourceValid)
      ).toEqual(adapterTargetValid);
    });

    it('should handle invalid role descriptions', () => {
      expect(service.adaptFromRoleDescriptions('', undefined)).toEqual(
        adapterTargetInvalid
      );

      expect(service.adaptFromRoleDescriptions('', adapterSourceValid)).toEqual(
        adapterTargetInvalidTitle
      );

      expect(service.adaptFromRoleDescriptions(mockTitle, undefined)).toEqual(
        adapterTargetInvalidRoles
      );
    });
  });
});
