import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import {
  IStatusPanelParams,
  ProcessCellForExportParams,
  ProcessHeaderForExportParams,
} from '@ag-grid-community/all-modules';
import { ColDef } from '@ag-grid-community/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CUSTOMER_MOCK,
  EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
  EXTENDED_SAP_PRICE_DETAIL_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
  SAP_PRICE_DETAILS_STATE_MOCK,
} from '../../../../../testing/mocks';
import { EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK } from '../../../../../testing/mocks/models/extended-comparable-linked-transaction.mock';
import {
  ColumnFields,
  PriceColumns,
} from '../../../ag-grid/constants/column-fields.enum';
import { ExportExcel } from '../../../components/modal/export-excel-modal/export-excel.enum';
import { HelperService } from '../../../services/helper-service/helper-service.service';
import { PriceService } from '../../../services/price-service/price.service';
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
          sapPriceDetails: SAP_PRICE_DETAILS_STATE_MOCK,
        },
      }),
    ],
    imports: [
      MatButtonModule,
      MatIconModule,
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
      PushModule,
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
      expect(component.simulationModeEnabled$).toBeDefined();
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
        [EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK],
        [EXTENDED_SAP_PRICE_DETAIL_MOCK],
      ]);

      component.shouldLoadTransactions(ExportExcel.DETAILED_DOWNLOAD);

      expect(component.extendedComparableLinkedTransactions).toEqual([
        EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
      ]);
      expect(snackBar.open).not.toHaveBeenCalled();
      expect(component.exportToExcel).toHaveBeenCalledWith(
        ExportExcel.DETAILED_DOWNLOAD
      );
    });

    test('calls dispatch and exportToExcel with BASIC_DOWNLOAD option, if no comparable transactions are available', () => {
      component['params'] = mockParams;
      component.transactions$ = of([[], []]);

      component.shouldLoadTransactions(ExportExcel.DETAILED_DOWNLOAD);

      expect(component.extendedComparableLinkedTransactions).toEqual([]);
      expect(component.extendedSapPriceConditionDetails).toEqual([]);
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
        context: {
          quotation: { currency: 'EUR' },
        },
      } as any;

      const expected = `${colDef.headerName} [EUR]`;

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
    describe('should apply valueFormatter', () => {
      const colDef = {
        field: undefined as any,
        valueFormatter: true,
      };
      const formatResponse = 'result';

      beforeEach(() => {
        component.applyExcelCellValueFormatter = jest.fn(() => formatResponse);
      });
      test('should apply for materialNumber15', () => {
        colDef.field = ColumnFields.MATERIAL_NUMBER_15;
        const params = {
          column: {
            getColDef: () => colDef,
          },
        } as any;

        const result = component.processCellCallback(params);
        expect(component.applyExcelCellValueFormatter).toHaveBeenCalledTimes(1);
        expect(result).toEqual(formatResponse);
      });
      test('should apply for priceUnit', () => {
        colDef.field = ColumnFields.PRICE_UNIT;
        const params = {
          column: {
            getColDef: () => colDef,
          },
        } as any;

        const result = component.processCellCallback(params);
        expect(component.applyExcelCellValueFormatter).toHaveBeenCalledTimes(1);
        expect(result).toEqual(formatResponse);
      });
      test('should apply for lastCustomerPriceDate', () => {
        colDef.field = ColumnFields.LAST_CUSTOMER_PRICE_DATE;
        const params = {
          column: {
            getColDef: () => colDef,
          },
        } as any;

        const result = component.processCellCallback(params);
        expect(component.applyExcelCellValueFormatter).toHaveBeenCalledTimes(1);
        expect(result).toEqual(formatResponse);
      });
      test('should apply for lastOfferPriceDate', () => {
        colDef.field = ColumnFields.LAST_OFFER_PRICE_DATE;
        const params = {
          column: {
            getColDef: () => colDef,
          },
        } as any;

        const result = component.processCellCallback(params);
        expect(component.applyExcelCellValueFormatter).toHaveBeenCalledTimes(1);
        expect(result).toEqual(formatResponse);
      });
      test('should apply for followingType', () => {
        colDef.field = ColumnFields.FOLLOWING_TYPE;
        const params = {
          column: {
            getColDef: () => colDef,
          },
        } as any;

        const result = component.processCellCallback(params);
        expect(component.applyExcelCellValueFormatter).toHaveBeenCalledTimes(1);
        expect(result).toEqual(formatResponse);
      });
      test('should apply for priceSource', () => {
        colDef.field = ColumnFields.PRICE_SOURCE;
        const params = {
          column: {
            getColDef: () => colDef,
          },
        } as any;

        const result = component.processCellCallback(params);
        expect(component.applyExcelCellValueFormatter).toHaveBeenCalledTimes(1);
        expect(result).toEqual(formatResponse);
      });
      test('should apply for lastCustomerPriceCondition', () => {
        colDef.field = ColumnFields.LAST_CUSTOMER_PRICE_CONDITION;
        const params = {
          column: {
            getColDef: () => colDef,
          },
        } as any;

        const result = component.processCellCallback(params);
        expect(component.applyExcelCellValueFormatter).toHaveBeenCalledTimes(1);
        expect(result).toEqual(formatResponse);
      });
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
              value: new Date(QUOTATION_MOCK.gqCreated).toLocaleDateString(),
            },
            styleId: excelStyleObjects.excelText.id,
          },
        ],
        [],
      ];
      expect(result.length).toEqual(4);
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
              value: `85 %`,
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
              value: `${QUOTATION_DETAIL_MOCK.priceDiff} %`,
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
              value: CUSTOMER_MOCK.netSalesClassification,
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
                CUSTOMER_MOCK.currency
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
                CUSTOMER_MOCK.currency
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
    const value = 'yes';
    test('excel cell without defining a default style', () => {
      const excelCell = component.getExcelCell(value);

      expect(excelCell).toEqual({
        data: {
          type: 'String',
          value,
        },
        styleId: excelStyleObjects.excelText.id,
      });
    });

    test('excel cell while defining style', () => {
      const excelCell = component.getExcelCell(
        value,
        excelStyleObjects.excelTextBold.id
      );

      expect(excelCell).toEqual({
        data: {
          type: 'String',
          value,
        },
        styleId: excelStyleObjects.excelTextBold.id,
      });
    });
  });

  describe('getNumberExcelCell', () => {
    test('excel cell with number type', () => {
      const value = '1';

      const excelCell = component.getNumberExcelCell('Number', value);

      expect(excelCell).toEqual({
        data: {
          type: 'Number',
          value,
        },
        styleId: excelStyleObjects.excelText.id,
      });
    });
  });

  describe('export excel for comparable transactions and extendedSapPriceConditionDetails', () => {
    beforeEach(() => {
      component['params'] = mockParams;
    });

    describe('setData', () => {
      beforeEach(() => {
        component['getComparableTransactions'] = jest.fn();
        component['getExtendedSapPriceConditionDetails'] = jest.fn();
        component.extendedComparableLinkedTransactions = [
          EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
        ];
        component.extendedSapPriceConditionDetails = [
          EXTENDED_SAP_PRICE_DETAIL_MOCK,
        ];
      });

      test(`calls getComparableTransactions and getExtendedSapPriceConditionDetails, if exportExcel is ${ExportExcel.DETAILED_DOWNLOAD}`, () => {
        component.setData(ExportExcel.DETAILED_DOWNLOAD);

        expect(component.getComparableTransactions).toHaveBeenCalledTimes(1);
        expect(
          component.getExtendedSapPriceConditionDetails
        ).toHaveBeenCalledTimes(1);
      });

      test(`does not call getComparableTransactions or getExtendedSapPriceConditionDetails, if exportExcel is ${ExportExcel.BASIC_DOWNLOAD}`, () => {
        component.setData(ExportExcel.BASIC_DOWNLOAD);

        expect(component.getComparableTransactions).not.toHaveBeenCalled();
        expect(
          component.getExtendedSapPriceConditionDetails
        ).not.toHaveBeenCalled();
      });

      test(`does not call getComparableTransactions if there are no comparableTransactions`, () => {
        component.extendedComparableLinkedTransactions = [];
        component.setData(ExportExcel.DETAILED_DOWNLOAD);

        expect(component.getComparableTransactions).not.toHaveBeenCalled();
        expect(
          component.getExtendedSapPriceConditionDetails
        ).toHaveBeenCalledTimes(1);
      });

      test(`does not call getExtendedSapPriceConditionDetails if there are no comparableTransactions`, () => {
        component.extendedSapPriceConditionDetails = [];
        component.setData(ExportExcel.DETAILED_DOWNLOAD);

        expect(component.getComparableTransactions).toHaveBeenCalledTimes(1);
        expect(
          component.getExtendedSapPriceConditionDetails
        ).not.toHaveBeenCalled();
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

    describe('getExtendedSapPriceConditionDetails', () => {
      test('calls getSheetDataForExcel', () => {
        component.addExtendedSapPriceConditionDetails = jest.fn(() => []);

        component.getExtendedSapPriceConditionDetails();

        expect(
          component.addExtendedSapPriceConditionDetails
        ).toHaveBeenCalledTimes(1);
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
          netSalesClassification: 'Customer Classification',
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
        component.extendedComparableLinkedTransactions = [];
        component.addCustomHeader = jest.fn(() => []);
        component.addCustomRows = jest.fn(() => []);

        component.addComparableTransactions();

        expect(component.addCustomHeader).toHaveBeenCalledWith(
          'shared.customStatusBar.excelExport.extendedComparableLinkedTransactions'
        );
        expect(component.addCustomRows).toHaveBeenCalledWith(
          'shared.customStatusBar.excelExport.extendedComparableLinkedTransactions',
          component.extendedComparableLinkedTransactions
        );
      });

      test('rows rounds up profitMargin', () => {
        component.extendedComparableLinkedTransactions = [
          EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
        ];
        PriceService.roundToTwoDecimals = jest.fn().mockReturnValue(42);
        component['getNumberExcelCell'] = jest.fn();

        component.addCustomRows(
          translations,
          component.extendedComparableLinkedTransactions
        );

        expect(component.getNumberExcelCell).toHaveBeenCalledTimes(
          Object.values(translations).length
        );
        expect(PriceService.roundToTwoDecimals).toHaveBeenCalledWith(
          EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK.profitMargin
        );
      });

      test('header calls appendCurrency', () => {
        component['getExcelCell'] = jest.fn();
        component['appendQuotationCurrency'] = jest.fn();

        component.addCustomHeader(translations);

        expect(component.getExcelCell).toHaveBeenCalledTimes(
          Object.values(translations).length
        );
        expect(component.appendQuotationCurrency).toHaveBeenCalledWith(
          translations.price
        );
      });

      test('appendCurrency returns headerField with customer price unit', () => {
        const headerField = component.appendQuotationCurrency(
          translations.price
        );

        expect(headerField).toEqual('Price [EUR]');
      });
    });

    describe('addExtendedSapPriceConditionDetails', () => {
      let translations: { [key: string]: string };
      beforeEach(() => {
        translations = {
          quotationItemId: 'Item',
          sapConditionType: 'SAP Condition Type',
          conditionTypeDescription: 'Description',
          amount: 'Amount',
          pricingUnit: 'per',
          conditionUnit: 'Condition Unit',
          conditionValue: 'Condition Value',
          validTo: 'Valid to',
        };
      });
      test('header and body gets added', () => {
        component.extendedSapPriceConditionDetails = [];
        component.addCustomHeader = jest.fn(() => []);
        component.addCustomRows = jest.fn(() => []);

        component.addExtendedSapPriceConditionDetails();

        expect(component.addCustomHeader).toHaveBeenCalledWith(
          'shared.customStatusBar.excelExport.extendedSapPriceConditionDetails'
        );
        expect(component.addCustomRows).toHaveBeenCalledWith(
          'shared.customStatusBar.excelExport.extendedSapPriceConditionDetails',
          component.extendedSapPriceConditionDetails
        );
      });

      test('header calls appendCurrency', () => {
        component['getExcelCell'] = jest.fn();
        component['appendQuotationCurrency'] = jest.fn();

        component.addCustomHeader(translations);

        expect(component.getExcelCell).toHaveBeenCalledTimes(
          Object.values(translations).length
        );
        expect(component.appendQuotationCurrency).toHaveBeenCalledWith(
          translations.conditionValue
        );
      });

      test('appendCurrency returns headerField with unit', () => {
        const headerField = component.appendQuotationCurrency(
          translations.conditionValue
        );

        expect(headerField).toEqual('Condition Value [EUR]');
      });
    });
  });

  describe('transformValue', () => {
    test('transforms string value', () => {
      const actual = component.transformValue(
        EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK as any,
        'inputMaterialDescription'
      );

      expect(actual).toEqual(
        EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK.inputMaterialDescription
      );
    });

    test('rounds up price', () => {
      PriceService.roundToTwoDecimals = jest.fn().mockReturnValue(42);

      component.transformValue(
        EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK as any,
        ColumnFields.PROFIT_MARGIN
      );

      expect(PriceService.roundToTwoDecimals).toHaveBeenCalledWith(
        EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK.profitMargin
      );
    });

    test('rounds up percent value', () => {
      HelperService.transformNumber = jest.fn().mockReturnValue(42);

      component.transformValue(
        EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK as any,
        ColumnFields.PRICE
      );

      expect(HelperService.transformNumber).toHaveBeenCalledWith(
        EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK.price,
        true
      );
    });

    test('handle undefined values', () => {
      HelperService.transformNumber = jest.fn().mockReturnValue(42);

      const result = component.transformValue(
        EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK as any,
        'does-not-exist' as any
      );

      expect(HelperService.transformNumber).not.toHaveBeenCalled();
      expect(result).toEqual('');
    });

    test('uses quotation currency', () => {
      HelperService.transformNumber = jest.fn().mockReturnValue(42);
      HelperService.transformNumberCurrency = jest.fn();
      component['params'] = {
        ...mockParams,
        context: { quotation: { currency: 'JPY' } },
      };
      component.transformValue(EXTENDED_SAP_PRICE_DETAIL_MOCK, 'amount');

      expect(HelperService.transformNumberCurrency).toHaveBeenCalledWith(
        42,
        'JPY'
      );
    });
  });

  describe('hasDelimiterProblemInExcelGreaterEqual1000', () => {
    test('does not transform, if columnFields is not equal to Price', () => {
      expect(
        component.hasDelimiterProblemInExcelGreaterEqual1000(
          ColumnFields.ORDER_QUANTITY,
          1000
        )
      ).toBeFalsy();
    });

    test('does not transform, if columnFields is equal to Price and value is equals to or smaller than 1000', () => {
      expect(
        component.hasDelimiterProblemInExcelGreaterEqual1000(
          ColumnFields.PRICE,
          1000
        )
      ).toBeFalsy();
    });

    test('transforms, if columnFields is equal to Price and value is smaller than 1000', () => {
      expect(
        component.hasDelimiterProblemInExcelGreaterEqual1000(
          ColumnFields.PRICE,
          999
        )
      ).toBeTruthy();
    });
  });

  describe('hasDelimiterProblemInExcelGreaterEqual1000ProcessingCell', () => {
    test('does not transform, if columnFields is not equal to Price', () => {
      expect(
        component.hasDelimiterProblemInExcelGreaterEqual1000ProcessingCell(
          { field: ColumnFields.ORDER_QUANTITY } as ColDef,
          { value: 1000 } as ProcessCellForExportParams
        )
      ).toBeFalsy();
    });

    test('does not transform, if columnFields is equal to Price and value is equals to or smaller than 1000', () => {
      expect(
        component.hasDelimiterProblemInExcelGreaterEqual1000ProcessingCell(
          { field: ColumnFields.PRICE } as ColDef,
          { value: 1000 } as ProcessCellForExportParams
        )
      ).toBeFalsy();
    });

    test('transforms, if columnFields is equal to Price and value is smaller than 1000', () => {
      expect(
        component.hasDelimiterProblemInExcelGreaterEqual1000ProcessingCell(
          { field: ColumnFields.PRICE } as ColDef,
          { value: 999 } as ProcessCellForExportParams
        )
      ).toBeTruthy();
    });
  });
});
