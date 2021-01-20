import { UserRoles } from '../../roles/user-roles.enum';
import { COLUMN_DEFS } from './column-defs';
import { ColumnFields } from './column-fields.enum';
import { ColumnUtilityService } from './column-utility.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CreateColumnService', () => {
  let roles: string[];
  beforeAll(() => {
    roles = [UserRoles.BASIC_ROLE];
  });

  describe('filterGpc', () => {
    test('should return false', () => {
      const col = { field: ColumnFields.GPC };
      const isNotFiltered = ColumnUtilityService.filterGpc(col, roles);
      expect(isNotFiltered).toBeFalsy();
    });
    test('should return true', () => {
      const col = { field: ColumnFields.GPI };
      roles.push(UserRoles.COST_GPC_ROLE);
      const isNotFiltered = ColumnUtilityService.filterGpc(col, roles);
      expect(isNotFiltered).toBeTruthy();
    });
    test('should return true', () => {
      const col = { field: ColumnFields.ADDED_TO_OFFER };
      const isNotFiltered = ColumnUtilityService.filterGpc(col, roles);
      expect(isNotFiltered).toBeTruthy();
    });
  });
  describe('filterSQV', () => {
    test('should return false', () => {
      const col = { field: ColumnFields.SQV };
      const isNotFiltered = ColumnUtilityService.filterSqv(col, roles);
      expect(isNotFiltered).toBeFalsy();
    });
    test('should return true', () => {
      const col = { field: ColumnFields.SQV };
      roles.push(UserRoles.COST_SQV_ROLE);
      const isNotFiltered = ColumnUtilityService.filterSqv(col, roles);
      expect(isNotFiltered).toBeTruthy();
    });
    test('should return true', () => {
      const col = { field: ColumnFields.ADDED_TO_OFFER };
      const isNotFiltered = ColumnUtilityService.filterSqv(col, roles);
      expect(isNotFiltered).toBeTruthy();
    });
  });
  describe('filterAddedToOffer', () => {
    test('should return true', () => {
      const col = { field: ColumnFields.ADDED_TO_OFFER };
      const isNotFiltered = ColumnUtilityService.filterAddedToOffer(col, false);
      expect(isNotFiltered).toBeFalsy();
    });
    test('should return true', () => {
      const col = { field: ColumnFields.GPI };
      const isNotFiltered = ColumnUtilityService.filterAddedToOffer(col, false);
      expect(isNotFiltered).toBeTruthy();
    });
  });
  describe('createColumnDefs', () => {
    test('should return all cols', () => {
      ColumnUtilityService.filterGpc = jest.fn().mockReturnValue(true);
      ColumnUtilityService.filterSqv = jest.fn().mockReturnValue(true);
      ColumnUtilityService.filterAddedToOffer = jest.fn().mockReturnValue(true);
      const allRoles = [
        UserRoles.BASIC_ROLE,
        UserRoles.COST_GPC_ROLE,
        UserRoles.COST_SQV_ROLE,
      ];

      const columns = ColumnUtilityService.createColumnDefs(allRoles, true);

      expect(columns).toEqual(COLUMN_DEFS);
    });
  });
});
