import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { GridApi, IStatusPanelParams } from 'ag-grid-enterprise';

import { getExcludedCalculations } from '@cdba/core/store';

@Component({
  selector: 'cdba-calculations-status-bar',
  templateUrl: './calculations-status-bar.component.html',
  styleUrls: ['./calculations-status-bar.component.scss'],
})
export class CalculationsStatusBarComponent {
  excludedCalculations$ = this.store.select(getExcludedCalculations);

  public gridApi: GridApi;

  public constructor(private readonly store: Store) {}

  public agInit(params: IStatusPanelParams): void {
    this.gridApi = params.api;
  }
}
