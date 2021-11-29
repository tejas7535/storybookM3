import { ValueFormatterParams } from '@ag-grid-community/all-modules';
import { TranslocoModule } from '@ngneat/transloco';

import {
  QUOTATION_MOCK,
  SAP_PRICE_DETAIL_MOCK,
} from '../../../../testing/mocks';
import { CalculationType } from '../../../core/store/reducers/sap-price-details/models/calculation-type.enum';
import { Keyboard } from '../../models';
import { ValidationDescription } from '../../models/table';
import { GqQuotationPipe } from '../../pipes/gq-quotation/gq-quotation.pipe';
import { UserRoles } from '../../roles/user-roles.enum';
import { ColumnFields } from './column-fields.enum';
import { ColumnUtilityService } from './column-utility.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CreateColumnService', () => {
  let roles: string[];
  beforeAll(() => {
    roles = [UserRoles.BASIC];
  });

  describe('dateComparator', () => {
    let cellDate: string;
    beforeEach(() => {
      cellDate = '2020-12-02T08:09:03.9619909';
    });
    test('should return 0', () => {
      const compareDate = new Date('2020-12-02T00:00:00');

      const res = ColumnUtilityService.dateFilterParams.comparator(
        compareDate,
        cellDate
      );
      expect(res).toBe(0);
    });
    test('should return 1', () => {
      const compareDate = new Date('2020-12-01T00:00:00');

      const res = ColumnUtilityService.dateFilterParams.comparator(
        compareDate,
        cellDate
      );
      expect(res).toBe(1);
    });
    test('should return -1', () => {
      const compareDate = new Date('2020-12-03T00:00:00');

      const res = ColumnUtilityService.dateFilterParams.comparator(
        compareDate,
        cellDate
      );
      expect(res).toBe(-1);
    });
  });
  describe('filterGpc', () => {
    test('should return false', () => {
      const col = { field: ColumnFields.GPC };
      const isNotFiltered = ColumnUtilityService.filterGpc(col, roles);
      expect(isNotFiltered).toBeFalsy();
    });
    test('should return true', () => {
      const col = { field: ColumnFields.GPI };
      roles.push(UserRoles.COST_GPC);
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
      roles.push(UserRoles.COST_SQV);
      const isNotFiltered = ColumnUtilityService.filterSqv(col, roles);
      expect(isNotFiltered).toBeTruthy();
    });
    test('should return true on gpm', () => {
      const col = { field: ColumnFields.GPM };
      const isNotFiltered = ColumnUtilityService.filterSqv(col, roles);
      expect(isNotFiltered).toBeTruthy();
    });
  });

  describe('createColumnDefs', () => {
    test('should return all cols', () => {
      ColumnUtilityService.filterGpc = jest.fn().mockReturnValue(true);
      ColumnUtilityService.filterSqv = jest.fn().mockReturnValue(true);
      const allRoles = [
        UserRoles.BASIC,
        UserRoles.COST_GPC,
        UserRoles.COST_SQV,
      ];
      const ColumnDefs = [
        { field: ColumnFields.GPC },
        { field: ColumnFields.SQV },
        { field: ColumnFields.GPI },
        { field: ColumnFields.GPM },
      ];

      const columns = ColumnUtilityService.createColumnDefs(
        allRoles,
        ColumnDefs
      );

      expect(columns).toEqual(ColumnDefs);
    });
  });

  describe('numberFormatter', () => {
    test('should render number', () => {
      const params = {
        value: 1234,
      };
      const result = ColumnUtilityService.numberFormatter(
        params as unknown as ValueFormatterParams
      );

      expect(result).toEqual('1,234');
    });
  });

  describe('numberCurrencyFormatter', () => {
    test('should render number', () => {
      const params = {
        value: 1234,
        column: {
          colId: 'test',
        },
        context: {
          quotation: { customer: { currency: 'testcurrency' } },
        },
      };
      const result = ColumnUtilityService.numberCurrencyFormatter(
        params as unknown as ValueFormatterParams
      );

      expect(result).toEqual('1,234.00 testcurrency');
    });
  });

  describe('sapConditionAmountFormatter', () => {
    test('should return absolute transformation', () => {
      const params = {
        value: '10',
        data: SAP_PRICE_DETAIL_MOCK,
        context: { quotation: QUOTATION_MOCK },
      };

      const result = ColumnUtilityService.sapConditionAmountFormatter(
        params as ValueFormatterParams
      );

      expect(result).toEqual(`10.00 ${QUOTATION_MOCK.currency}`);
    });
    test('should return percentage transformation', () => {
      const params = {
        value: '10',
        data: {
          ...SAP_PRICE_DETAIL_MOCK,
          calculationType: CalculationType.PERCENTAGE,
        },
      };

      const result = ColumnUtilityService.sapConditionAmountFormatter(
        params as ValueFormatterParams
      );

      expect(result).toEqual(`10 %`);
    });
  });

  describe('percentageFormatter', () => {
    test('should add %', () => {
      const result = ColumnUtilityService.percentageFormatter({
        value: 10,
      } as unknown as ValueFormatterParams);

      expect(result).toEqual('10 %');
    });
  });

  describe('infoComparator', () => {
    let cell1: any;
    let cell2: any;
    beforeAll(() => {
      cell1 = {
        valid: true,
        description: [ValidationDescription.Valid],
      };
      cell2 = {
        valid: false,
        description: [ValidationDescription.MaterialNumberInValid],
      };
    });

    test('should sort info column', () => {
      const res = ColumnUtilityService.infoComparator(cell1, cell2);
      expect(res).toEqual(1);
    });
    test('should sort info column and return 0', () => {
      cell2.valid = true;
      const res = ColumnUtilityService.infoComparator(cell1, cell2);
      expect(res).toEqual(0);
    });
    test('should sort info column and return -1', () => {
      cell1.valid = false;
      cell2.valid = true;
      const res = ColumnUtilityService.infoComparator(cell1, cell2);
      expect(res).toEqual(-1);
    });
  });
  describe('transformMaterial', () => {
    test('should call pipe transform', () => {
      const data = { value: 'any' } as any as ValueFormatterParams;
      const result = ColumnUtilityService.transformMaterial(data);
      expect(result).toEqual(data.value);
    });
  });
  describe('dateFormatter', () => {
    test('should render Date', () => {
      const data = {
        value: '2020-11-24T07:46:32.446388',
      };
      const res = ColumnUtilityService.dateFormatter(data);

      const expected = new Date(data.value).toLocaleDateString();
      expect(res).toEqual(expected);
    });
    test('should render Date for empty data', () => {
      const data = {};
      const res = ColumnUtilityService.dateFormatter(data);
      expect(res).toEqual(Keyboard.DASH);
    });
  });

  describe('idFormatter', () => {
    test('should call pipe', () => {
      GqQuotationPipe.prototype.transform = jest.fn();
      ColumnUtilityService.idFormatter('11');
      expect(GqQuotationPipe.prototype.transform).toHaveBeenCalledTimes(1);
    });
  });
});
