import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Params, Router } from '@angular/router';

import { take } from 'rxjs';

import {
  ColumnUtilityService,
  LocalizationService,
} from '@gq/shared/ag-grid/services';
import { ColumnDefinitionService } from '@gq/shared/components/global-search-bar/config/column-definition-service';
import { FilterState } from '@gq/shared/models/grid-state.model';
import { QuotationSearchResultByMaterials } from '@gq/shared/models/quotation/quotation-search-result-by-materials.interface';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { addMaterialFilterToQueryParams } from '@gq/shared/utils/misc.utils';
import {
  FilterChangedEvent,
  GridReadyEvent,
  RowDoubleClickedEvent,
  SortChangedEvent,
} from 'ag-grid-community/dist/lib/events';
import { ColumnState } from 'ag-grid-enterprise';

import { ColumnUtilityService as searchbarColUtilsService } from '../config/column-utility.service';
import { SearchbarGridContext } from '../config/searchbar-grid-context.interface';
@Component({
  template: '',
  selector: 'gq-base-result-table',
  standalone: true,
})
export class BaseResultTableComponent {
  @Input() loading: boolean;
  @Output() rowDoubleClicked: EventEmitter<void> = new EventEmitter<void>();

  protected readonly localizationService = inject(LocalizationService);
  protected readonly columnDefService = inject(ColumnDefinitionService);
  protected readonly agGridStateService = inject(AgGridStateService);
  readonly router = inject(Router);
  readonly columnUtilityService = inject(ColumnUtilityService);
  readonly searchbarColUtilsService = inject(searchbarColUtilsService);

  gridContext: SearchbarGridContext = {
    router: this.router,
    columnUtilityService: this.columnUtilityService,
  };

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

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    const context = event.context as SearchbarGridContext;
    const queryParams: Params = {
      quotation_number: event.data.gqId,
      customer_number: event.data.customerIdentifiers.customerId,
      sales_org: event.data.customerIdentifiers.salesOrg,
    };

    addMaterialFilterToQueryParams(
      queryParams,
      context,
      event.data as QuotationSearchResultByMaterials
    );

    this.router.navigate(
      this.columnUtilityService.determineCaseNavigationPath(
        event.data.status,
        event.data.enabledForApprovalWorkflow
      ),
      {
        queryParamsHandling: 'merge',
        queryParams,
      }
    );
    this.rowDoubleClicked.emit();
  }
}
