/* eslint-disable max-lines */
import { Component } from '@angular/core';

import {
  ExcelCell,
  ExcelExportMultipleSheetParams,
  ExcelExportParams,
  IStatusPanelParams,
  ProcessCellForExportParams,
  ProcessHeaderForExportParams,
  ValueFormatterParams,
} from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { Quotation } from '../../models';
import {
  ColumnFields,
  PriceColumns,
} from '../../services/column-utility-service/column-fields.enum';
import { HelperService } from '../../services/helper-service/helper-service.service';
import { PriceService } from '../../services/price-service/price.service';
import { excelStyleObjects } from './excel-styles.constants';

const type = 'String';
@Component({
  selector: 'gq-export-excel-button',
  templateUrl: './export-to-excel-button.component.html',
})
export class ExportToExcelButtonComponent {
  private params: IStatusPanelParams;

  agInit(params: IStatusPanelParams): void {
    this.params = params;
  }

  exportToExcel(): void {
    const gridColumnApi = this.params.columnApi;
    const columnKeys = gridColumnApi
      .getAllColumns()
      .map((col) => col.getColId())
      .filter((id) => id !== '0');

    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    const time = `${today.getHours()}-${today.getMinutes()}`;
    const excelParams: ExcelExportParams = {
      columnKeys,
      allColumns: false,
      sheetName: `Guided Quoting`,
      skipHeader: false,
      processCellCallback: (params: ProcessCellForExportParams) =>
        this.processCellCallback(params),
      processHeaderCallback: (params: ProcessHeaderForExportParams) =>
        this.processHeaderCallback(params),
    };

    const summarySheet = this.getSummarySheet();
    const dataSheet = this.params.api.getSheetDataForExcel(excelParams);

    const multipleSheetsExcel: ExcelExportMultipleSheetParams = {
      data: [summarySheet, dataSheet],
      fileName: `GQ_Case_${this.params.context.quotation.gqId}_${date}_${time}`,
    };
    this.params.api.exportMultipleSheetsAsExcel(multipleSheetsExcel);
  }

  processHeaderCallback(params: ProcessHeaderForExportParams): string {
    const colDef = params.column.getColDef();

    if (PriceColumns.includes(colDef.field as ColumnFields)) {
      return `${colDef.headerName} [${params.context?.quotation.currency}]`;
    }

    return colDef.headerName;
  }

  processCellCallback(params: ProcessCellForExportParams): string {
    const colDef = params.column.getColDef();
    if (
      colDef.valueFormatter &&
      (colDef.field === ColumnFields.MATERIAL_NUMBER_15 ||
        colDef.field === ColumnFields.PRICE_UNIT)
    ) {
      return this.applyExcelCellValueFormatter(params);
    }

    return params.value;
  }

  applyExcelCellValueFormatter(params: ProcessCellForExportParams): string {
    const valueFormatterParams: ValueFormatterParams = {
      ...params,
      data: params.node.data,
      node: params.node,
      colDef: params.column.getColDef(),
    };

    return (
      params.column.getColDef().valueFormatter as (
        params: ValueFormatterParams
      ) => string
    )(valueFormatterParams);
  }

  getSummarySheet(): string {
    const quotation: Quotation = this.params.context.quotation;
    const prependContent: ExcelCell[][] = [
      ...this.addSummaryHeader(quotation),
      ...this.addQuotationSummary(quotation),
      ...this.addCustomerOverview(quotation),
    ];
    const summaryParams: ExcelExportParams = {
      prependContent,
      columnKeys: [''],
      sheetName: translate('shared.customStatusBar.excelExport.summary'),
      columnWidth: 250,
    };

    return this.params.api.getSheetDataForExcel(summaryParams);
  }

  addSummaryHeader(quotation: Quotation): ExcelCell[][] {
    const result: ExcelCell[][] = [
      [
        {
          data: {
            type,
            value: translate('shared.customStatusBar.excelExport.gqCase'),
          },
          styleId: excelStyleObjects.excelText.id,
        },
        {
          data: {
            type,
            value: quotation.gqId.toString(),
          },
          styleId: excelStyleObjects.excelText.id,
        },
      ],
      [],
    ];

    if (quotation.sapId) {
      const rowData: ExcelCell[] = [
        {
          data: {
            type,
            value: translate('shared.customStatusBar.excelExport.sapQuote'),
          },
          styleId: excelStyleObjects.excelText.id,
        },
        {
          data: {
            type,
            value: quotation.sapId,
          },
          styleId: excelStyleObjects.excelText.id,
        },
      ];
      result.unshift(rowData);
    }

    return result;
  }

  addQuotationSummary(quotation: Quotation): ExcelCell[][] {
    const statusBarCalculation = PriceService.calculateStatusBarValues(
      quotation.quotationDetails
    );

    return [
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.title'
            ),
          },
          styleId: excelStyleObjects.excelTextBold.id,
        },
      ],
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.customerNumber'
            ),
          },
          styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
        },
        {
          data: {
            type,
            value: quotation.customer.identifier.customerId,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.customerName'
            ),
          },
          styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
        },
        {
          data: {
            type,
            value: quotation.customer.name,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.quoteNetValue'
            ),
          },
          styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
        },
        {
          data: {
            type,
            value: statusBarCalculation?.totalNetValue?.toString() || '-',
          },
          styleId: excelStyleObjects.excelTextBorderBold.id,
        },
      ],
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.quoteWeightedAverageGPM'
            ),
          },
          styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
        },
        {
          data: {
            type,
            value: `${statusBarCalculation.totalWeightedGPM}%`,
          },
          styleId: excelStyleObjects.excelTextBorderBold.id,
        },
      ],
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.quoteWeightedAverageGPI'
            ),
          },
          styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
        },
        {
          data: {
            type,
            value: `${statusBarCalculation.totalWeightedGPI}%`,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.currencyUsed'
            ),
          },
          styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
        },
        {
          data: {
            type,
            value: quotation.currency,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [],
    ];
  }

  addCustomerOverview(quotation: Quotation): ExcelCell[][] {
    const { customer } = quotation;
    const lastYear = HelperService.getLastYear();
    const currentYear = HelperService.getCurrentYear();

    return [
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.customerOverview.title'
            ),
          },
          styleId: excelStyleObjects.excelTextBold.id,
        },
      ],
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.customerOverview.keyAccount'
            ),
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type,
            value: customer.keyAccount,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.customerOverview.subKeyAccount'
            ),
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type,
            value: customer.subKeyAccount,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.customerOverview.customerClassification'
            ),
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type,
            value: customer.abcClassification,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type,
            value: `${lastYear} ${translate(
              'shared.customStatusBar.excelExport.customerOverview.netSales'
            )}`,
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type,
            value: customer.marginDetail?.netSalesLastYear?.toString() || '-',
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type,
            value: `${lastYear} ${translate(
              'shared.customStatusBar.excelExport.customerOverview.gpi'
            )}`,
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type,
            value: `${customer.marginDetail?.gpiLastYear?.toString() || '-'}%`,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type,
            value: `${currentYear} ${translate(
              'shared.customStatusBar.excelExport.customerOverview.netSales'
            )}`,
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type,
            value: customer.marginDetail?.currentNetSales?.toString() || '-',
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type,
            value: `${currentYear} ${translate(
              'shared.customStatusBar.excelExport.customerOverview.gpi'
            )}`,
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type,
            value: `${customer.marginDetail?.currentGpi?.toString() || '-'}%`,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.customerOverview.country'
            ),
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type,
            value: customer.country,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type,
            value: translate(
              'shared.customStatusBar.excelExport.customerOverview.incoterms'
            ),
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type,
            value: customer.incoterms,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
    ];
  }
}
