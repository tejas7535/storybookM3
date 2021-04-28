import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  ColDef,
  GridOptions,
  Module,
  RowClickedEvent,
  SideBarDef,
} from '@ag-grid-community/all-modules';
import {
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MasterDetailModule,
  MultiFilterModule,
  SetFilterModule,
  SideBarModule,
} from '@ag-grid-enterprise/all-modules';

import { DataService } from '../../shared/data.service';
import { SalesRowDetailsComponent } from '../sales-row-details/sales-row-details.component';
import { COLUMN_DEFINITIONS } from './config/column-definitions';
import { DEFAULT_COLUMN_DEFINITION } from './config/default-column-definitions';
import { GRID_OPTIONS } from './config/grid-options';
import { SIDE_BAR_CONFIG } from './config/sidebar-definition';

@Component({
  selector: 'sedo-sales-table',
  templateUrl: './sales-table.component.html',
  styleUrls: ['./sales-table.component.scss'],
})
export class SalesTableComponent implements OnInit {
  public modules: Module[] = [
    ClientSideRowModelModule,
    SideBarModule,
    ColumnsToolPanelModule,
    MasterDetailModule,
    MultiFilterModule,
    FiltersToolPanelModule,
    ColumnsToolPanelModule,
    SetFilterModule,
    SideBarModule,
  ];
  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[] = COLUMN_DEFINITIONS;
  public sidebar: SideBarDef = SIDE_BAR_CONFIG;
  public gridOptions: GridOptions = GRID_OPTIONS;

  public detailCellRenderer: any;
  public frameworkComponents: any;

  public rowData: any;

  public constructor(
    public dataService: DataService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.detailCellRenderer = 'rowDetails';
    this.frameworkComponents = { rowDetails: SalesRowDetailsComponent };
  }

  public async ngOnInit(): Promise<void> {
    this.rowData = await this.dataService.getAllSales();
  }

  public onRowClicked(event: RowClickedEvent): void {
    event.node.setExpanded(!event.node.expanded);
  }

  public onFirstDataRendered(params: any): void {
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
  }
}
