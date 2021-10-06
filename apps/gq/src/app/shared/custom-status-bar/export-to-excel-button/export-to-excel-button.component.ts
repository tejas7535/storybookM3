/* eslint-disable max-lines */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable, Subscription } from 'rxjs';

import {
  ExcelCell,
  ExcelExportParams,
  IStatusPanelParams,
  ProcessCellForExportParams,
  ProcessHeaderForExportParams,
  ValueFormatterParams,
} from '@ag-grid-community/all-modules';
import { translate, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { SnackBarService } from '@schaeffler/snackbar';

import { ExtendedComparableLinkedTransaction } from '../../../core/store/reducers/extended-comparable-linked-transactions/models/extended-comparable-linked-transaction';
import { getExtendedComparableLinkedTransactions } from '../../../core/store/selectors/extended-comparable-linked-transactions/extended-comparable-linked-transactions.selector';
import { ExportExcelModalComponent } from '../../export-excel-modal/export-excel-modal.component';
import { ExportExcel } from '../../export-excel-modal/export-excel.enum';
import { Keyboard, Quotation } from '../../models';
import {
  ColumnFields,
  PercentColumns,
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
export class ExportToExcelButtonComponent implements OnInit {
  private params: IStatusPanelParams;
  transactions$: Observable<ExtendedComparableLinkedTransaction[]>;
  transactions: ExtendedComparableLinkedTransaction[];
  toBeFormattedInExcelDownload: string[] = [
    ColumnFields.MATERIAL_NUMBER_15,
    ColumnFields.PRICE_UNIT,
    ColumnFields.LAST_CUSTOMER_PRICE_DATE,
    ColumnFields.LAST_OFFER_PRICE_DATE,
    ColumnFields.FOLLOWING_TYPE,
  ];

  constructor(
    private readonly matDialog: MatDialog,
    private readonly store: Store,
    private readonly translocoService: TranslocoService,
    private readonly snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.transactions$ = this.store.select(
      getExtendedComparableLinkedTransactions
    );
  }

  agInit(params: IStatusPanelParams): void {
    this.params = params;
  }

  openExportToExcelDialog(): void {
    this.matDialog
      .open(ExportExcelModalComponent, {
        width: '80%',
        maxWidth: '863px',
        height: 'auto',
        minHeight: '350px',
      })
      .afterClosed()
      .subscribe((exportExcel: ExportExcel) => {
        this.shouldLoadTransactions(exportExcel);
      });
  }

  shouldLoadTransactions(exportExcel: ExportExcel) {
    if (exportExcel) {
      if (exportExcel === ExportExcel.DETAILED_DOWNLOAD) {
        this.subscribeToTransactions(exportExcel);
      } else if (exportExcel === ExportExcel.BASIC_DOWNLOAD) {
        this.exportToExcel(exportExcel);
      }
    }
  }

  subscribeToTransactions(exportExcel: ExportExcel.DETAILED_DOWNLOAD) {
    this.unsubscribe(
      this.transactions$.subscribe((transactions) => {
        if (transactions?.length > 0) {
          this.transactions = transactions;
          this.exportToExcel(exportExcel);
        } else {
          this.snackbarService.showWarningMessage(
            translate(
              'shared.customStatusBar.excelExport.noComparableTransactionsWarning'
            )
          );
          this.exportToExcel(ExportExcel.BASIC_DOWNLOAD);
        }
      })
    );
  }

  unsubscribe(subscription: Subscription) {
    subscription.unsubscribe();
  }

  exportToExcel(exportExcel: ExportExcel): void {
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    const time = `${today.getHours()}-${today.getMinutes()}`;

    this.params?.api.exportMultipleSheetsAsExcel({
      data: this.setData(exportExcel),
      fileName: `GQ_Case_${this.params.context.quotation.gqId}_${date}_${time}`,
    });
  }

  setData(exportExcel: ExportExcel): string[] {
    return exportExcel === ExportExcel.BASIC_DOWNLOAD
      ? [this.getSummarySheet(), this.getProcessCaseSheet()]
      : [
          this.getSummarySheet(),
          this.getProcessCaseSheet(),
          this.getComparableTransactions(),
        ];
  }

  private getProcessCaseSheet(): string {
    const columnKeys = this.params.columnApi
      .getAllColumns()
      .map((col) => col.getColId());

    const excelParams: ExcelExportParams = {
      columnKeys,
      allColumns: false,
      sheetName: translate('shared.customStatusBar.excelExport.guidedQuoting'),
      skipHeader: false,
      processCellCallback: (params: ProcessCellForExportParams) =>
        this.processCellCallback(params),
      processHeaderCallback: (params: ProcessHeaderForExportParams) =>
        this.processHeaderCallback(params),
    };

    return this.params.api.getSheetDataForExcel(excelParams);
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
      this.toBeFormattedInExcelDownload.includes(colDef.field)
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
    const result = (
      params.column.getColDef().valueFormatter as (
        params: ValueFormatterParams
      ) => string
    )(valueFormatterParams);

    return result === Keyboard.DASH ? undefined : result;
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
        this.getExcelCell(
          translate('shared.customStatusBar.excelExport.gqCase')
        ),
        this.getExcelCell(quotation.gqId.toString()),
      ],
      [],
    ];

    if (quotation.sapId) {
      result.unshift([
        this.getExcelCell(
          translate('shared.customStatusBar.excelExport.sapQuote')
        ),
        this.getExcelCell(quotation.sapId),
      ]);
    }

    return result;
  }

  getExcelCell(
    value: string,
    defaultStyle: string = excelStyleObjects.excelText.id
  ): ExcelCell {
    return {
      data: {
        type,
        value,
      },
      styleId: defaultStyle,
    };
  }

  addQuotationSummary(quotation: Quotation): ExcelCell[][] {
    const statusBarCalculation = PriceService.calculateStatusBarValues(
      quotation.quotationDetails
    );

    return [
      [
        this.getExcelCell(
          translate(
            'shared.customStatusBar.excelExport.quotationSummary.title'
          ),
          excelStyleObjects.excelTextBold.id
        ),
      ],
      [
        this.getExcelCell(
          translate(
            'shared.customStatusBar.excelExport.quotationSummary.customerNumber'
          ),
          excelStyleObjects.excelQuotationSummaryLabel.id
        ),
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
            value:
              statusBarCalculation?.totalNetValue?.toString() || Keyboard.DASH,
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
            value:
              customer.marginDetail?.netSalesLastYear?.toString() ||
              Keyboard.DASH,
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
            value: `${
              customer.marginDetail?.gpiLastYear?.toString() || Keyboard.DASH
            }%`,
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
            value:
              customer.marginDetail?.currentNetSales?.toString() ||
              Keyboard.DASH,
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
            value: `${
              customer.marginDetail?.currentGpi?.toString() || Keyboard.DASH
            }%`,
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

  getComparableTransactions(): string {
    return this.params.api.getSheetDataForExcel({
      prependContent: this.addComparableTransactions(),
      columnKeys: [''],
      sheetName: translate(
        'shared.customStatusBar.excelExport.comparableTransactions'
      ),
      columnWidth: 250,
    });
  }

  addComparableTransactions(): ExcelCell[][] {
    const headersTranslations: { [key: string]: string } =
      this.translocoService.translateObject(
        'shared.customStatusBar.excelExport.extendedComparableLinkedTransactions',
        {},
        ''
      );

    return [
      this.addComparableTransactionsHeader(headersTranslations),
      ...this.addComparableTransactionsRows(headersTranslations),
    ];
  }

  addComparableTransactionsRows(headersTranslations: {
    [key: string]: string;
  }): ExcelCell[][] {
    return this.transactions.map((t) => {
      const row: ExcelCell[] = [];
      for (const key in headersTranslations) {
        const value = t[key as keyof ExtendedComparableLinkedTransaction];
        row.push(
          this.getExcelCell(
            PercentColumns.includes(key as ColumnFields)
              ? PriceService.roundToTwoDecimals(Number(value))?.toString()
              : value?.toString()
          )
        );
      }

      return row;
    });
  }

  addComparableTransactionsHeader(headersTranslations: {
    [key: string]: string;
  }): ExcelCell[] {
    const header: ExcelCell[] = [];
    for (const [key, value] of Object.entries(headersTranslations)) {
      header.push(
        this.getExcelCell(
          PriceColumns.includes(key as ColumnFields)
            ? this.appendCurrency(value)
            : value
        )
      );
    }

    return header;
  }

  appendCurrency(key: string): string {
    return `${key} [${this.params.context.quotation.currency}]`;
  }
}
