import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { filter, take, takeUntil } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import { ProcessCellForExportParams } from 'ag-grid-enterprise';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EDITABLE_MATERIAL_CLASSES } from '@mac/feature/materials-supplier-database/constants/editable-material-classes';
import { SteelMaterial } from '@mac/feature/materials-supplier-database/models';
import {
  MsdAgGridReadyService,
  MsdDialogService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import {
  MANUFACTURER_SUPPLIER_SAPID,
  NavigationLevel,
  RELEASE_DATE,
} from '@mac/msd/constants';

import { BaseControlPanelComponent } from '../base-control-panel.component';

@Component({
  selector: 'mac-raw-material-control-panel',
  imports: [
    // default
    CommonModule,
    // angular material
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    PushPipe,
    LetDirective,
  ],
  templateUrl: './raw-material-control-panel.component.html',
})
export class RawMaterialControlPanelComponent
  extends BaseControlPanelComponent
  implements OnInit, OnDestroy
{
  public hasEditorRole = false;
  public isEditable = false;
  public selectedNodes = signal(0);
  public displayedRowCount = signal(0);
  public isBulkEditAllowed$ = this.dataFacade.isBulkEditAllowed$;
  public hasMinimizedDialog$ = this.dataFacade.hasMinimizedDialog$;
  public resultCount$ = this.dataFacade.resultCount$;

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
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.dataFacade.hasEditorRole$
      .pipe(take(1))
      .subscribe((hasEditorRole) => (this.hasEditorRole = hasEditorRole));

    this.navigation$.pipe(takeUntil(this.destroy$)).subscribe((navigation) => {
      this.isEditable =
        this.hasEditorRole &&
        EDITABLE_MATERIAL_CLASSES.includes(navigation.materialClass) &&
        navigation.navigationLevel !== NavigationLevel.PRODUCT_CATEGORY_RULES;
    });

    this.agGridReadyService.agGridApi$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe(({ gridApi }) => {
        gridApi.addEventListener('selectionChanged', (event) =>
          this.selectedNodes.set(event.api.getSelectedNodes()?.length)
        );
        gridApi.addEventListener('rowDataUpdated', (event) =>
          this.displayedRowCount.set(event.api.getDisplayedRowCount() || 0)
        );
        gridApi.addEventListener('filterChanged', (event) =>
          this.displayedRowCount.set(event.api.getDisplayedRowCount() || 0)
        );
      });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public resumeDialog(): void {
    this.openDialog(true);
  }

  public openDialog(isResumeDialog?: boolean): void {
    this.dialogService.openDialog(isResumeDialog);
  }

  public openDialogMultiEdit() {
    this.dialogService.openBulkEditDialog(this.agGridApi.getSelectedNodes());
  }

  public reload(): void {
    this.dataFacade.fetchResult();
  }

  public export(): void {
    this.applicationInsightsService.logEvent('[MAC - MSD] Export Excel RAW');
    const visibleColumns = this.getVisibleColumns();
    const dateString = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const columns = visibleColumns.filter(
      (columnName) => !this.NON_EXCEL_COLUMNS.has(columnName)
    );
    const isSapIdVisible = columns.includes(MANUFACTURER_SUPPLIER_SAPID);

    const orgData: SteelMaterial[] = this.agGridApi.getGridOption('rowData');
    // expand data set if supplier id is visible
    if (isSapIdVisible) {
      this.agGridApi.setGridOption('rowData', this.expandSupplierIds(orgData));
    }
    try {
      this.agGridApi.exportDataAsExcel({
        author: translate(
          'materialsSupplierDatabase.mainTable.excelExport.author'
        ),
        fileName: `${dateString}${translate(
          'materialsSupplierDatabase.mainTable.excelExport.fileNameSuffix'
        )}`,
        sheetName: translate(
          'materialsSupplierDatabase.mainTable.excelExport.sheetName'
        ),
        columnKeys: columns,
        processCellCallback: this.getFormattedCellValue,
      });
      // restore previous data
    } finally {
      if (isSapIdVisible) {
        this.agGridApi.setGridOption('rowData', orgData);
      }
    }
  }

  private getFormattedCellValue(params: ProcessCellForExportParams) {
    const columnName = params.column.getColId();
    if (columnName === RELEASE_DATE) {
      return params.value ? params.formatValue(params.value) : '';
    }
    if (params.column.getColDef().useValueFormatterForExport ?? true) {
      return params.formatValue(params.value);
    }

    return params.value;
  }

  private expandSupplierIds(materialData: any[]) {
    const newData: any[] = [];
    materialData.forEach((rowData) => {
      const sapIds: string[] = rowData[MANUFACTURER_SUPPLIER_SAPID];
      if (sapIds?.length > 1) {
        sapIds.forEach((sapId) =>
          newData.push({
            ...rowData,
            [MANUFACTURER_SUPPLIER_SAPID]: [sapId],
          })
        );
      } else {
        newData.push(rowData);
      }
    });

    return newData;
  }
}
