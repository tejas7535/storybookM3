import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  GridReadyEvent,
  RowClickedEvent,
  SortChangedEvent,
} from 'ag-grid-community';
import { ColDef, GridApi, GridOptions, SideBarDef } from 'ag-grid-enterprise';

import { getUserUniqueIdentifier } from '@schaeffler/azure-auth';

import { SalesSummary } from '../../shared/models/sales-summary.model';
import { AgGridStateService } from '../../shared/services/ag-grid-state/ag-grid-state.service';
import { DataService } from '../../shared/services/data/data.service';
import { SalesRowDetailsComponent } from '../sales-row-details/sales-row-details.component';
import { TimeoutWarningRendererComponent } from '../timeout-warning/timeout-warning-cellrenderer-component';
import { COLUMN_DEFINITIONS } from './config/column-definitions';
import { DEFAULT_COLUMN_DEFINITION } from './config/default-column-definitions';
import { GRID_OPTIONS } from './config/grid-options';
import { SIDE_BAR_CONFIG } from './config/sidebar-definition';

@Component({
  selector: 'sedo-sales-table',
  templateUrl: './sales-table.component.html',
})
export class SalesTableComponent implements OnInit, OnDestroy {
  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[] = COLUMN_DEFINITIONS;
  public sidebar: SideBarDef = SIDE_BAR_CONFIG;
  public gridOptions: GridOptions = GRID_OPTIONS;

  public detailCellRenderer: any;
  public detailCellRendererParams: { superUser: string };
  public frameworkComponents: any;

  public rowData: SalesSummary[];
  public visibleFilterForKeyUser = false;

  private username: string;
  private gridApi: GridApi;
  private readonly TABLE_KEY = 'soco';
  private readonly shutDown$$: Subject<void> = new Subject();

  public constructor(
    public dataService: DataService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly agGridStateService: AgGridStateService,
    private readonly store: Store
  ) {
    this.detailCellRenderer = 'rowDetails';
    this.frameworkComponents = {
      rowDetails: SalesRowDetailsComponent,
      warningsCellrenderer: TimeoutWarningRendererComponent,
    };
  }

  public async ngOnInit(): Promise<void> {
    this.setSubscription();
    this.rowData = await this.dataService.getAllSales();
    this.detailCellRendererParams = {
      superUser: await this.dataService.getSuperUser(),
    };

    this.visibleFilterForKeyUser = this.rowData.some(
      (item: SalesSummary) => item.keyUser === this.username
    );
  }

  private setSubscription(): void {
    this.store
      .select(getUserUniqueIdentifier)
      .pipe(takeUntil(this.shutDown$$))
      .subscribe((userId: string) => (this.username = userId));
  }

  public onRowClicked(event: RowClickedEvent): void {
    event.node.setExpanded(!event.node.expanded);
  }

  public onFirstDataRendered(params: any): void {
    this.gridApi = params.api;

    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams.combinedKey) {
      const filterModel = params.api.getFilterInstance('combinedKey');
      filterModel.setModel({ values: [queryParams.combinedKey] });
      params.api.onFilterChanged();
      params.api.getDisplayedRowAtIndex(0).setExpanded(true);
    } else if (queryParams.materialNumber) {
      const filterModel = params.api.getFilterInstance(
        'socoArticleNumberGlobalKey'
      );
      filterModel.setModel({
        values: [queryParams.materialNumber],
      });
      params.api.onFilterChanged();
    }

    this.setupColumState(params);
  }

  public onColumnChange(event: SortChangedEvent): void {
    this.agGridStateService.setColumnState(
      this.TABLE_KEY,
      event.columnApi.getColumnState()
    );
  }

  private setupColumState(event: GridReadyEvent): void {
    const columnState = this.agGridStateService.getColumnState(this.TABLE_KEY);
    if (columnState) {
      event.columnApi.applyColumnState({
        state: columnState,
        applyOrder: true,
      });
    }
  }

  public setLastModifierFilter(): void {
    const filterModel = this.gridApi.getFilterInstance('lastModifier');
    filterModel.setModel({
      values: [this.username],
    });
    this.gridApi.onFilterChanged();
  }

  public setKeyUserFilter(): void {
    const filterModel = this.gridApi.getFilterInstance('keyUser');
    filterModel.setModel({
      values: [this.username],
    });
    this.gridApi.onFilterChanged();
  }

  public resetAllFilter(): void {
    this.gridApi.setFilterModel(undefined);
    this.gridApi.onFilterChanged();
  }

  public ngOnDestroy(): void {
    this.shutDown$$.next();
  }
}
