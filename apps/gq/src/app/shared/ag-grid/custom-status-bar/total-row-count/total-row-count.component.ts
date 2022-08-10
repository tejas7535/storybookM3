import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-community';

import { getSimulationModeEnabled } from '../../../../core/store';

@Component({
  selector: 'gq-total-row-count',
  templateUrl: './total-row-count.component.html',
})
export class TotalRowCountComponent {
  totalRowCount: number;
  selectedRowCount = 0;
  simulationModeEnabled$: Observable<boolean>;
  private params: IStatusPanelParams;

  constructor(private readonly store: Store) {}

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
  }

  onGridReady(): void {
    this.totalRowCount = this.params.api.getDisplayedRowCount();
  }
  onSelectionChange(): void {
    this.selectedRowCount = this.params.api.getSelectedRows().length;
  }
}
