/* eslint-disable max-lines */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { combineLatest, Observable, Subscription } from 'rxjs';

import {
  ExcelCell,
  ExcelDataType,
  ExcelExportParams,
  ExcelOOXMLDataType,
  IStatusPanelParams,
  ProcessCellForExportParams,
  ProcessHeaderForExportParams,
  ValueFormatterParams,
} from '@ag-grid-community/all-modules';
import { ColDef } from '@ag-grid-community/core';
import { translate, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  getExtendedSapPriceConditionDetails,
  getSimulationModeEnabled,
} from '../../../../core/store';
import { ExtendedComparableLinkedTransaction } from '../../../../core/store/reducers/extended-comparable-linked-transactions/models/extended-comparable-linked-transaction';
import {
  CalculationType,
  ExtendedSapPriceConditionDetail,
} from '../../../../core/store/reducers/sap-price-details/models';
import { getExtendedComparableLinkedTransactions } from '../../../../core/store/selectors/extended-comparable-linked-transactions/extended-comparable-linked-transactions.selector';
import { ExportExcel } from '../../../components/modal/export-excel-modal/export-excel.enum';
import { ExportExcelModalComponent } from '../../../components/modal/export-excel-modal/export-excel-modal.component';
import { Keyboard, Quotation } from '../../../models';
import { HelperService } from '../../../services/helper-service/helper-service.service';
import { PriceService } from '../../../services/price-service/price.service';
import {
  ColumnFields,
  DateColumns,
  ExportExcelNumberColumns,
  PercentColumns,
  PriceColumns,
  SapPriceDetailsColumnFields,
} from '../../constants/column-fields.enum';
import { excelStyleObjects } from './excel-styles.constants';

const typeString = 'String';
const typeNumber = 'Number';

@Component({
  selector: 'gq-export-excel-button',
  templateUrl: './export-to-excel-button.component.html',
})
export class ExportToExcelButtonComponent implements OnInit {
  private params: IStatusPanelParams;
  simulationModeEnabled$: Observable<boolean>;
  transactions$: Observable<
    [ExtendedComparableLinkedTransaction[], ExtendedSapPriceConditionDetail[]]
  >;
  extendedComparableLinkedTransactions: ExtendedComparableLinkedTransaction[];
  extendedSapPriceConditionDetails: ExtendedSapPriceConditionDetail[];

  toBeFormattedInExcelDownload: string[] = [
    ColumnFields.MATERIAL_NUMBER_15,
    ColumnFields.PRICE_UNIT,
    ColumnFields.LAST_CUSTOMER_PRICE_DATE,
    ColumnFields.LAST_OFFER_PRICE_DATE,
    ColumnFields.FOLLOWING_TYPE,
    ColumnFields.PRICE_SOURCE,
    ColumnFields.LAST_CUSTOMER_PRICE_CONDITION,
  ];

  constructor(
    private readonly matDialog: MatDialog,
    private readonly store: Store,
    private readonly translocoService: TranslocoService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.transactions$ = combineLatest([
      this.store.select(getExtendedComparableLinkedTransactions),
      this.store.select(getExtendedSapPriceConditionDetails),
    ]);
  }

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
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
        this.extendedComparableLinkedTransactions = transactions[0];
        this.extendedSapPriceConditionDetails = transactions[1];

        if (
          this.extendedComparableLinkedTransactions.length === 0 &&
          this.extendedSapPriceConditionDetails.length === 0
        ) {
          this.snackBar.open(
            translate(
              'shared.customStatusBar.excelExport.noTransactionAndPriceDetails'
            )
          );
          this.exportToExcel(ExportExcel.BASIC_DOWNLOAD);

          return;
        }

        if (this.extendedComparableLinkedTransactions.length === 0) {
          this.snackBar.open(
            translate(
              'shared.customStatusBar.excelExport.noComparableTransactionsWarning'
            )
          );
        }

        if (this.extendedSapPriceConditionDetails.length === 0) {
          this.snackBar.open(
            translate(
              'shared.customStatusBar.excelExport.noExtendedSapPriceConditionDetailsWarning'
            )
          );
        }

        this.exportToExcel(exportExcel);
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
    const sheets = [this.getSummarySheet(), this.getProcessCaseSheet()];

    if (
      exportExcel === ExportExcel.DETAILED_DOWNLOAD &&
      this.extendedComparableLinkedTransactions?.length > 0
    ) {
      sheets.push(this.getComparableTransactions());
    }

    if (
      exportExcel === ExportExcel.DETAILED_DOWNLOAD &&
      this.extendedSapPriceConditionDetails?.length > 0
    ) {
      sheets.push(this.getExtendedSapPriceConditionDetails());
    }

    return sheets;
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
    } else if (
      this.hasDelimiterProblemInExcelGreaterEqual1000ProcessingCell(
        colDef,
        params
      )
    ) {
      return HelperService.transformNumber(params.value, true);
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
    const createdOnDate = new Date(quotation.gqCreated).toLocaleDateString();
    const result: ExcelCell[][] = [
      [
        this.getExcelCell(
          translate('shared.customStatusBar.excelExport.gqCase')
        ),
        this.getExcelCell(quotation.gqId.toString()),
      ],
      [
        this.getExcelCell(
          translate('shared.customStatusBar.excelExport.gqCreated')
        ),
        this.getExcelCell(createdOnDate),
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
        type: typeString,
        value,
      },
      styleId: defaultStyle,
    };
  }

  getNumberExcelCell(
    format: ExcelDataType | ExcelOOXMLDataType,
    value: string
  ): ExcelCell {
    return {
      data: {
        type: format,
        value,
      },
      styleId: excelStyleObjects.excelText.id,
    };
  }

  addQuotationSummary(quotation: Quotation): ExcelCell[][] {
    const statusBarProperties = PriceService.calculateStatusBarValues(
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
            type: typeString,
            value: quotation.customer.identifier.customerId,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.customerName'
            ),
          },
          styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
        },
        {
          data: {
            type: typeString,
            value: quotation.customer.name,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.quoteNetValue'
            ),
          },
          styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
        },
        {
          data: {
            type: typeString,
            value: HelperService.transformMarginDetails(
              statusBarProperties?.netValue,
              quotation.currency
            ),
          },
          styleId: excelStyleObjects.excelTextBorderBold.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.quoteWeightedAverageGPM'
            ),
          },
          styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
        },
        {
          data: {
            type: typeString,
            value: HelperService.transformPercentage(statusBarProperties.gpm),
          },
          styleId: excelStyleObjects.excelTextBorderBold.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.quoteWeightedAverageGPI'
            ),
          },
          styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
        },
        {
          data: {
            type: typeString,
            value: HelperService.transformPercentage(statusBarProperties.gpi),
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.quotePriceDifference'
            ),
          },
          styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
        },
        {
          data: {
            type: typeString,
            value: HelperService.transformPercentage(
              statusBarProperties.priceDiff
            ),
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: translate(
              'shared.customStatusBar.excelExport.quotationSummary.currencyUsed'
            ),
          },
          styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
        },
        {
          data: {
            type: typeString,
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
            type: typeString,
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
            type: typeString,
            value: translate(
              'shared.customStatusBar.excelExport.customerOverview.keyAccount'
            ),
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type: typeString,
            value: customer.keyAccount,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: translate(
              'shared.customStatusBar.excelExport.customerOverview.subKeyAccount'
            ),
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type: typeString,
            value: customer.subKeyAccount,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: translate(
              'shared.customStatusBar.excelExport.customerOverview.netSalesClassification'
            ),
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type: typeString,
            value: customer.netSalesClassification,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: `${lastYear} ${translate(
              'shared.customStatusBar.excelExport.customerOverview.netSales'
            )}`,
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type: typeString,
            value: HelperService.transformMarginDetails(
              customer.marginDetail?.netSalesLastYear,
              customer.currency
            ),
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: `${lastYear} ${translate(
              'shared.customStatusBar.excelExport.customerOverview.gpi'
            )}`,
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type: typeString,
            value: HelperService.transformPercentage(
              customer.marginDetail?.gpiLastYear
            ),
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: `${currentYear} ${translate(
              'shared.customStatusBar.excelExport.customerOverview.netSales'
            )}`,
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type: typeString,
            value: HelperService.transformMarginDetails(
              customer.marginDetail?.currentNetSales,
              customer.currency
            ),
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: `${currentYear} ${translate(
              'shared.customStatusBar.excelExport.customerOverview.gpi'
            )}`,
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type: typeString,
            value: HelperService.transformPercentage(
              customer.marginDetail?.currentGpi
            ),
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: translate(
              'shared.customStatusBar.excelExport.customerOverview.country'
            ),
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type: typeString,
            value: customer.country,
          },
          styleId: excelStyleObjects.excelTextBorder.id,
        },
      ],
      [
        {
          data: {
            type: typeString,
            value: translate(
              'shared.customStatusBar.excelExport.customerOverview.incoterms'
            ),
          },
          styleId: excelStyleObjects.excelCustomerOverviewLabel.id,
        },
        {
          data: {
            type: typeString,
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
    const headerTranslations: { [key: string]: string } =
      this.translocoService.translateObject(
        'shared.customStatusBar.excelExport.extendedComparableLinkedTransactions',
        {},
        ''
      );

    return [
      this.addCustomHeader(headerTranslations),
      ...this.addCustomRows(
        headerTranslations,
        this.extendedComparableLinkedTransactions
      ),
    ];
  }

  getExtendedSapPriceConditionDetails(): string {
    return this.params.api.getSheetDataForExcel({
      prependContent: this.addExtendedSapPriceConditionDetails(),
      columnKeys: [''],
      sheetName: translate(
        'shared.customStatusBar.excelExport.extendedSapPriceConditionDetailsTitle'
      ),
      columnWidth: 250,
    });
  }

  addExtendedSapPriceConditionDetails(): ExcelCell[][] {
    const headerTranslations: { [key: string]: string } =
      this.translocoService.translateObject(
        'shared.customStatusBar.excelExport.extendedSapPriceConditionDetails',
        {},
        ''
      );

    return [
      this.addCustomHeader(headerTranslations),
      ...this.addCustomRows(
        headerTranslations,
        this.extendedSapPriceConditionDetails
      ),
    ];
  }

  addCustomHeader(headersTranslations: { [key: string]: string }): ExcelCell[] {
    const header: ExcelCell[] = [];
    for (const [key, value] of Object.entries(headersTranslations)) {
      header.push(
        this.getExcelCell(
          PriceColumns.includes(key as ColumnFields)
            ? this.appendQuotationCurrency(value)
            : value
        )
      );
    }

    return header;
  }

  addCustomRows(
    headersTranslations: Record<string, string>,
    values: (
      | ExtendedComparableLinkedTransaction
      | ExtendedSapPriceConditionDetail
    )[]
  ): ExcelCell[][] {
    return values.map(
      (
        t: ExtendedComparableLinkedTransaction | ExtendedSapPriceConditionDetail
      ) => {
        const row: ExcelCell[] = [];
        for (const key in headersTranslations) {
          row.push(
            this.getNumberExcelCell(
              ExportExcelNumberColumns.includes(key as ColumnFields)
                ? typeNumber
                : typeString,
              this.transformValue(
                t,
                key as
                  | keyof ExtendedComparableLinkedTransaction
                  | keyof ExtendedSapPriceConditionDetail
              )
            )
          );
        }

        return row;
      }
    );
  }

  transformValue(
    t: ExtendedComparableLinkedTransaction | ExtendedSapPriceConditionDetail,
    key:
      | keyof ExtendedComparableLinkedTransaction
      | keyof ExtendedSapPriceConditionDetail
  ): string {
    const value =
      'quotationItemId' in t
        ? t[key as keyof ExtendedSapPriceConditionDetail]
        : t[key as keyof ExtendedComparableLinkedTransaction];

    if (value === undefined || value === null) {
      return '';
    } else if (PercentColumns.includes(key as ColumnFields)) {
      return PriceService.roundToTwoDecimals(Number(value)).toString();
    } else if (DateColumns.includes(key as SapPriceDetailsColumnFields)) {
      return HelperService.transformDate(value.toString());
    } else if (
      this.hasDelimiterProblemInExcelGreaterEqual1000(key, Number(value))
    ) {
      return HelperService.transformNumber(value as number, true).toString();
    } else if (key === SapPriceDetailsColumnFields.SAP_PRICING_UNIT) {
      return value === 0 ? '' : value.toString();
    } else if (key === SapPriceDetailsColumnFields.SAP_AMOUNT) {
      if (
        'calculationType' in t &&
        t.calculationType === CalculationType.ABSOLUT
      ) {
        return HelperService.transformNumberCurrency(
          HelperService.transformNumber(Number(value), true),
          'USD'
        );
      }

      return HelperService.transformPercentage(Number(value));
    }

    return value?.toString();
  }

  hasDelimiterProblemInExcelGreaterEqual1000(
    key: string,
    value: number
  ): boolean {
    return key === ColumnFields.PRICE && value < 1000;
  }

  hasDelimiterProblemInExcelGreaterEqual1000ProcessingCell(
    colDef: ColDef,
    params: ProcessCellForExportParams
  ): boolean {
    return (
      (PriceColumns as string[]).includes(colDef.field) && params.value < 1000
    );
  }

  appendQuotationCurrency(key: string): string {
    return `${key} [${this.params.context.quotation.currency}]`;
  }
}
