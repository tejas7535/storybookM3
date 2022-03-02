import { ColDef } from '@ag-grid-enterprise/all-modules';

import { ColumnUtilityService } from '../../../../shared/ag-grid/services/column-utility.service';
import { UserRoles } from '../../../../shared/roles/user-roles.enum';
import {
  filterRoles,
  getAllRoles,
  getColumnDefsForRoles,
  userHasGPCRole,
  userHasManualPriceRole,
  userHasSQVRole,
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
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(getAllRoles.projector(undefined)).toEqual([]);
    });
  });
  describe('getColumnDefsForRoles', () => {
    test('should call ColumnUtilityService with roles', () => {
      ColumnUtilityService.createColumnDefs = jest.fn(() => []);
      const roles = [UserRoles.BASIC, UserRoles.REGION_WORLD];
      const colDef: ColDef[] = [];
      expect(getColumnDefsForRoles(colDef).projector(roles)).toEqual([]);
      expect(ColumnUtilityService.createColumnDefs).toHaveBeenCalledTimes(1);
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
  describe('userHasSQVRole', () => {
    test('should return true', () => {
      const roles = [UserRoles.BASIC, UserRoles.COST_SQV];

      expect(userHasSQVRole.projector(roles)).toBeTruthy();
    });
    test('should return false', () => {
      const roles = [UserRoles.BASIC, UserRoles.REGION_WORLD];

      expect(userHasSQVRole.projector(roles)).toBeFalsy();
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
