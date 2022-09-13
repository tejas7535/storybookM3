import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { ColumnApi, GridApi } from 'ag-grid-enterprise';

@Injectable({
  providedIn: 'root',
})
// service to access ag Grid API
export class MsdAgGridReadyService {
  public agGridApi = new Subject<{
    gridApi: GridApi;
    columnApi: ColumnApi;
  }>();

  // needs to be run by agGrid component
  public agGridApiready(gridApi: GridApi, columnApi: ColumnApi) {
    this.agGridApi.next({ gridApi, columnApi });
  }
}
