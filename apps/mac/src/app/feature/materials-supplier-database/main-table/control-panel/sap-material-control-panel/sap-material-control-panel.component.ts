import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { take } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import {
  ColDef,
  ExcelCell,
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
  standalone: true,
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
    PushPipe,
    LetDirective,
  ],
  templateUrl: './sap-material-control-panel.component.html',
})
export class SapMaterialControlPanelComponent
  extends BaseControlPanelComponent
  implements OnInit, OnDestroy
{
  public readonly DEFAULT_BLOCK_SIZE = 100;
  public readonly EXPORT_BLOCK_SIZE = 100_000;

  public sapMaterialsRows$ = this.dataFacade.sapMaterialsRows$;
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
    this.applicationInsightsService.logEvent('[MAC - MSD] Export Excel');
    // event handler function to create the excel file
    const eventHandler = () => {
      this.agGridApi.removeEventListener('modelUpdated', eventHandler);
      // get a sorted list of all columns, starting with visible columns
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
      // reset default block size
      this.agGridApi.updateGridOptions({
        cacheBlockSize: this.DEFAULT_BLOCK_SIZE,
      });
    };
    // increasing block size, forcing a data reload
    this.agGridApi.updateGridOptions({
      cacheBlockSize: this.EXPORT_BLOCK_SIZE,
    });
    // once data is available, create the excel file
    this.agGridApi.addEventListener('modelUpdated', eventHandler);
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
