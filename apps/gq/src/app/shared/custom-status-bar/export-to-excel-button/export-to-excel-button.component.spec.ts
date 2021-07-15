import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../../testing/mocks';
import {
  ColumnFields,
  PriceColumns,
} from '../../services/column-utility-service/column-fields.enum';
import { HelperService } from '../../services/helper-service/helper-service.service';
import { excelStyleObjects } from './excel-styles.constants';
import { ExportToExcelButtonComponent } from './export-to-excel-button.component';

describe('ExportToExcelButtonComponent', () => {
  let component: ExportToExcelButtonComponent;
  let spectator: Spectator<ExportToExcelButtonComponent>;
  let mockParams: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: ExportToExcelButtonComponent,
    declarations: [ExportToExcelButtonComponent],
    imports: [
      MatButtonModule,
      MatIconModule,
      provideTranslocoTestingModule({ en: {} }),
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

      component.exportToExcel();

      expect(mockParams.api.exportMultipleSheetsAsExcel).toHaveBeenCalledWith({
        data: ['1', '2'],
        fileName: `GQ_Case_${QUOTATION_MOCK.gqId}_${date}_${time}`,
      });
      expect(mockParams.api.getSheetDataForExcel).toHaveBeenCalledTimes(1);
      expect(component.getSummarySheet).toHaveBeenCalledTimes(1);
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
      } as any;
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
              value: '2000',
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
              value: `80%`,
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
              value: `90%`,
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
              value:
                CUSTOMER_MOCK.marginDetail?.netSalesLastYear.toString() || '-',
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
              value: `${CUSTOMER_MOCK.marginDetail?.gpiLastYear.toString()}%`,
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
              value: CUSTOMER_MOCK.marginDetail?.currentNetSales.toString(),
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
              value: `${CUSTOMER_MOCK.marginDetail?.currentGpi.toString()}%`,
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
});
