import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  ColDef,
  GridOptions,
  IServerSideDatasource,
  IStatusPanelParams,
  Module,
  RowClickedEvent,
  SideBarDef,
} from '@ag-grid-community/all-modules';
import {
  ColumnsToolPanelModule,
  IServerSideGetRowsParams,
  MasterDetailModule,
  ServerSideRowModelModule,
  SideBarModule,
} from '@ag-grid-enterprise/all-modules';

import { DataService } from '../../shared/data.service';
import { SalesRowDetailsComponent } from '../sales-row-details/sales-row-details.component';
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
  public modules: Module[] = [
    SideBarModule,
    ColumnsToolPanelModule,
    ServerSideRowModelModule,
    MasterDetailModule,
  ];
  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[] = COLUMN_DEFINITIONS;
  public sidebar: SideBarDef = SIDE_BAR_CONFIG;
  public gridOptions: GridOptions = GRID_OPTIONS;

  public detailCellRenderer: any;
  public frameworkComponents: any;
  public combinedKeyQueryParam: string;

  public constructor(
    public dataService: DataService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.detailCellRenderer = 'rowDetails';
    this.frameworkComponents = { rowDetails: SalesRowDetailsComponent };
  }

  public onGridReady(event: IStatusPanelParams): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams.combinedKey) {
      this.combinedKeyQueryParam = queryParams.combinedKey;
      const filterModel = event.api.getFilterInstance('combinedKey');
      filterModel.setModel({
        type: 'equals',
        filter: queryParams.combinedKey,
      });
    }

    const dataSource: IServerSideDatasource = {
      getRows: (params: IServerSideGetRowsParams) => {
        this.fetchRows(params);
      },
    };

    event.api.setServerSideDatasource(dataSource);
  }

  public onRowClicked(event: RowClickedEvent): void {
    event.node.setExpanded(!event.node.expanded);
  }

  public async onFirstDataRendered(params: any): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.combinedKeyQueryParam) {
        // Timeout might look ugly but doesnt work without
        // and ag grid docs examples use timeout for the same use case sadly
        setTimeout(() => {
          params.api.getDisplayedRowAtIndex(0).setExpanded(true);
          resolve();
        }, 1500);
      } else {
        resolve();
      }
    });
  }

  private async fetchRows(params: IServerSideGetRowsParams): Promise<void> {
    return new Promise<void>((resolve) => {
      this.dataService
        .getSalesSummaryPromise(params)
        .then((response) => {
          if (response.content.length === 0) {
            params.api.showNoRowsOverlay();
          }
          params.successCallback(response.content, response.totalItemsCount);
          resolve();
        })
        .catch((error) => {
          console.error(error);
          params.failCallback();
          resolve();
        });
    });
  }
}
