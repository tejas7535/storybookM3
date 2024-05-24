import { Component, inject, Input } from '@angular/core';

import { take } from 'rxjs';

import { LocalizationService } from '@gq/shared/ag-grid/services';
import { ColumnDefinitionService } from '@gq/shared/components/global-search-bar/config/column-definition-service';
import { FilterState } from '@gq/shared/models/grid-state.model';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import {
  FilterChangedEvent,
  GridReadyEvent,
  SortChangedEvent,
} from 'ag-grid-community/dist/lib/events';
import { ColumnState } from 'ag-grid-enterprise';

@Component({
  template: '',
  selector: 'gq-base-result-table',
  standalone: true,
})
export class BaseResultTableComponent {
  @Input() loading: boolean;

  protected readonly localizationService = inject(LocalizationService);
  protected readonly columnDefService = inject(ColumnDefinitionService);
  protected readonly agGridStateService = inject(AgGridStateService);

  onGridReady(event: GridReadyEvent, tableKey: string): void {
    // apply column State
    const state = this.agGridStateService.getColumnStateForCurrentView();
    if (state) {
      event.columnApi.applyColumnState({ state, applyOrder: true });
    }
    // apply filter state

    this.agGridStateService.filterState
      .pipe(take(2))
      .subscribe((filterState: FilterState[]) => {
        const curFilter = filterState.find(
          (filter) => filter.actionItemId === tableKey
        );
        event?.api?.setFilterModel?.(curFilter?.filterModels || {});
      });
  }

  onColumnChange(event: SortChangedEvent): void {
    const columnState: ColumnState[] = event.columnApi.getColumnState();

    this.agGridStateService.setColumnStateForCurrentView(columnState);
  }

  onFilterChanged(event: FilterChangedEvent, tableKey: string): void {
    const filterModels = event.api.getFilterModel();
    this.agGridStateService.setColumnFilterForCurrentView(
      tableKey,
      filterModels
    );
  }
}
