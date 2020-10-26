import { Component } from '@angular/core';

import {
  ColDef,
  GridOptions,
  IServerSideDatasource,
  IStatusPanelParams,
  Module,
  SideBarDef,
} from '@ag-grid-community/all-modules';
import {
  ColumnsToolPanelModule,
  IServerSideGetRowsParams,
  ServerSideRowModelModule,
  SideBarModule,
} from '@ag-grid-enterprise/all-modules';

import { DataService } from '../../shared/data.service';
import { COLUMN_DEFINITIONS } from './config/column-definitions';
import { DEFAULT_COLUMN_DEFINITION } from './config/default-column-definitions';
import { GRID_OPTIONS } from './config/grid-options';
import { SIDE_BAR_CONFIG } from './config/sidebar-definition';

@Component({
  selector: 'seli-sales.-table',
  templateUrl: './sales-table.component.html',
  styleUrls: ['./sales-table.component.scss'],
})
export class SalesTableComponent {
  public constructor(public dataService: DataService) {}

  public modules: Module[] = [
    SideBarModule,
    ColumnsToolPanelModule,
    ServerSideRowModelModule,
  ];
  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[] = COLUMN_DEFINITIONS;
  public sidebar: SideBarDef = SIDE_BAR_CONFIG;
  public gridOptions: GridOptions = GRID_OPTIONS;

  public onGridReady(event: IStatusPanelParams): void {
    const dataSource: IServerSideDatasource = {
      getRows: (params: IServerSideGetRowsParams) => {
        this.fetchRows(params);
      },
    };

    event.api.setServerSideDatasource(dataSource);
  }

  private fetchRows(params: IServerSideGetRowsParams): void {
    this.dataService
      .getSalesSummaryPromise(params)
      .then((response) => {
        if (response.content.length === 0) {
          params.api.showNoRowsOverlay();
        }
        params.successCallback(response.content, response.totalItemsCount);
      })
      .catch((error) => {
        console.error(error);
        params.failCallback();
      });
  }
}
