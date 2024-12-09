import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { getSimulationModeEnabled } from '@gq/core/store/active-case/active-case.selectors';
import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-community';

import { calculateFilteredRows } from '../statusbar.utils';

@Component({
  selector: 'gq-total-row-count',
  styles: [
    `
      :host {
        @apply h-full;
      }
    `,
  ],
  templateUrl: './total-row-count.component.html',
})
export class TotalRowCountComponent {
  totalRowCount: number;
  selectedRowCount = 0;
  filteredRowCount = 0;
  simulationModeEnabled$: Observable<boolean>;
  private params: IStatusPanelParams;

  constructor(private readonly store: Store) {}

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener(
      'gridReady',
      this.onRowDataChange.bind(this)
    );
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.params.api.addEventListener(
      'filterChanged',
      this.onFilterChange.bind(this)
    );
    this.params.api.addEventListener(
      'rowDataUpdated',
      this.onRowDataChange.bind(this)
    );

    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
  }

  onRowDataChange(): void {
    this.totalRowCount = this.params.api.getDisplayedRowCount();
  }
  onSelectionChange(): void {
    this.selectedRowCount = this.params.api.getSelectedRows().length;
  }
  onFilterChange(): void {
    const displayedRowCount = this.params.api.getDisplayedRowCount();
    this.filteredRowCount = calculateFilteredRows(
      displayedRowCount,
      this.totalRowCount
    );
  }
}
