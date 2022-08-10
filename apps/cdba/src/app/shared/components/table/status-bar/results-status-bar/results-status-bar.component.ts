import { Component } from '@angular/core';

import { GridApi, IStatusPanelParams } from 'ag-grid-enterprise';

@Component({
  selector: 'cdba-results-status-bar',
  templateUrl: './results-status-bar.component.html',
  styleUrls: ['./results-status-bar.component.scss'],
})
export class ResultsStatusBarComponent {
  public gridApi: GridApi;

  public agInit(params: IStatusPanelParams): void {
    this.gridApi = params.api;
  }
}
