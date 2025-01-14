import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { translate } from '@jsverse/transloco';
import {
  ColDef,
  ColumnApi,
  ColumnState,
  GridApi,
  RowClassParams,
  SideBarDef,
} from 'ag-grid-enterprise';

import {
  ACTION,
  HISTORY,
  RECENT_STATUS,
  RELEASED_STATUS,
  Status,
} from '@mac/msd/constants';
import {
  DEFAULT_COLUMN_DEFINITION,
  SIDE_BAR_CONFIG,
} from '@mac/msd/main-table/table-config';
import {
  MsdAgGridConfigService,
  MsdAgGridReadyService,
  MsdAgGridStateService,
} from '@mac/msd/services';
import { DataFacade } from '@mac/msd/store/facades/data';

import { QuickFilterFacade } from '../../store/facades/quickfilter';
import { DetailCellRendererComponent } from '../cell-renderers/detail-cell-renderer/detail-cell-renderer.component';
import { getStatus } from '../util';

@Component({
  selector: 'mac-base-datagrid',
  template: '',
  standalone: true,
  providers: [],
})
export abstract class BaseDatagridComponent implements OnInit, OnDestroy {
  // master detail cell renderer
  public detailCellRenderer = DetailCellRendererComponent;
  public destroy$ = new Subject<void>();

  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public defaultColumnDefs: ColDef[];
  public columnDefs: ColDef[];
  public sidebar: SideBarDef = SIDE_BAR_CONFIG;

  protected agGridApi!: GridApi;
  protected agGridColumnApi!: ColumnApi;

  protected restoredColumnState: ColumnState[];

  // collect columns which are not really in the dataset but rendered by ag grid
  protected readonly META_COLUMNS = [
    RELEASED_STATUS,
    RECENT_STATUS,
    HISTORY,
    ACTION,
  ];

  public constructor(
    protected readonly dataFacade: DataFacade,
    protected readonly agGridStateService: MsdAgGridStateService,
    protected readonly agGridReadyService: MsdAgGridReadyService,
    protected readonly agGridConfigService: MsdAgGridConfigService,
    protected readonly quickFilterFacade: QuickFilterFacade
  ) {}

  public ngOnInit(): void {
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
        this.restoredColumnState = savedColumnState?.map((s) =>
          locked.has(s.colId) ? { ...s, hide: false } : s
        );

        this.defaultColumnDefs = defaultColumnDefinitions;
        this.columnDefs = this.getColumnDefs();
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

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // AgGrid Events
  public onGridReady({
    api,
    columnApi,
  }: {
    api: GridApi;
    columnApi: ColumnApi;
  }): void {
    this.agGridApi = api;
    this.agGridColumnApi = columnApi;

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
  }

  public onColumnChange({ columnApi }: { columnApi: ColumnApi }): void {
    const agGridColumns = columnApi
      .getColumnState()
      .filter((cs) => !this.META_COLUMNS.includes(cs.colId));
    this.agGridStateService.setColumnState(agGridColumns);
    this.dataFacade.setAgGridColumns(JSON.stringify(agGridColumns));
  }

  public onFilterChange({ api }: { api: GridApi }): void {
    this.dataFacade.setAgGridFilter(api.getFilterModel());
  }

  // functions
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

  private getColumnDefs(): ColDef[] {
    const params = this.getCellRendererParams();

    return (
      this.defaultColumnDefs?.map((columnDef) => ({
        ...columnDef,
        headerName: translate(
          `materialsSupplierDatabase.mainTable.columns.${columnDef.headerName}`
        ),
        cellRendererParams: params,
      })) ?? []
    );
  }

  protected abstract getCellRendererParams(): any;
}
