import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { take } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import {
  ExcelCell,
  ExcelRow,
  IRowNode,
  ProcessCellForExportParams,
  ProcessRowGroupForExportParams,
  ValueGetterParams,
} from 'ag-grid-enterprise';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EDITABLE_MATERIAL_CLASSES } from '@mac/feature/materials-supplier-database/constants/editable-material-classes';
import { DataResult } from '@mac/feature/materials-supplier-database/models';
import {
  MsdAgGridReadyService,
  MsdDialogService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import {
  ACTION,
  HISTORY,
  LAST_MODIFIED,
  MANUFACTURER_SUPPLIER_SAPID,
  NavigationLevel,
  RECENT_STATUS,
  RELEASE_DATE,
  RELEASED_STATUS,
  Status,
} from '@mac/msd/constants';

import {
  RELEASE_DATE_VALUE_GETTER,
  STATUS_VALUE_GETTER,
} from '../../table-config/helpers';
import { BaseControlPanelComponent } from '../base-control-panel.component';

@Component({
  selector: 'mac-raw-material-control-panel',
  standalone: true,
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
  public isBulkEditAllowed$ = this.dataFacade.isBulkEditAllowed$;
  public hasMinimizedDialog$ = this.dataFacade.hasMinimizedDialog$;
  public resultCount$ = this.dataFacade.resultCount$;

  // collect columns which are not really in the dataset but rendered by ag grid
  private readonly META_COLUMNS = [
    RELEASED_STATUS,
    RECENT_STATUS,
    HISTORY,
    ACTION,
  ];
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

    this.navigation$.subscribe((navigation) => {
      this.isEditable =
        this.hasEditorRole &&
        EDITABLE_MATERIAL_CLASSES.includes(navigation.materialClass) &&
        navigation.navigationLevel !== NavigationLevel.PRODUCT_CATEGORY_RULES;
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

  // TO DO replace with pipe / event and property / or similar
  public countSelectedNodes(): number {
    return this.agGridApi?.getSelectedNodes().length;
  }

  public reload(): void {
    this.dataFacade.fetchResult();
  }

  public exportExcelRawMaterials(): void {
    if (!this.agGridApi) {
      return;
    }
    this.applicationInsightsService.logEvent('[MAC - MSD] Export Excel');
    const visibleColumns = this.getVisibleColumns();

    const dateString = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const columns = visibleColumns.filter(
      (columnName) => !this.NON_EXCEL_COLUMNS.has(columnName)
    );

    // add additional content only if column is visible
    const isSapIdVisible = columns.includes(MANUFACTURER_SUPPLIER_SAPID);

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
      // split rows and add sap data
      getCustomContentBelowRow: isSapIdVisible
        ? this.splitRowsForMultipleSapIdsInExportFactory(
            this.getCellValue,
            visibleColumns
          )
        : undefined,
      processCellCallback: isSapIdVisible
        ? this.excelExportRawProcessCellCallbackFactory(this.getCellValue)
        : undefined,
    });
  }

  private splitRowsForMultipleSapIdsInExportFactory(
    getCellValueFn: (columnName: string, value?: any) => string,
    visibleColumns: string[]
  ) {
    return (params: ProcessRowGroupForExportParams): ExcelRow[] => {
      const rowNode: IRowNode = params.node;
      const data = rowNode.data;

      const result: ExcelRow[] = [];

      if (data[MANUFACTURER_SUPPLIER_SAPID]?.length > 1) {
        for (let i = 1; i < data[MANUFACTURER_SUPPLIER_SAPID].length; i += 1) {
          const cells: ExcelCell[] = [];
          const keys = [
            ...this.META_COLUMNS.filter(
              (column) => !this.NON_EXCEL_COLUMNS.has(column)
            ),
            ...Object.keys(data),
          ]
            // since the raw object does not have the RELEASE_DATE key we insert it in place of the year in case it is visible
            .map((key) => (key === 'releaseDateYear' ? RELEASE_DATE : key))
            .filter((key) => visibleColumns.includes(key))
            .sort(
              (a: string, b: string) =>
                visibleColumns.indexOf(a) - visibleColumns.indexOf(b)
            );
          for (const key of keys) {
            switch (key) {
              case MANUFACTURER_SUPPLIER_SAPID: {
                cells.push({
                  data: {
                    type: 'String',
                    value: getCellValueFn(key, data[key][i]),
                  },
                });
                break;
              }
              case RELEASE_DATE: {
                cells.push({
                  data: {
                    type: 'String',
                    value: getCellValueFn(
                      key,
                      RELEASE_DATE_VALUE_GETTER({
                        data,
                      } as ValueGetterParams<DataResult>)
                    ),
                  },
                });
                break;
              }
              case RELEASED_STATUS: {
                cells.push({
                  data: {
                    type: 'String',
                    value: getCellValueFn(
                      key,
                      STATUS_VALUE_GETTER({
                        data,
                      } as ValueGetterParams<DataResult>)
                    ),
                  },
                });
                break;
              }
              default: {
                cells.push({
                  data: {
                    type: 'String',
                    value: getCellValueFn(key, data[key]),
                  },
                });
              }
            }
          }
          const row: ExcelRow = { cells };
          result.push(row);
        }
      }

      return result;
    };
  }

  private excelExportRawProcessCellCallbackFactory(
    getCellValueFn: (columnName: string, value?: any) => string
  ) {
    return (params: ProcessCellForExportParams) => {
      const columnName = params.column.getColId();

      const value =
        columnName === MANUFACTURER_SUPPLIER_SAPID &&
        params.node.data[MANUFACTURER_SUPPLIER_SAPID]?.length > 1
          ? params.node.data[MANUFACTURER_SUPPLIER_SAPID][0]
          : params.value;

      return getCellValueFn(columnName, value);
    };
  }

  private getCellValue(columnName: string, value?: any): string {
    switch (columnName) {
      case RELEASED_STATUS: {
        return value?.toString() || Status.DEFAULT.toString();
      }
      case LAST_MODIFIED: {
        return value
          ? new Date(value * 1000).toLocaleDateString('en-GB').toString()
          : '';
      }
      case RELEASE_DATE: {
        return value ? new Date(value)?.toLocaleDateString('en-GB') || '' : '';
      }
      default: {
        return value?.toString() || '';
      }
    }
  }
}
