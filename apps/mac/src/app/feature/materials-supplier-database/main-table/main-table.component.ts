/* eslint-disable max-lines */
import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import {
  ColDef,
  ColumnApi,
  ColumnState,
  ExcelCell,
  ExcelRow,
  GridApi,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  ProcessCellForExportParams,
  ProcessRowGroupForExportParams,
  RowClassParams,
  RowNode,
  SideBarDef,
  ValueGetterParams,
} from 'ag-grid-enterprise';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { StringOption } from '@schaeffler/inputs';

import {
  ACTION,
  HISTORY,
  LAST_MODIFIED,
  MaterialClass,
  NavigationLevel,
  RECENT_STATUS,
  RELEASE_DATE,
  RELEASED_STATUS,
  SAP_SUPPLIER_IDS,
  Status,
} from '@mac/msd/constants';
import {
  DEFAULT_COLUMN_DEFINITION,
  SIDE_BAR_CONFIG,
} from '@mac/msd/main-table/table-config';
import {
  RELEASE_DATE_VALUE_GETTER,
  STATUS_VALUE_GETTER,
} from '@mac/msd/main-table/table-config/helpers';
import { DataResult, SAPMaterial } from '@mac/msd/models';
import {
  MsdAgGridConfigService,
  MsdAgGridReadyService,
  MsdAgGridStateService,
  MsdDialogService,
} from '@mac/msd/services';
import {
  fetchClassOptions,
  fetchResult,
  setAgGridColumns,
  setAgGridFilter,
  setNavigation,
} from '@mac/msd/store/actions/data';
import {
  materialDialogCanceled,
  minimizeDialog,
  openDialog,
} from '@mac/msd/store/actions/dialog';
import { DataFacade } from '@mac/msd/store/facades/data';

import { EDITABLE_MATERIAL_CLASSES } from '../constants/editable-material-classes';
import { DetailCellRendererComponent } from './detail-cell-renderer/detail-cell-renderer.component';
import { getStatus } from './util';

/* eslint-disable max-lines */
@Component({
  selector: 'mac-main-table',
  templateUrl: './main-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTableComponent implements OnInit, OnDestroy, AfterViewInit {
  // master detail cell renderer
  public detailCellRenderer = DetailCellRendererComponent;

  public optionsLoading$ = this.dataFacade.optionsLoading$;
  public resultLoading$ = this.dataFacade.resultLoading$;
  public result$ = this.dataFacade.result$;
  public resultCount$ = this.dataFacade.resultCount$;
  public sapMaterialsRows$ = this.dataFacade.sapMaterialsRows$;

  public hasEditorRole$ = this.dataFacade.hasEditorRole$;

  public hasMinimizedDialog$ = this.dataFacade.hasMinimizedDialog$;

  public selectedClass: string;

  public destroy$ = new Subject<void>();

  public hasEditorRole: boolean;
  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public defaultColumnDefs: ColDef[];
  public columnDefs: ColDef[];
  public sidebar: SideBarDef = SIDE_BAR_CONFIG;
  public navigation$ = this.dataFacade.navigation$;
  public expandedClass = MaterialClass.STEEL;

  private agGridApi!: GridApi;
  private agGridColumnApi!: ColumnApi;

  private restoredColumnState: ColumnState[];

  private visibleColumns: string[];

  // collect columns which are not really in the dataset but rendered by ag grid
  private readonly META_COLUMNS = [RELEASED_STATUS, HISTORY, ACTION];
  private readonly NON_EXCEL_COLUMNS = new Set([
    '',
    RECENT_STATUS,
    HISTORY,
    ACTION,
  ]);

  public agGridTooltipDelay = 500;

  public serverSideRowData!: SAPMaterial[];

  public constructor(
    private readonly dataFacade: DataFacade,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly agGridStateService: MsdAgGridStateService,
    private readonly agGridReadyService: MsdAgGridReadyService,
    private readonly datePipe: DatePipe,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly dialogService: MsdDialogService,
    private readonly agGridConfigService: MsdAgGridConfigService
  ) {}

  public ngOnInit(): void {
    this.hasEditorRole$
      .pipe(take(1))
      .subscribe((hasEditorRole) => (this.hasEditorRole = hasEditorRole));

    this.dataFacade.dispatch(fetchClassOptions());

    this.dataFacade.agGridFilter$
      .pipe(takeUntil(this.destroy$))
      .subscribe((filterModel: { [key: string]: any }) => {
        if (this.agGridApi && filterModel) {
          this.agGridApi.setFilterModel(filterModel);
        }
      });

    this.agGridConfigService.columnDefinitions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ defaultColumnDefinitions, savedColumnState }) => {
        // restore state from last session
        // ignore the previous state of all 'lockVisible' columns, those have a default!
        const locked = new Set(
          defaultColumnDefinitions
            .filter((c) => c.lockVisible)
            .map((c) => c.field)
        );
        this.restoredColumnState = savedColumnState?.filter(
          (s) => !locked.has(s.colId)
        );

        this.defaultColumnDefs = defaultColumnDefinitions;
        this.columnDefs = this.getColumnDefs(this.hasEditorRole);
        if (this.agGridColumnApi) {
          setTimeout(() =>
            this.agGridColumnApi.applyColumnState({
              state: this.restoredColumnState,
              applyOrder: true,
            })
          );
        }
      });
  }

  public ngAfterViewInit(): void {
    this.parseQueryParams();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private parseQueryParams(): void {
    const materialClass: MaterialClass = this.route.snapshot.queryParamMap.get(
      'materialClass'
    ) as MaterialClass;
    const navigationLevel: NavigationLevel =
      this.route.snapshot.queryParamMap.get(
        'navigationLevel'
      ) as NavigationLevel;
    const agGridFilterString =
      this.route.snapshot.queryParamMap.get('agGridFilter');

    if (materialClass && navigationLevel) {
      this.expandedClass = materialClass;
      this.dataFacade.dispatch(
        setNavigation({ materialClass, navigationLevel })
      );
    }
    if (agGridFilterString) {
      this.setParamAgGridFilter(agGridFilterString);
    }

    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  private setParamAgGridFilter(filterModelString: string): void {
    const filterModel = JSON.parse(filterModelString);
    if (!filterModel) {
      return;
    }
    this.dataFacade.dispatch(setAgGridFilter({ filterModel }));
  }

  public onFilterChange({ api }: { api: GridApi }): void {
    const filterModel = api.getFilterModel();

    this.dataFacade.dispatch(setAgGridFilter({ filterModel }));
  }

  public setAgGridFilter({ api }: { api: GridApi }): void {
    this.agGridApi = api;
    this.dataFacade.agGridFilter$
      .pipe(take(1))
      .subscribe((filterModel: { [key: string]: any }) => {
        if (filterModel) {
          api.setFilterModel(filterModel);
        }
      });
  }

  public compareStringOptions(a: StringOption, b: StringOption) {
    return !!a && !!b && a.id === b.id && a.title === b.title;
  }

  public fetchResult(): void {
    this.dataFacade.dispatch(fetchResult());
  }

  public onGridReady(
    {
      api,
      columnApi,
    }: {
      api: GridApi;
      columnApi: ColumnApi;
    },
    serverSide = false
  ): void {
    this.agGridApi = api;
    this.agGridColumnApi = columnApi;

    this.setAgGridFilter({ api });
    this.setVisibleColumns();

    this.agGridReadyService.agGridApiready(
      this.agGridApi,
      this.agGridColumnApi
    );

    if (this.restoredColumnState) {
      columnApi.applyColumnState({
        state: this.restoredColumnState,
        applyOrder: true,
      });
    }
    if (serverSide) {
      const datasource = this.createServerSideDataSource(
        this.agGridReadyService
      );
      api.setServerSideDatasource(datasource);
    }
  }

  public onColumnChange({ columnApi }: { columnApi: ColumnApi }): void {
    const agGridColumns = columnApi.getColumnState();
    this.agGridStateService.setColumnState(agGridColumns);
    this.dataFacade.dispatch(
      setAgGridColumns({ agGridColumns: JSON.stringify(agGridColumns) })
    );
    this.setVisibleColumns();
  }

  public resetAgGridFilter(): void {
    if (this.agGridApi) {
      // eslint-disable-next-line unicorn/no-null
      this.agGridApi.setFilterModel(null);
      this.agGridApi.onFilterChanged();
    }
  }

  public resetAgGridColumnConfiguration(): void {
    if (this.agGridColumnApi) {
      this.hasEditorRole$.pipe(take(1)).subscribe((hasEditorRole) => {
        const state = this.getColumnDefs(hasEditorRole).map(
          (column: ColDef) =>
            ({
              colId: column.field,
            } as ColumnState)
        );
        this.agGridColumnApi.applyColumnState({ state, applyOrder: true });
        this.setVisibleColumns();
      });
    }
  }

  public applyAgGridFilter(column: string, fullValues: string[]): void {
    const values: string[] = fullValues.filter(Boolean);
    if (this.agGridApi) {
      const filterInstance = this.agGridApi.getFilterInstance(column);
      // eslint-disable-next-line unicorn/no-null
      let filterValue: { values: string[] } = null;
      if (values.length > 0) {
        filterValue = { values };
      }
      filterInstance.setModel(filterValue);
      this.agGridApi.onFilterChanged();
    }
  }

  public resetForm(): void {
    if (!this.isDefaultAgGridFilter()) {
      this.resetAgGridFilter();
    }
  }

  public isDefaultAgGridFilter(): boolean {
    return !(
      this.agGridApi &&
      this.agGridApi.getFilterModel() &&
      Object.keys(this.agGridApi.getFilterModel()).length > 0
    );
  }

  public exportExcel(): void {
    if (!this.agGridApi) {
      return;
    }
    this.applicationInsightsService.logEvent('[MAC - MSD] Export Excel');

    const dateString = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const columns = this.visibleColumns.filter(
      (columnName) => !this.NON_EXCEL_COLUMNS.has(columnName)
    );

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
      getCustomContentBelowRow: this.splitRowsForMultipleSapIdsInExportFactory(
        this.getCellValue
      ),
      processCellCallback: this.excelExportProcessCellCallbackFactory(
        this.getCellValue
      ),
    });
  }

  private setVisibleColumns(): void {
    if (!this.agGridColumnApi) {
      return;
    }
    this.visibleColumns = this.agGridColumnApi
      .getColumnState()
      .filter((columnState: ColumnState) => !columnState.hide)
      .map((columnState: ColumnState) => columnState.colId);
  }

  private splitRowsForMultipleSapIdsInExportFactory(
    getCellValueFn: (columnName: string, value?: any) => string
  ) {
    return (params: ProcessRowGroupForExportParams): ExcelRow[] => {
      const rowNode: RowNode = params.node;
      const data = rowNode.data;

      const result: ExcelRow[] = [];

      if (data.sapSupplierIds?.length > 1) {
        for (let i = 1; i < data.sapSupplierIds.length; i += 1) {
          const cells: ExcelCell[] = [];
          const keys = [
            ...this.META_COLUMNS.filter(
              (column) => !this.NON_EXCEL_COLUMNS.has(column)
            ),
            ...Object.keys(data),
          ]
            // since the raw object does not have the RELEASE_DATE key we insert it in place of the year in case it is visible
            .map((key) => (key === 'releaseDateYear' ? RELEASE_DATE : key))
            .filter((key) => this.visibleColumns.includes(key))
            .sort(
              (a: string, b: string) =>
                this.visibleColumns.indexOf(a) - this.visibleColumns.indexOf(b)
            );
          for (const key of keys) {
            switch (key) {
              case SAP_SUPPLIER_IDS:
                cells.push({
                  data: {
                    type: 'String',
                    value: getCellValueFn(key, data[key][i]),
                  },
                });
                break;
              case RELEASE_DATE:
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
              case RELEASED_STATUS:
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
              default:
                cells.push({
                  data: {
                    type: 'String',
                    value: getCellValueFn(key, data[key]),
                  },
                });
            }
          }
          const row: ExcelRow = { cells };
          result.push(row);
        }
      }

      return result;
    };
  }

  private excelExportProcessCellCallbackFactory(
    getCellValueFn: (columnName: string, value?: any) => string
  ) {
    return (params: ProcessCellForExportParams) => {
      const columnName = params.column.getColId();

      const value =
        columnName === SAP_SUPPLIER_IDS &&
        params.node.data[SAP_SUPPLIER_IDS]?.length > 1
          ? params.node.data[SAP_SUPPLIER_IDS][0]
          : params.value;

      return getCellValueFn(columnName, value);
    };
  }

  private getCellValue(columnName: string, value?: any): string {
    switch (columnName) {
      case RELEASED_STATUS:
        return value?.toString() || Status.DEFAULT.toString();
      case LAST_MODIFIED:
        return value
          ? new Date(value * 1000).toLocaleDateString('en-GB').toString()
          : '';
      case RELEASE_DATE:
        return value ? new Date(value)?.toLocaleDateString('en-GB') || '' : '';
      default:
        return value?.toString() || '';
    }
  }

  public editableClass = (materialClass: MaterialClass): boolean =>
    EDITABLE_MATERIAL_CLASSES.includes(materialClass);

  public getColumnDefs = (hasEditorRole: boolean): ColDef[] =>
    this.defaultColumnDefs?.map((columnDef) => ({
      ...columnDef,
      headerName: translate(
        `materialsSupplierDatabase.mainTable.columns.${columnDef.headerName}`
      ),
      cellRendererParams: {
        hasEditorRole,
      },
    })) ?? [];

  public isBlockedRow(params: RowClassParams): boolean {
    return (
      getStatus(params.data?.blocked, params.data?.lastModified) ===
      Status.BLOCKED
    );
  }

  public isRecentlyChangedRow(params: RowClassParams): boolean {
    return (
      getStatus(params.data?.blocked, params.data?.lastModified) ===
      Status.CHANGED
    );
  }

  public resumeDialog(): void {
    this.openDialog(true);
  }

  public openDialog(isResumeDialog?: boolean): void {
    this.dataFacade.dispatch(openDialog());
    const dialogRef = this.dialogService.openDialog(isResumeDialog);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe(({ reload, minimize }) => {
        if (reload) {
          this.fetchResult();
        }
        if (minimize) {
          this.dataFacade.dispatch(minimizeDialog(minimize));
        } else if (!reload) {
          this.dataFacade.dispatch(materialDialogCanceled());
        }
      });
  }

  public createServerSideDataSource(
    service: MsdAgGridReadyService
  ): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams<SAPMaterial>): void => {
        service.setParams(params);
      },
      destroy: () => {
        service.unsetParams();
      },
    } as IServerSideDatasource;
  }

  public refreshServerSide(): void {
    this.agGridApi?.refreshServerSide();
  }
}
