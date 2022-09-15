import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { MockProvider } from 'ng-mocks';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
  SAP_PRICE_DETAIL_ZMIN_MOCK,
} from '../../../../testing/mocks';
import { CalculationType } from '../../../core/store/reducers/sap-price-details/models/calculation-type.enum';
import { LOCALE_DE, LOCALE_EN } from '../../constants';
import { UserRoles } from '../../constants/user-roles.enum';
import { Keyboard } from '../../models';
import {
  LastCustomerPriceCondition,
  PriceSource,
} from '../../models/quotation-detail';
import { ValidationDescription } from '../../models/table';
import { GqQuotationPipe } from '../../pipes/gq-quotation/gq-quotation.pipe';
import { HelperService } from '../../services/helper-service/helper-service.service';
import { ColumnFields } from '../constants/column-fields.enum';
import { ColumnUtilityService } from './column-utility.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CreateColumnService', () => {
  let service: ColumnUtilityService;
  let spectator: SpectatorService<ColumnUtilityService>;
  let roles: string[];

  const createService = createServiceFactory({
    service: ColumnUtilityService,
    providers: [
      {
        provide: HelperService,
        useValue: {
          transformPercentage: jest
            .fn()
            .mockImplementation((value) => `${value} %`),
          transformNumberCurrency: jest.fn().mockImplementation(
            (value, currency) =>
              `${Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
              }).format(value)} ${currency}`
          ),
          transformNumber: jest
            .fn()
            .mockImplementation((value) =>
              Intl.NumberFormat('en-US').format(value)
            ),
          transformDate: jest
            .fn()
            .mockImplementation((value) =>
              Intl.DateTimeFormat('en-US').format(new Date(value))
            ),
        },
      },
      MockProvider(TranslocoLocaleService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  beforeAll(() => {
    roles = [UserRoles.BASIC];
  });

  describe('numberFilterParams', () => {
    test('should return undefined on undefined input', () => {
      expect(service.numberFilterParams.numberParser(undefined as any)).toEqual(
        undefined
      );
    });
    test('should return undefined on no input', () => {
      expect(service.numberFilterParams.numberParser('')).toEqual(undefined);
    });
    test('should parse localized number', () => {
      service['translocoLocaleService'].getLocale = jest.fn(() => LOCALE_DE.id);

      const result = service.numberFilterParams.numberParser('34,12');

      expect(result).toEqual(34.12);
    });
    test('should parse on invalid input', () => {
      service['translocoLocaleService'].getLocale = jest.fn(() => LOCALE_DE.id);

      const result = service.numberFilterParams.numberParser('34,');

      expect(result).toEqual(34);
    });
    test('should support german input on english locale', () => {
      service['translocoLocaleService'].getLocale = jest.fn(() => LOCALE_EN.id);

      const result = service.numberFilterParams.numberParser('34,19');

      expect(result).toEqual(34.19);
    });
  });

  describe('filterGpc', () => {
    test('should return false for GPC', () => {
      const col = { field: ColumnFields.GPC };
      const isNotFiltered = ColumnUtilityService.filterGpc(col, roles);
      expect(isNotFiltered).toBeFalsy();
    });
    test('should return false for GPI', () => {
      const col = { field: ColumnFields.GPI };
      const isNotFiltered = ColumnUtilityService.filterGpc(col, roles);
      expect(isNotFiltered).toBeFalsy();
    });
    test('should return false for LAST CUSTOMER PRICE GPI', () => {
      const col = { field: ColumnFields.LAST_CUSTOMER_PRICE_GPI };
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
    test('should return false for gpm', () => {
      const col = { field: ColumnFields.GPM };
      const isNotFiltered = ColumnUtilityService.filterSqv(col, roles);
      expect(isNotFiltered).toBeFalsy();
    });
    test('should return false for relocation cost', () => {
      const col = { field: ColumnFields.RELOCATION_COST };
      const isNotFiltered = ColumnUtilityService.filterSqv(col, roles);
      expect(isNotFiltered).toBeFalsy();
    });
    test('should return false for rlm', () => {
      const col = { field: ColumnFields.RLM };
      const isNotFiltered = ColumnUtilityService.filterSqv(col, roles);
      expect(isNotFiltered).toBeFalsy();
    });
    test('should return false for last customer price gpm', () => {
      const col = { field: ColumnFields.LAST_CUSTOMER_PRICE_GPM };
      const isNotFiltered = ColumnUtilityService.filterSqv(col, roles);
      expect(isNotFiltered).toBeFalsy();
    });
    describe('include sqv roles', () => {
      beforeAll(() => {
        roles.push(UserRoles.COST_SQV);
      });
      test('should return true', () => {
        const col = { field: ColumnFields.SQV };
        const isNotFiltered = ColumnUtilityService.filterSqv(col, roles);
        expect(isNotFiltered).toBeTruthy();
      });
      test('should return true on gpm', () => {
        const col = { field: ColumnFields.GPM };
        const isNotFiltered = ColumnUtilityService.filterSqv(col, roles);
        expect(isNotFiltered).toBeTruthy();
      });
    });
  });
  describe('filterChinaSpecificColumns', () => {
    test('should return false on missing role', () => {
      const userRoles = [
        UserRoles.BASIC,
        UserRoles.COST_GPC,
        UserRoles.COST_SQV,
        UserRoles.SECTOR_ALL,
      ];
      const col = { field: ColumnFields.STRATEGIC_MATERIAL };
      const res = ColumnUtilityService.filterChinaSpecificColumns(
        col,
        userRoles
      );

      expect(res).toBeFalsy();
    });
    test('should return true on REGION.GREATER.CHINA', () => {
      const userRoles = [UserRoles.REGION_GREATER_CHINA];
      const col = { field: ColumnFields.STRATEGIC_MATERIAL };
      const res = ColumnUtilityService.filterChinaSpecificColumns(
        col,
        userRoles
      );

      expect(res).toBeTruthy();
    });
    test('should return true on REGION.WORLD', () => {
      const userRoles = [UserRoles.REGION_WORLD];
      const col = { field: ColumnFields.STRATEGIC_MATERIAL };
      const res = ColumnUtilityService.filterChinaSpecificColumns(
        col,
        userRoles
      );

      expect(res).toBeTruthy();
    });
  });

  describe('createColumnDefs', () => {
    test('should return all cols', () => {
      ColumnUtilityService.filterGpc = jest.fn().mockReturnValue(true);
      ColumnUtilityService.filterSqv = jest.fn().mockReturnValue(true);
      ColumnUtilityService.filterChinaSpecificColumns = jest
        .fn()
        .mockReturnValue(true);

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
      const result = service.numberFormatter(
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
      const result = service.numberDashFormatter(
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
      const result = service.numberCurrencyFormatter(
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

      const result = service.sapConditionAmountFormatter(
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

      const result = service.sapConditionAmountFormatter(
        params as ValueFormatterParams
      );

      expect(result).toEqual(`10 %`);
    });
  });

  describe('percentageFormatter', () => {
    test('should add %', () => {
      const result = service.percentageFormatter({
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
      const res = service.dateFormatter(data.value);

      const expected = '11/24/2020';
      expect(res).toEqual(expected);
    });
    test('should render Date for empty data', () => {
      const data = {
        value: undefined as any,
      };
      const res = service.dateFormatter(data.value);
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

  describe('transformConditionUnit', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("should translate 'ST' units", () => {
      ColumnUtilityService.transformConditionUnit({
        value: 'ST',
      } as ValueFormatterParams);

      expect(translate).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenCalledWith('shared.quotationDetailsTable.ST');
    });

    test('should NOT translate other units', () => {
      ColumnUtilityService.transformConditionUnit({
        value: 'kg',
      } as ValueFormatterParams);

      expect(translate).not.toHaveBeenCalled();
    });
  });
});
