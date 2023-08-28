import { Clipboard } from '@angular/cdk/clipboard';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';
import {
  CalculationType,
  SalesIndication,
} from '@gq/core/store/reducers/models';
import { ProcessCaseRoutePath } from '@gq/process-case-view/process-case-route-path.enum';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import {
  ColDef,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  MenuItemDef,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-community';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
  SAP_PRICE_DETAIL_ZMIN_MOCK,
} from '../../../../testing/mocks';
import { LOCALE_DE, LOCALE_EN } from '../../constants';
import { UserRoles } from '../../constants/user-roles.enum';
import { Keyboard, Quotation, QuotationStatus } from '../../models';
import {
  LastCustomerPriceCondition,
  PriceSource,
  SAP_ERROR_MESSAGE_CODE,
} from '../../models/quotation-detail';
import { ValidationDescription } from '../../models/table';
import { GqQuotationPipe } from '../../pipes/gq-quotation/gq-quotation.pipe';
import {
  CaseTableColumnFields,
  ColumnFields,
} from '../constants/column-fields.enum';
import {
  ColumnUtilityService,
  getValueOfFocusedCell,
  openInNew,
} from './column-utility.service';

describe('CreateColumnService', () => {
  let service: ColumnUtilityService;
  let spectator: SpectatorService<ColumnUtilityService>;
  let roles: string[];

  const createService = createServiceFactory({
    service: ColumnUtilityService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      MockProvider(TransformationService, {
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
      }),

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

  describe('filterSAPColumns', () => {
    const colDefs: ColDef[] = [
      { field: ColumnFields.MATERIAL_NUMBER_15 },
      { field: ColumnFields.SAP_STATUS },
      { field: ColumnFields.STRATEGIC_MATERIAL },
    ];

    test('should remove SAP_STATUS Column if sapId is NOT set', () => {
      const quotation = { ...QUOTATION_MOCK, sapId: undefined } as Quotation;
      const res = ColumnUtilityService.filterSAPColumns(colDefs, quotation);

      expect(res).toEqual([
        { field: ColumnFields.MATERIAL_NUMBER_15 },
        { field: ColumnFields.STRATEGIC_MATERIAL },
      ]);
    });

    test('should keep SAP_STATUS Column if sapId is set', () => {
      const quotation = QUOTATION_MOCK;
      const res = ColumnUtilityService.filterSAPColumns(colDefs, quotation);

      expect(res).toEqual(colDefs);
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

  describe('targetPriceFormatter', () => {
    test('should render number when currency is present within data', () => {
      const params = {
        value: 1234,
        column: {
          colId: 'test',
        },
        data: {
          currency: 'testcurrency',
        },
      };
      const result = service.targetPriceFormatter(
        params as unknown as ValueFormatterParams
      );

      expect(result).toEqual('1,234.00 testcurrency');
    });

    test('should transform number as Currency WITHOUT currency', () => {
      const params = {
        value: 1234.23,
        column: {
          colId: 'test',
        },
      };
      const result = service.targetPriceFormatter(
        params as unknown as ValueFormatterParams
      );

      expect(result).toEqual('1,234.23');
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
      const result = service.materialTransform(data);
      expect(result).toEqual(data.value);
    });
  });
  describe('materialGetter', () => {
    test('should call pipe transform', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
      } as any as ValueGetterParams;
      const result = service.materialGetter(params);
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

  describe('buildMaterialInfoTooltipText', () => {
    test('should set the tooltip text to errorCode', () => {
      const result = service.buildMaterialInfoTooltipText(
        [ValidationDescription.Not_Validated],
        [SAP_ERROR_MESSAGE_CODE.SDG1000]
      );

      expect(result).toMatch('translate it');
      expect(translate).toHaveBeenCalledWith(
        'shared.sapStatusLabels.errorCodes.SDG1000'
      );
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

  describe('getResetAllFilteredColumnsMenuItem', () => {
    let params: GetMainMenuItemsParams;
    beforeEach(() => {
      params = {
        api: {
          setFilterModel: jest.fn(),
        },
        defaultItems: ['item1', 'item2'],
      } as unknown as GetMainMenuItemsParams;
    });
    test('Should return the menuItem', () => {
      const expected: MenuItemDef | string = {
        name: 'translate it',
        action: () => params.api.setFilterModel(undefined as any),
      };
      const result =
        ColumnUtilityService.getResetAllFilteredColumnsMenuItem(params);

      expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });
  });

  describe('getCopyCellContentContextMenuItem', () => {
    let params: GetContextMenuItemsParams;
    beforeEach(() => {
      params = {
        api: {
          getFocusedCell: jest.fn(),
          getDisplayedRowAtIndex: jest.fn(),
          getValue: jest.fn(),
        },
        column: {
          getColDef: jest.fn(),
        },
      } as unknown as GetContextMenuItemsParams;
    });

    test('Should return the contextMenuItem properly', () => {
      const expected: MenuItemDef | string = {
        name: 'translate it',
        icon: '<span class="ag-icon ag-icon-copy"></span>',
        action: () => {},
      };

      const result =
        ColumnUtilityService.getCopyCellContentContextMenuItem(params);
      expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });
  });

  describe('transformConditionUnit', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("should translate 'ST' units", () => {
      service.transformConditionUnit({
        value: 'ST',
      } as ValueFormatterParams);

      expect(translate).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenCalledWith('shared.quotationDetailsTable.ST');
    });

    test('should NOT translate other units', () => {
      service.transformConditionUnit({
        value: 'kg',
      } as ValueFormatterParams);

      expect(translate).not.toHaveBeenCalled();
    });
  });

  describe('getValueOfFocusedCell', () => {
    let params: GetContextMenuItemsParams;
    const clipboardSpy = jest.spyOn(Clipboard.prototype as any, 'copy');
    clipboardSpy.mockImplementationOnce(() => {});

    beforeEach(() => {
      params = {
        api: {
          getFocusedCell: jest.fn(() => ({ rowIndex: jest.fn() })),
          getDisplayedRowAtIndex: jest.fn(),
          getValue: jest.fn(),
        },
        column: {
          getColDef: jest.fn(() => ({
            valueFormatter: jest.fn(() => 'formattedValue'),
          })),
        },
        node: {
          data: jest.fn(),
        },
      } as unknown as GetContextMenuItemsParams;
    });
    test('should return Value ofValueFormatter', () => {
      getValueOfFocusedCell(params);
      expect(clipboardSpy).toHaveBeenCalledWith('formattedValue');
    });

    test('should return Value, no Formatter', () => {
      params = {
        ...params,
        api: {
          getFocusedCell: jest.fn(() => ({ rowIndex: jest.fn() })),
          getDisplayedRowAtIndex: jest.fn(),
          getValue: jest.fn(() => 'Value'),
        },
        column: {
          getColDef: jest.fn(() => ({})),
        },
      } as unknown as GetContextMenuItemsParams;
      getValueOfFocusedCell(params);
      expect(clipboardSpy).toHaveBeenCalledWith('Value');
    });
  });

  describe('openInNew', () => {
    let params: GetContextMenuItemsParams;

    Object.assign(window, {
      open: jest.fn().mockImplementation(() => Promise.resolve()),
      location: {
        origin: jest.fn(() => 'localhost'),
      },
    });
    afterEach(() => jest.clearAllMocks());
    describe('cellRenderer has url property', () => {
      beforeEach(() => {
        params = {
          node: jest.fn(),
          column: {
            getColId: jest.fn(),
          },
          api: {
            getCellRendererInstances: jest.fn(() => [{ url: '/anyUrl' }]), // do not return empty
          },
        } as unknown as GetContextMenuItemsParams;
      });

      test('should call window.open method with tab', () => {
        openInNew(params, 'tab');
        expect(window.open).toHaveBeenCalledWith('http://localhost/anyUrl');
      });

      test('should call window.open method with window', () => {
        openInNew(params, 'window');
        expect(window.open).toHaveBeenCalledWith(
          'http://localhost/anyUrl',
          '_blank',
          'location=no,toolbar=yes'
        );
      });
    });
    describe('cellRenderer does not have url property', () => {
      beforeEach(() => {
        params = {
          node: jest.fn(),
          column: {
            getColId: jest.fn(),
          },
          api: {
            getCellRendererInstances: jest.fn(() => [
              { anyProperty: 'anyString' },
            ]),
          },
        } as unknown as GetContextMenuItemsParams;
      });

      test('should call NOT window.open method with tab', () => {
        openInNew(params, 'tab');
        expect(window.open).not.toHaveBeenCalled();
      });
      test('should call NOT window.open method with window', () => {
        openInNew(params, 'window');
        expect(window.open).not.toHaveBeenCalled();
      });
    });
  });

  describe('salesIndicationValueGetter', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('should translate invoice', () => {
      service.salesIndicationValueGetter({
        data: { salesIndication: SalesIndication.INVOICE },
      } as ValueGetterParams);

      expect(translate).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenCalledWith(
        'transactionView.transactions.table.salesIndicationValue.invoice'
      );
    });

    test('should translate order', () => {
      service.salesIndicationValueGetter({
        data: { salesIndication: SalesIndication.ORDER },
      } as ValueGetterParams);

      expect(translate).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenCalledWith(
        'transactionView.transactions.table.salesIndicationValue.order'
      );
    });

    test('should translate lostQuote', () => {
      service.salesIndicationValueGetter({
        data: { salesIndication: SalesIndication.LOST_QUOTE },
      } as ValueGetterParams);

      expect(translate).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenCalledWith(
        'transactionView.transactions.table.salesIndicationValue.lostQuote'
      );
    });

    test('should NOT translate unknown sales indication', () => {
      const value = 'test sales indication';
      const result = service.salesIndicationValueGetter({
        data: { salesIndication: value },
      } as ValueGetterParams);

      expect(translate).not.toHaveBeenCalled();
      expect(result).toBe(value);
    });
  });

  describe('filterQuotationStatusColumns', () => {
    test('should return true if column field is not status', () => {
      expect(
        service.filterQuotationStatusColumns(
          { field: CaseTableColumnFields.CASE_NAME } as ColDef,
          QuotationTab.ACTIVE
        )
      ).toBe(true);
    });

    test('should return false if column field is status and tab is non-approval', () => {
      expect(
        service.filterQuotationStatusColumns(
          { field: CaseTableColumnFields.STATUS } as ColDef,
          QuotationTab.ACTIVE
        )
      ).toBe(false);
    });
  });

  describe('determineCaseNavigationPath', () => {
    test('should return ProcessCaseViewPath if status is non-approval', () => {
      expect(
        service.determineCaseNavigationPath(QuotationStatus.ACTIVE, true)
      ).toEqual([AppRoutePath.ProcessCaseViewPath]);
    });

    test('should return ProcessCaseViewPath and OverviewPath if status is approval', () => {
      expect(
        service.determineCaseNavigationPath(QuotationStatus.APPROVED, true)
      ).toEqual([
        AppRoutePath.ProcessCaseViewPath,
        ProcessCaseRoutePath.OverviewPath,
      ]);
    });
    test('should return ProcessCaseViewPath if status is approval and not enabledForApprovalWorkflow', () => {
      expect(
        service.determineCaseNavigationPath(QuotationStatus.APPROVED, false)
      ).toEqual([AppRoutePath.ProcessCaseViewPath]);
    });
  });
});
