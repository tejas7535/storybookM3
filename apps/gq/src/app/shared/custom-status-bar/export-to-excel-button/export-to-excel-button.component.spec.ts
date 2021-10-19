import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import {
  IStatusPanelParams,
  ProcessHeaderForExportParams,
} from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CUSTOMER_MOCK,
  EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK } from '../../../../testing/mocks/models/extended-comparable-linked-transaction.mock';
import { ExportExcel } from '../../export-excel-modal/export-excel.enum';
import {
  ColumnFields,
  PriceColumns,
} from '../../services/column-utility-service/column-fields.enum';
import { HelperService } from '../../services/helper-service/helper-service.service';
import { PriceService } from '../../services/price-service/price.service';
import { excelStyleObjects } from './excel-styles.constants';
import { ExportToExcelButtonComponent } from './export-to-excel-button.component';

describe('ExportToExcelButtonComponent', () => {
  let component: ExportToExcelButtonComponent;
  let spectator: Spectator<ExportToExcelButtonComponent>;
  let mockParams: IStatusPanelParams;
  let snackBar: MatSnackBar;

  const createComponent = createComponentFactory({
    component: ExportToExcelButtonComponent,
    declarations: [ExportToExcelButtonComponent],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          extendedComparableLinkedTransactions:
            EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        },
      }),
    ],
    imports: [
      MatButtonModule,
      MatIconModule,
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
      ReactiveComponentModule,
      MatSnackBarModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    const mockIds = [{ getColId: () => '0' }, { getColId: () => '1' }];
    mockParams = {
      api: {
        getSheetDataForExcel: jest.fn(() => '2'),
        exportMultipleSheetsAsExcel: jest.fn(),
      },
      columnApi: {
        getAllColumns: jest.fn(() => mockIds),
      },
      context: {
        quotation: QUOTATION_MOCK,
      },
    } as unknown as IStatusPanelParams;
    snackBar = spectator.inject(MatSnackBar);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params', () => {
      component['params'] = undefined;

      component.agInit(mockParams);

      expect(component['params']).toEqual(mockParams);
    });
  });
  describe('exportToExcel', () => {
    test('should export to Excel', () => {
      component['params'] = mockParams;
      component.getSummarySheet = jest.fn(() => '1');
      const today = new Date();
      const date = `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`;
      const time = `${today.getHours()}-${today.getMinutes()}`;

      component.exportToExcel(ExportExcel.BASIC_DOWNLOAD);

      expect(mockParams.api.exportMultipleSheetsAsExcel).toHaveBeenCalledWith({
        data: ['1', '2'],
        fileName: `GQ_Case_${QUOTATION_MOCK.gqId}_${date}_${time}`,
      });
      expect(mockParams.api.getSheetDataForExcel).toHaveBeenCalledTimes(1);
      expect(component.getSummarySheet).toHaveBeenCalledTimes(1);
    });
  });

  describe('openExportToExcelDialog should', () => {
    beforeEach(() => {
      component['matDialog'].open = jest
        .fn()
        // eslint-disable-next-line unicorn/no-useless-undefined
        .mockReturnValue({ afterClosed: () => of(undefined) });
      component.exportToExcel = jest.fn();
      component.shouldLoadTransactions = jest.fn();
    });
    test('open modal for choosing exporting excel option', () => {
      component.openExportToExcelDialog();

      expect(component['matDialog'].open).toHaveBeenCalledTimes(1);
    });

    test('export to excel after dialog is closed', () => {
      const exportExcel = ExportExcel.BASIC_DOWNLOAD;
      component['matDialog'].open = jest
        .fn()
        .mockReturnValue({ afterClosed: () => of(exportExcel) });

      component.openExportToExcelDialog();

      expect(component.shouldLoadTransactions).toHaveBeenCalledWith(
        exportExcel
      );
    });
  });

  describe('shouldLoadTransactions', () => {
    beforeEach(() => {
      component.exportToExcel = jest.fn();
      snackBar.open = jest.fn();
    });

    test('does not export to excel after dialog is canceled (exportExcel is not defined)', () => {
      component.shouldLoadTransactions(undefined as any);

      expect(component.exportToExcel).not.toHaveBeenCalled();
    });

    test('does not dispatch, if exportExcel is basic download', () => {
      component.shouldLoadTransactions(ExportExcel.BASIC_DOWNLOAD);

      expect(component.exportToExcel).toHaveBeenCalledWith(
        ExportExcel.BASIC_DOWNLOAD
      );
    });

    test('calls dispatch and exportToExcel, if exportExcel is detailed download', () => {
      component['params'] = mockParams;
      component.transactions$ = of([
        EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
      ]);

      component.shouldLoadTransactions(ExportExcel.DETAILED_DOWNLOAD);

      expect(component.transactions[0]).toEqual(
        EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK
      );
      expect(snackBar.open).not.toHaveBeenCalled();
      expect(component.exportToExcel).toHaveBeenCalledWith(
        ExportExcel.DETAILED_DOWNLOAD
      );
    });

    test('calls dispatch and exportToExcel with BASIC_DOWNLOAD option, if no comparable transactions are available', () => {
      component['params'] = mockParams;
      component.transactions$ = of([]);

      component.shouldLoadTransactions(ExportExcel.DETAILED_DOWNLOAD);

      expect(component.transactions).toEqual(undefined);
      expect(snackBar.open).toHaveBeenCalledWith('translate it');
      expect(component.exportToExcel).toHaveBeenCalledWith(
        ExportExcel.BASIC_DOWNLOAD
      );
    });
  });

  describe('subscribeToTransactions', () => {
    test('unsubscribe directly after to avoid downloading excel multiple times, if user clicks second time on download button', () => {
      component.unsubscribe = jest.fn();

      component.subscribeToTransactions(ExportExcel.DETAILED_DOWNLOAD);

      expect(component.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('proccessHeaderCallBack', () => {
    test('should return headerName', () => {
      const colDef = {
        field: ColumnFields.MATERIAL_NUMBER_15,
        headerName: 'headerName',
      };
      const params = {
        column: {
          getColDef: () => colDef,
        },
      } as ProcessHeaderForExportParams;
      const result = component.processHeaderCallback(params);
      expect(result).toEqual(colDef.headerName);
    });

    test('should return headerName and currency', () => {
      const colDef = {
        field: PriceColumns[0],
        headerName: 'headerName',
        currency: 'currency',
      };
      const params = {
        column: {
          getColDef: () => colDef,
        },
      } as any;

      const expected = `${colDef.headerName} [${params.context?.quotation.currency}]`;

      const result = component.processHeaderCallback(params);
      expect(result).toEqual(expected);
    });
  });
  describe('processCellCallback', () => {
    test('should return cell value', () => {
      const colDef = {
        field: ColumnFields.GPI,
      };
      const params = {
        value: 'value',
        column: {
          getColDef: () => colDef,
        },
      } as any;

      const result = component.processCellCallback(params);
      expect(result).toEqual(params.value);
    });
    test('should return apply valueFormatter', () => {
      const colDef = {
        field: ColumnFields.MATERIAL_NUMBER_15,
        valueFormatter: true,
      };
      const params = {
        column: {
          getColDef: () => colDef,
        },
      } as any;
      const response = 'result';
      component.applyExcelCellValueFormatter = jest.fn(() => response);

      const result = component.processCellCallback(params);
      expect(component.applyExcelCellValueFormatter).toHaveBeenCalledTimes(1);
      expect(result).toEqual(response);
    });
  });
  describe('applyExcelCellValueFormatter', () => {
    test('should return valueFormatter', () => {
      const formatterReturnValue = '1';
      const colDef = {
        valueFormatter: () => formatterReturnValue,
      };
      const params = {
        node: {},
        column: {
          getColDef: () => colDef,
        },
      } as any;

      const result = component.applyExcelCellValueFormatter(params);
      expect(result).toEqual(formatterReturnValue);
    });
    test("should return undefined on '-'", () => {
      const formatterReturnValue = '-';
      const colDef = {
        valueFormatter: () => formatterReturnValue,
      };
      const params = {
        node: {},
        column: {
          getColDef: () => colDef,
        },
      } as any;

      const result = component.applyExcelCellValueFormatter(params);

      expect(result).toEqual(undefined);
    });
  });
  describe('getSummarySheet', () => {
    test('should return summary sheet', () => {
      component['params'] = mockParams;
      component.addSummaryHeader = jest.fn(() => []);
      component.addQuotationSummary = jest.fn(() => []);
      component.addCustomerOverview = jest.fn(() => []);

      component.getSummarySheet();

      expect(component.addSummaryHeader).toHaveBeenCalledTimes(1);
      expect(component.addQuotationSummary).toHaveBeenCalledTimes(1);
      expect(component.addCustomerOverview).toHaveBeenCalledTimes(1);
      expect(
        component['params'].api.getSheetDataForExcel
      ).toHaveBeenCalledTimes(1);
      expect(
        component['params'].api.getSheetDataForExcel
      ).toHaveBeenLastCalledWith({
        prependContent: [],
        columnKeys: [''],
        sheetName: 'translate it',
        columnWidth: 250,
      });
    });
  });

  describe('addSummaryHeader', () => {
    test('should return summary Header', () => {
      const result = component.addSummaryHeader(QUOTATION_MOCK);
      const type = 'String';

      const expected = [
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelText.id,
          },
          {
            data: {
              type,
              value: QUOTATION_MOCK.sapId,
            },
            styleId: excelStyleObjects.excelText.id,
          },
        ],
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelText.id,
          },
          {
            data: {
              type,
              value: QUOTATION_MOCK.gqId.toString(),
            },
            styleId: excelStyleObjects.excelText.id,
          },
        ],
        [],
      ];
      expect(result.length).toEqual(3);
      expect(result).toEqual(expected);
    });
  });

  describe('addQuotationSummary', () => {
    test('should return quotation summary', () => {
      const result = component.addQuotationSummary(QUOTATION_MOCK);
      const type = 'String';

      const expected = [
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelTextBold.id,
          },
        ],
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
          },
          {
            data: {
              type,
              value: QUOTATION_MOCK.customer.identifier.customerId,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
          },
          {
            data: {
              type,
              value: QUOTATION_MOCK.customer.name,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
          },
          {
            data: {
              type,
              value: '2,000.00 EUR',
            },
            styleId: excelStyleObjects.excelTextBorderBold.id,
          },
        ],
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
          },
          {
            data: {
              type,
              value: `80 %`,
            },
            styleId: excelStyleObjects.excelTextBorderBold.id,
          },
        ],
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
          },
          {
            data: {
              type,
              value: `90 %`,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
          },
          {
            data: {
              type,
              value: QUOTATION_MOCK.currency,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
        [],
      ];
      expect(result).toEqual(expected);
    });
  });

  describe('addCustomerOverview', () => {
    test('should addCustomerOverview', () => {
      const result = component.addCustomerOverview(QUOTATION_MOCK);
      const type = 'String';
      const lastYear = HelperService.getLastYear();
      const currentYear = HelperService.getCurrentYear();

      const expected = [
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelTextBold.id,
          },
        ],
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
          },
          {
            data: {
              type,
              value: CUSTOMER_MOCK.keyAccount,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
          },
          {
            data: {
              type,
              value: CUSTOMER_MOCK.subKeyAccount,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
          },
          {
            data: {
              type,
              value: CUSTOMER_MOCK.abcClassification,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
        [
          {
            data: {
              type,
              value: `${lastYear} translate it`,
            },
            styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
          },
          {
            data: {
              type,
              value: HelperService.transformMarginDetails(
                CUSTOMER_MOCK.marginDetail?.netSalesLastYear,
                QUOTATION_MOCK.currency
              ),
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
        [
          {
            data: {
              type,
              value: `${lastYear} translate it`,
            },
            styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
          },
          {
            data: {
              type,
              value: `${CUSTOMER_MOCK.marginDetail?.gpiLastYear.toString()} %`,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
        [
          {
            data: {
              type,
              value: `${currentYear} translate it`,
            },
            styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
          },
          {
            data: {
              type,
              value: HelperService.transformMarginDetails(
                CUSTOMER_MOCK.marginDetail?.currentNetSales,
                QUOTATION_MOCK.currency
              ),
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
        [
          {
            data: {
              type,
              value: `${currentYear} translate it`,
            },
            styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
          },
          {
            data: {
              type,
              value: `${CUSTOMER_MOCK.marginDetail?.currentGpi.toString()} %`,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
          },
          {
            data: {
              type,
              value: CUSTOMER_MOCK.country,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
        [
          {
            data: {
              type,
              value: 'translate it',
            },
            styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
          },
          {
            data: {
              type,
              value: CUSTOMER_MOCK.incoterms,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
      ];
      expect(result).toEqual(expected);
    });
  });

  describe('getExcelCell returns', () => {
    test('excel cell without defining a default style', () => {
      const value = 'yes';

      const excelCell = component.getExcelCell(value);

      expect(excelCell).toEqual({
        data: {
          type: 'String',
          value: 'yes',
        },
        styleId: excelStyleObjects.excelText.id,
      });
    });

    test('excel cell while defining style', () => {
      const value = 'yes';

      const excelCell = component.getExcelCell(
        value,
        excelStyleObjects.excelTextBold.id
      );

      expect(excelCell).toEqual({
        data: {
          type: 'String',
          value: 'yes',
        },
        styleId: excelStyleObjects.excelTextBold.id,
      });
    });
  });

  describe('export excel for comparable transactions', () => {
    beforeEach(() => {
      component['params'] = mockParams;
    });

    describe('setData', () => {
      beforeEach(() => {
        component['getComparableTransactions'] = jest.fn();
      });
      test(`calls get comparable transactions, if exportExcel is ${ExportExcel.DETAILED_DOWNLOAD}`, () => {
        component.setData(ExportExcel.DETAILED_DOWNLOAD);

        expect(component.getComparableTransactions).toHaveBeenCalledTimes(1);
      });

      test(`does not call get comparable transactions, if exportExcel is ${ExportExcel.BASIC_DOWNLOAD}`, () => {
        component.setData(ExportExcel.BASIC_DOWNLOAD);

        expect(component.getComparableTransactions).not.toHaveBeenCalled();
      });
    });

    describe('getComparableTransactions', () => {
      test('calls getSheetDataForExcel', () => {
        component.addComparableTransactions = jest.fn(() => []);

        component.getComparableTransactions();

        expect(component.addComparableTransactions).toHaveBeenCalledTimes(1);
        expect(
          component['params'].api.getSheetDataForExcel
        ).toHaveBeenCalledTimes(1);
        expect(
          component['params'].api.getSheetDataForExcel
        ).toHaveBeenLastCalledWith({
          prependContent: [],
          columnKeys: [''],
          sheetName: 'translate it',
          columnWidth: 250,
        });
      });
    });

    describe('addComparableTransactions', () => {
      let translations: { [key: string]: string };
      beforeEach(() => {
        translations = {
          itemId: 'Item',
          inputMaterialDescription: 'Input Material Description',
          inputMaterialNumber: 'Input Material Number',
          inputQuantity: 'Input Quantity',
          customerId: 'Customer Number',
          customerName: 'Customer Name',
          abcClassification: 'Customer Classification',
          keyAccount: 'Customer Key Account',
          subKeyAccount: 'Customer Subkey Account',
          sector: 'Customer Sector',
          subSector: 'Customer Subsector',
          price: 'Price',
          quantity: 'Quantity',
          profitMargin: 'GPI%',
          salesIndication: 'Order Type',
          year: 'Year',
          country: 'Country',
          region: 'Region',
        };
      });
      test('header and body gets added', () => {
        component.transactions = [];
        component.addComparableTransactionsHeader = jest.fn(() => []);
        component.addComparableTransactionsRows = jest.fn(() => []);

        component.addComparableTransactions();

        expect(component.addComparableTransactionsHeader).toHaveBeenCalledWith(
          'shared.customStatusBar.excelExport.extendedComparableLinkedTransactions'
        );
        expect(component.addComparableTransactionsRows).toHaveBeenCalledWith(
          'shared.customStatusBar.excelExport.extendedComparableLinkedTransactions'
        );
      });

      test('rows rounds up profitMargin', () => {
        component.transactions = [EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK];
        PriceService.roundToTwoDecimals = jest.fn();
        component['getExcelCell'] = jest.fn();

        component.addComparableTransactionsRows(translations);

        expect(component.getExcelCell).toHaveBeenCalledTimes(
          Object.values(translations).length
        );
        expect(PriceService.roundToTwoDecimals).toHaveBeenCalledWith(
          EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK.profitMargin
        );
      });

      test('header calls appendCurrency', () => {
        component['getExcelCell'] = jest.fn();
        component['appendCurrency'] = jest.fn();

        component.addComparableTransactionsHeader(translations);

        expect(component.getExcelCell).toHaveBeenCalledTimes(
          Object.values(translations).length
        );
        expect(component.appendCurrency).toHaveBeenCalledWith(
          translations.price
        );
      });

      test('appendCurrency returns headerField with customer price unit', () => {
        const headerField = component.appendCurrency(translations.price);

        expect(headerField).toEqual('Price [EUR]');
      });
    });
  });
});
