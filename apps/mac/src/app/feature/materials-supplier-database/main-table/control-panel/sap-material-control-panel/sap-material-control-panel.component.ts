import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { take } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { LetDirective } from '@ngrx/component';
import {
  ColDef,
  ExcelCell,
  ModelUpdatedEvent,
  ProcessCellForExportParams,
} from 'ag-grid-enterprise';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  MsdAgGridReadyService,
  MsdDialogService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { EMISSION_FACTOR_KG, EMISSION_FACTOR_PC } from '@mac/msd/constants';

import { BaseControlPanelComponent } from '../base-control-panel.component';

@Component({
  selector: 'mac-sap-material-control-panel',
  imports: [
    // default
    CommonModule,
    // angular material
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    LetDirective,
  ],
  templateUrl: './sap-material-control-panel.component.html',
})
export class SapMaterialControlPanelComponent
  extends BaseControlPanelComponent
  implements OnInit, OnDestroy
{
  public readonly LIMIT_EXPORT_ROW_COUNT = 100_000;
  public sapMaterialsRows$ = this.dataFacade.sapMaterialsRows$;

  private readonly DEFAULT_BLOCK_SIZE = 100;
  private hasUploaderRole = false;

  public constructor(
    protected readonly dataFacade: DataFacade,
    protected readonly agGridReadyService: MsdAgGridReadyService,
    protected readonly datePipe: DatePipe,
    protected readonly applicationInsightsService: ApplicationInsightsService,
    protected readonly dialogService: MsdDialogService
  ) {
    super(
      dataFacade,
      agGridReadyService,
      datePipe,
      applicationInsightsService,
      dialogService
    );
    this.dataFacade.hasMatnrUploaderRole$
      .pipe(take(1))
      .subscribe((hasRole) => (this.hasUploaderRole = hasRole));
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public reload(): void {
    this.agGridApi?.refreshServerSide();
  }

  public openUploadDialog(): void {
    this.dialogService
      .openSapMaterialsUploadDialog()
      .afterClosed()
      .pipe(take(1))
      .subscribe(({ openStatusDialog }: { openStatusDialog: boolean }) => {
        if (openStatusDialog) {
          this.openUploadStatusDialog();
        }
      });
  }

  public exportExcelSapMaterials(): void {
    this.applicationInsightsService.logEvent('[MAC - MSD] Export Excel MATNR');
    const maxIndex = this.agGridApi.getDisplayedRowCount() - 1;
    let rowIndex = 0;
    const chunkSize = 500;

    // event handler function to load all data chunks
    const eventHandler = (_event: ModelUpdatedEvent) => {
      rowIndex = Math.min(maxIndex, rowIndex + chunkSize);
      // once data is available, create the excel file

      if (rowIndex >= maxIndex) {
        this.agGridApi.removeEventListener('modelUpdated', eventHandler);
        // reset default block size
        this.snackBarInfo('end');
        this.exportDataAsExcel();
        this.agGridApi.updateGridOptions({
          cacheBlockSize: this.DEFAULT_BLOCK_SIZE,
        });
      } else {
        const percent = Math.round((rowIndex / maxIndex) * 100);
        this.snackBarInfo('progress', { percent });
        this.agGridApi.ensureIndexVisible(rowIndex - 1, 'bottom');
      }
    };
    // drop all data and start at line one
    this.agGridApi.applyServerSideRowData({
      startRow: 0,
      successParams: { rowData: [] },
    });
    this.agGridApi.updateGridOptions({ cacheBlockSize: chunkSize });
    this.agGridApi.addEventListener('modelUpdated', eventHandler);
    this.snackBarInfo('start');
  }

  private snackBarInfo(key: string, params?: any) {
    this.dataFacade.infoSnackBar(
      translate(
        `materialsSupplierDatabase.mainTable.excelExport.info.${key}`,
        params
      )
    );
  }

  private exportDataAsExcel() {
    const visibleColumns = this.getVisibleColumns();
    const columnList: ColDef[] = [
      ...visibleColumns.map((col) => this.agGridApi.getColumnDef(col)),
      ...this.agGridApi
        .getColumnDefs()
        .filter((column: ColDef) => !visibleColumns.includes(column.field)),
    ].filter((column: ColDef) => !this.NON_EXCEL_COLUMNS.has(column.field));
    // list of columns to add to export
    const columnKeys = columnList.map((column) => column.field);
    // get list of column headers (translated)
    const headerCells = columnList
      .map((column) => column.headerName)
      .map(this.toExcelCell('header'));
    // get second header row, column descriptions
    const descriptionCells = columnList
      .map((column) =>
        column.headerTooltip
          ? translate(
              `materialsSupplierDatabase.mainTable.tooltip.${column.headerTooltip}`
            )
          : undefined
      )
      .map(this.toExcelCell('hint'));

    // Create the excel file
    const dateString = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.agGridApi.exportDataAsExcel({
      columnKeys,
      prependContent: [{ cells: headerCells }, { cells: descriptionCells }],
      skipColumnHeaders: true,
      skipColumnGroupHeaders: true,
      author: translate(
        'materialsSupplierDatabase.mainTable.excelExport.author'
      ),
      fileName: `${dateString}${translate(
        'materialsSupplierDatabase.mainTable.excelExport.matNrFileNameSuffix'
      )}`,
      sheetName: translate(
        'materialsSupplierDatabase.mainTable.excelExport.matNrSheetName'
      ),

      processCellCallback: this.hasUploaderRole
        ? this.getFormattedCellValue
        : this.getFormattedCellValueNonUploader,
    });
  }

  // needed to duplicate code as [this] is not available in callback function
  private getFormattedCellValue(params: ProcessCellForExportParams) {
    if (params.column.getColDef().useValueFormatterForExport ?? true) {
      return params.formatValue(params.value);
    }

    return params.value;
  }

  private getFormattedCellValueNonUploader(params: ProcessCellForExportParams) {
    const columnName = params.column.getColId();
    if (
      (columnName === EMISSION_FACTOR_KG ||
        columnName === EMISSION_FACTOR_PC) &&
      params.node.data['maturity'] < 5
    ) {
      return '---';
    }
    if (params.column.getColDef().useValueFormatterForExport ?? true) {
      return params.formatValue(params.value);
    }

    return params.value;
  }

  private toExcelCell(style: string): (value: string) => ExcelCell {
    // transform text to ExcelCell Objects
    return (value: string) =>
      ({
        data: { type: 'String', value },
        styleId: style,
      }) as ExcelCell;
  }

  private openUploadStatusDialog(): void {
    this.dialogService
      .openSapMaterialsUploadStatusDialog()
      .afterClosed()
      .pipe(take(1))
      .subscribe(({ openNewDialog }: { openNewDialog: boolean }) => {
        if (openNewDialog) {
          this.openUploadDialog();
        }
      });
  }
}
