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
  Column,
  ColumnApi,
  ColumnState,
  ExcelRow,
  RowClassParams,
  RowNode,
} from 'ag-grid-community';
import { ColDef, ExcelCell, GridApi, SideBarDef } from 'ag-grid-enterprise';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { StringOption } from '@schaeffler/inputs';

import {
  MaterialClass,
  NavigationLevel,
  SAP_SUPPLIER_IDS,
  Status,
} from '@mac/msd/constants';
import {
  DEFAULT_COLUMN_DEFINITION,
  SIDE_BAR_CONFIG,
} from '@mac/msd/main-table/table-config';
import { DataResult } from '@mac/msd/models';
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
  materialDialogOpened,
  minimizeDialog,
  openDialog,
} from '@mac/msd/store/actions/dialog';
import { DataFacade } from '@mac/msd/store/facades/data';

import { EDITABLE_MATERIAL_CLASSES } from '../constants/editable-material-classes';
import { getStatus } from './util';

/* eslint-disable max-lines */
@Component({
  selector: 'mac-main-table',
  templateUrl: './main-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTableComponent implements OnInit, OnDestroy, AfterViewInit {
  public optionsLoading$ = this.dataFacade.optionsLoading$;
  public resultLoading$ = this.dataFacade.resultLoading$;
  public result$ = this.dataFacade.result$;
  public resultCount$ = this.dataFacade.resultCount$;

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

  private visibleColumns: string[];
  public agGridTooltipDelay = 500;

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
        if (this.agGridApi && !filterModel) {
          this.agGridApi.setFilterModel(filterModel);
        }
      });

    this.agGridConfigService.columnDefinitions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((columnDefs) => {
        this.defaultColumnDefs = columnDefs;
        this.columnDefs = this.getColumnDefs(this.hasEditorRole);
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
      this.setParamAgGridFilter(decodeURIComponent(agGridFilterString));
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

  public onGridReady({
    api,
    columnApi,
  }: {
    api: GridApi;
    columnApi: ColumnApi;
  }): void {
    this.agGridApi = api;
    this.agGridColumnApi = columnApi;

    this.setAgGridFilter({ api });

    const filteredResult: DataResult[] = [];
    api.forEachNodeAfterFilter((rowNode: RowNode) => {
      filteredResult.push(rowNode.data);
    });
    const state = this.agGridStateService.getColumnState();
    if (state) {
      columnApi.applyColumnState({ state, applyOrder: true });
    }

    this.setVisibleColumns();

    this.agGridReadyService.agGridApiready(
      this.agGridApi,
      this.agGridColumnApi
    );
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
      getCustomContentBelowRow: this.splitRowsForMultipleSapIdsInExport,
      processCellCallback: this.reduceSapIdsForFirstRowInExport,
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

  private readonly splitRowsForMultipleSapIdsInExport = (
    params: any
  ): ExcelRow[] => {
    const rowNode: RowNode = params.node;
    const data = rowNode.data;

    const result: ExcelRow[] = [];

    if (data.sapSupplierIds?.length > 1) {
      for (let i = 1; i < data.sapSupplierIds.length; i += 1) {
        const cells: ExcelCell[] = [];
        const keys = Object.keys(data)
          .filter((key) => this.visibleColumns.includes(key))
          .sort(
            (a: string, b: string) =>
              this.visibleColumns.indexOf(a) - this.visibleColumns.indexOf(b)
          );
        for (const key of keys) {
          if (key === SAP_SUPPLIER_IDS) {
            cells.push({
              data: {
                type: 'String',
                value: data[key][i].toString(),
              },
            });
          } else {
            cells.push({
              data: {
                type: 'String',
                value: data[key]?.toString() || '',
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

  private reduceSapIdsForFirstRowInExport(params: any): string {
    const column: Column = params.column;

    return column.getColId() === SAP_SUPPLIER_IDS &&
      params.node.data[SAP_SUPPLIER_IDS]?.length > 1
      ? params.node.data[SAP_SUPPLIER_IDS][0].toString()
      : params.value?.toString() || '';
  }

  public editableClass = (materialClass: MaterialClass): boolean =>
    EDITABLE_MATERIAL_CLASSES.includes(materialClass);

  public getColumnDefs = (hasEditorRole: boolean): ColDef[] =>
    this.defaultColumnDefs?.map((columnDef) => ({
      ...columnDef,
      headerName: translate(
        `materialsSupplierDatabase.mainTable.columns.${columnDef.field}`
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
      .afterOpened()
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe(() => {
        this.dataFacade.dispatch(materialDialogOpened());
      });

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
}
