/* eslint-disable max-lines */
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { combineLatest, Observable, Subscription } from 'rxjs';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getSimulationModeEnabled } from '@gq/core/store/active-case/active-case.selectors';
import { extendedComparableLinkedTransactionsFeature } from '@gq/core/store/extended-comparable-linked-transactions/extended-comparable-linked-transactions.reducer';
import { ExtendedComparableLinkedTransaction } from '@gq/core/store/extended-comparable-linked-transactions/models';
import { RolesFacade } from '@gq/core/store/facades';
import {
  CalculationType,
  ExtendedSapPriceConditionDetail,
} from '@gq/core/store/reducers/models';
import { getExtendedSapPriceConditionDetails } from '@gq/core/store/selectors';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.model';
import { getCurrentYear, getLastYear } from '@gq/shared/utils/misc.utils';
import { translate, TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import {
  ExcelCell,
  ExcelDataType,
  ExcelExportParams,
  ExcelOOXMLDataType,
  ExcelRow,
  IStatusPanelParams,
  ProcessCellForExportParams,
  ProcessHeaderForExportParams,
  ValueFormatterParams,
} from 'ag-grid-enterprise';

import { ExportExcel } from '../../../components/modal/export-excel-modal/export-excel.enum';
import { ExportExcelModalComponent } from '../../../components/modal/export-excel-modal/export-excel-modal.component';
import { Keyboard, Quotation } from '../../../models';
import { UomPipe } from '../../../pipes/uom/uom.pipe';
import { TransformationService } from '../../../services/transformation/transformation.service';
import {
  ColumnFields,
  DateColumns,
  DisplayDashForFalsyValueColumns,
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
  extendedComparableLinkedTransactions: ExtendedComparableLinkedTransaction[];
  extendedSapPriceConditionDetails: ExtendedSapPriceConditionDetail[];

  toBeFormattedInExcelDownload: string[] = [
    ColumnFields.MATERIAL_NUMBER_15,
    ColumnFields.LEADING_PRICE_UNIT,
    ColumnFields.LAST_CUSTOMER_PRICE_DATE,
    ColumnFields.LAST_OFFER_PRICE_DATE,
    ColumnFields.FOLLOWING_TYPE,
    ColumnFields.PRICE_SOURCE,
    ColumnFields.LAST_CUSTOMER_PRICE_CONDITION,
    ColumnFields.UOM,
    ColumnFields.DATE_NEXT_FREE_ATP,
    ColumnFields.SAP_SYNC_STATUS,
    ColumnFields.TARGET_PRICE_SOURCE,
  ];

  extendedDownloadEnabled = true;
  quotationDetailsSummaryKpi: QuotationDetailsSummaryKpi;
  isMspWarningPresent: boolean;

  private params: IStatusPanelParams;
  private readonly store = inject(Store);
  private readonly matDialog = inject(MatDialog);
  private readonly translocoService = inject(TranslocoService);
  private readonly transformationService = inject(TransformationService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly rolesFacade = inject(RolesFacade);
  private readonly destroyRef = inject(DestroyRef);

  transactions$: Observable<
    [ExtendedComparableLinkedTransaction[], ExtendedSapPriceConditionDetail[]]
  > = combineLatest([
    this.store.select(
      extendedComparableLinkedTransactionsFeature.selectExtendedComparableLinkedTransactions
    ),
    this.store.select(getExtendedSapPriceConditionDetails),
  ]);
  simulationModeEnabled$: Observable<boolean> = this.store.select(
    getSimulationModeEnabled
  );

  ngOnInit(): void {
    this.checkForUserRoles();
    this.store
      .select(activeCaseFeature.getQuotationDetailsSummaryKpi)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((kpi) => (this.quotationDetailsSummaryKpi = kpi));

    this.store
      .select(activeCaseFeature.isAnyMspWarningPresent)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isMspWarningPresent) => {
        this.isMspWarningPresent = isMspWarningPresent;
      });
  }

  agInit(params: IStatusPanelParams): void {
    this.params = params;
  }

  checkForUserRoles(): void {
    this.rolesFacade.userHasAccessToComparableTransactions$.subscribe(
      (hasAccessToComparableTransactions) =>
        (this.extendedDownloadEnabled = hasAccessToComparableTransactions)
    );
  }

  openExportToExcelDialog(): void {
    this.matDialog
      .open(ExportExcelModalComponent, {
        width: '80%',
        maxWidth: '863px',
        data: { extendedDownloadEnabled: this.extendedDownloadEnabled },
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
      ExportExcelNumberColumns.includes(colDef.field as ColumnFields)
    ) {
      return this.transformationService.transformNumberExcel(
        params.value,
        PercentColumns.includes(colDef.field as ColumnFields)
      );
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

    return result === Keyboard.DASH &&
      !DisplayDashForFalsyValueColumns.includes(
        params.column.getColDef().field as ColumnFields
      )
      ? undefined
      : result;
  }

  getSummarySheet(): string {
    const quotation: Quotation = this.params.context.quotation;
    const prependContent: ExcelRow[] = [
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

  addSummaryHeader(quotation: Quotation): ExcelRow[] {
    const createdOnDate = new Date(quotation.gqCreated).toLocaleDateString();
    const result: ExcelRow[] = [
      {
        cells: [
          this.getExcelCell(
            translate('shared.customStatusBar.excelExport.gqCase')
          ),
          this.getExcelCell(quotation.gqId.toString()),
        ],
      },
      {
        cells: [
          this.getExcelCell(
            translate('shared.customStatusBar.excelExport.gqCreated')
          ),
          this.getExcelCell(createdOnDate),
        ],
      },
      { cells: [] },
    ];

    if (quotation.sapId) {
      result.unshift({
        cells: [
          this.getExcelCell(
            translate('shared.customStatusBar.excelExport.sapQuote')
          ),
          this.getExcelCell(quotation.sapId),
        ],
      });
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

  addQuotationSummary(quotation: Quotation): ExcelRow[] {
    return [
      {
        cells: [
          this.getExcelCell(
            translate(
              'shared.customStatusBar.excelExport.quotationSummary.title'
            ),
            excelStyleObjects.excelTextBold.id
          ),
        ],
      },
      {
        cells: [
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
      },
      {
        cells: [
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
      },
      {
        hidden: this.isUndefinedOrNull(quotation?.partnerRole?.id),
        cells: [
          {
            data: {
              type: typeString,
              value: translate(
                'shared.customStatusBar.excelExport.quotationSummary.partnerRoleNumber'
              ),
            },
            styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
          },
          {
            data: {
              type: typeString,
              value: quotation?.partnerRole?.id,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
      },
      {
        hidden: this.isUndefinedOrNull(quotation?.partnerRole?.name),
        cells: [
          {
            data: {
              type: typeString,
              value: translate(
                'shared.customStatusBar.excelExport.quotationSummary.partnerRoleName'
              ),
            },
            styleId: excelStyleObjects.excelQuotationSummaryLabel.id,
          },
          {
            data: {
              type: typeString,
              value: quotation?.partnerRole?.name,
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
      },
      {
        cells: [
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
              value: this.transformationService.transformNumberCurrency(
                this.quotationDetailsSummaryKpi?.totalNetValue,
                quotation.currency
              ),
            },
            styleId: excelStyleObjects.excelTextBorderBold.id,
          },
        ],
      },
      {
        cells: [
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
              value: this.transformationService.transformPercentage(
                this.quotationDetailsSummaryKpi?.totalWeightedAverageGpm,
                false
              ),
            },
            styleId: excelStyleObjects.excelTextBorderBold.id,
          },
        ],
      },
      {
        cells: [
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
              value: this.transformationService.transformPercentage(
                this.quotationDetailsSummaryKpi?.totalWeightedAverageGpi,
                false
              ),
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
      },
      {
        cells: [
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
              value: this.transformationService.transformPercentage(
                this.quotationDetailsSummaryKpi?.totalWeightedAveragePriceDiff,
                false
              ),
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
      },
      {
        cells: [
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
      },
      {
        cells: [],
      },
    ];
  }

  addCustomerOverview(quotation: Quotation): ExcelRow[] {
    const { customer } = quotation;
    const lastYear = getLastYear();
    const currentYear = getCurrentYear();

    return [
      {
        cells: [
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
      },
      {
        cells: [
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
      },
      {
        cells: [
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
      },
      {
        cells: [
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
      },
      {
        cells: [
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
              value: this.transformationService.transformNumberCurrency(
                customer.marginDetail?.netSalesLastYear,
                customer.currency
              ),
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
      },
      {
        cells: [
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
              value: this.transformationService.transformPercentage(
                customer.marginDetail?.gpiLastYear
              ),
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
      },
      {
        cells: [
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
              value: this.transformationService.transformNumberCurrency(
                customer.marginDetail?.currentNetSales,
                customer.currency
              ),
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
      },
      {
        cells: [
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
              value: this.transformationService.transformPercentage(
                customer.marginDetail?.currentGpi
              ),
            },
            styleId: excelStyleObjects.excelTextBorder.id,
          },
        ],
      },
      {
        cells: [
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
      },
      {
        cells: [
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
      },
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

  addComparableTransactions(): ExcelRow[] {
    const headerTranslations: { [key: string]: string } =
      this.translocoService.translateObject(
        'shared.customStatusBar.excelExport.extendedComparableLinkedTransactions',
        {},
        ''
      );

    return [
      { cells: this.addCustomHeader(headerTranslations) },
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

  addExtendedSapPriceConditionDetails(): ExcelRow[] {
    const headerTranslations: { [key: string]: string } =
      this.translocoService.translateObject(
        'shared.customStatusBar.excelExport.extendedSapPriceConditionDetails',
        {},
        ''
      );

    return [
      { cells: this.addCustomHeader(headerTranslations) },
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
  ): ExcelRow[] {
    return values.map(
      (
        t: ExtendedComparableLinkedTransaction | ExtendedSapPriceConditionDetail
      ) => {
        const row: ExcelRow = { cells: [] };
        for (const key in headersTranslations) {
          row.cells.push(
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
    } else if (ExportExcelNumberColumns.includes(key as ColumnFields)) {
      return this.transformationService.transformNumberExcel(
        value as number,
        PercentColumns.includes(key as ColumnFields)
      );
    } else if (DateColumns.includes(key as SapPriceDetailsColumnFields)) {
      return this.transformationService.transformDate(value.toString());
    } else {
      switch (key) {
        case SapPriceDetailsColumnFields.SAP_PRICING_UNIT: {
          return value === 0 ? '' : value.toString();
        }
        case SapPriceDetailsColumnFields.SAP_CONDITION_UNIT: {
          const pipe = new UomPipe();

          return pipe.transform(value as string);
        }
        case SapPriceDetailsColumnFields.SAP_AMOUNT: {
          if (
            'calculationType' in t &&
            t.calculationType === CalculationType.ABSOLUT
          ) {
            return this.transformationService.transformNumberCurrency(
              +this.transformationService.transformNumber(+value, true),
              this.params.context.quotation.currency
            );
          }

          return this.transformationService.transformPercentage(Number(value));
        }
        default: {
          return value.toString();
        }
      }
    }
  }

  appendQuotationCurrency(key: string): string {
    return `${key} [${this.params.context.quotation.currency}]`;
  }

  isUndefinedOrNull(value: string) {
    return value === undefined || value === null;
  }

  private getProcessCaseSheet(): string {
    const excelParams = this.getExcelExportParams();

    return this.params.api.getSheetDataForExcel(excelParams);
  }

  public getExcelExportParams(): ExcelExportParams {
    const columnKeys = this.params.api
      .getAllDisplayedColumns()
      .map((col) => col.getColId())
      // remove controls column from export
      .filter((col) => col !== 'ag-Grid-ControlsColumn');

    // mspBlock is a hidden column in the grid, but required in the export
    if (columnKeys.includes(ColumnFields.MSP) && this.isMspWarningPresent) {
      const mspIndex = columnKeys.indexOf(ColumnFields.MSP);
      // insert MSP_BLOCK after MSP
      columnKeys.splice(mspIndex + 1, 0, ColumnFields.MSP_BLOCK);
    }

    return {
      columnKeys,
      allColumns: false,
      sheetName: 'Guided Quoting',
      skipColumnHeaders: false,
      processCellCallback: (params: ProcessCellForExportParams) =>
        this.processCellCallback(params),
      processHeaderCallback: (params: ProcessHeaderForExportParams) =>
        this.processHeaderCallback(params),
    };
  }
}
