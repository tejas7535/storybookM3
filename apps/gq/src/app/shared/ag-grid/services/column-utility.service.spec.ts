import {
  ValueFormatterParams,
  ValueGetterParams,
} from '@ag-grid-community/all-modules';
import { translate, TranslocoModule } from '@ngneat/transloco';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
  SAP_PRICE_DETAIL_ZMIN_MOCK,
} from '../../../../testing/mocks';
import { CalculationType } from '../../../core/store/reducers/sap-price-details/models/calculation-type.enum';
import { UserRoles } from '../../constants/user-roles.enum';
import { Keyboard } from '../../models';
import {
  LastCustomerPriceCondition,
  PriceSource,
} from '../../models/quotation-detail';
import { ValidationDescription } from '../../models/table';
import { GqQuotationPipe } from '../../pipes/gq-quotation/gq-quotation.pipe';
import { ColumnFields } from '../constants/column-fields.enum';
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
  describe('numberDashFormatter', () => {
    test('should render number', () => {
      const params = {
        value: undefined as any,
      };
      const result = ColumnUtilityService.numberDashFormatter(
        params as unknown as ValueFormatterParams
      );

      expect(result).toEqual('-');
    });
  });

  describe('numberCurrencyFormatter', () => {
    test('should render number with quotationCurrency', () => {
      const params = {
        value: 1234,
        column: {
          colId: 'test',
        },
        context: {
          quotation: { currency: 'testcurrency' },
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
        data: SAP_PRICE_DETAIL_ZMIN_MOCK,
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
          ...SAP_PRICE_DETAIL_ZMIN_MOCK,
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
  describe('materialTransform', () => {
    test('should call pipe transform', () => {
      const data = { value: 'any' } as any as ValueFormatterParams;
      const result = ColumnUtilityService.materialTransform(data);
      expect(result).toEqual(data.value);
    });
  });
  describe('materialGetter', () => {
    test('should call pipe transform', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
      } as any as ValueGetterParams;
      const result = ColumnUtilityService.materialGetter(params);
      expect(result).toEqual(QUOTATION_DETAIL_MOCK.material.materialNumber15);
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

  describe('transformPriceSource', () => {
    test('should return transformation for price source sap special', () => {
      const result = ColumnUtilityService.transformPriceSource({
        value: PriceSource.SAP_SPECIAL,
      } as ValueFormatterParams);
      expect(result).toEqual('SAP_ZP05-ZP17');
    });
    test('should return untransformed price source', () => {
      const result = ColumnUtilityService.transformPriceSource({
        value: PriceSource.GQ,
      } as ValueFormatterParams);
      expect(result).toEqual(PriceSource.GQ);
    });
  });

  describe('transformLastCustomerPriceCondition', () => {
    test('should return value if value is not in enum', () => {
      const res = ColumnUtilityService.transformLastCustomerPriceCondition({
        value: 'SI',
      } as any);

      expect(translate).toHaveBeenCalledTimes(0);
      expect(res).toEqual('SI');
    });
    test('should return dash if value is missing', () => {
      const res = ColumnUtilityService.transformLastCustomerPriceCondition({
        value: undefined,
      } as any);

      expect(translate).toHaveBeenCalledTimes(0);
      expect(res).toEqual(Keyboard.DASH);
    });
    test('should return translation if value is in enum', () => {
      const res = ColumnUtilityService.transformLastCustomerPriceCondition({
        value: LastCustomerPriceCondition.CA,
      } as any);

      expect(translate).toHaveBeenCalledTimes(1);
      expect(res).toEqual('translate it');
    });
  });

  describe('transformMaterialClassificationSOP', () => {
    test('should call materialClassificationSOP pipe', () => {
      ColumnUtilityService.materialClassificationSOPPipe.transform = jest.fn();

      ColumnUtilityService.transformMaterialClassificationSOP({
        data: {
          value: '1',
        },
      } as any);

      expect(
        ColumnUtilityService.materialClassificationSOPPipe.transform
      ).toHaveBeenCalledTimes(1);
    });
  });
});
