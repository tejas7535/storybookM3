import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '@gq/shared/ag-grid/services';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import {
  ColumnState,
  GridOptions,
  GridReadyEvent,
  SortChangedEvent,
} from 'ag-grid-community';

import { ColumnDefinitionService } from './config/column-definition.service';
import { COMPONENTS } from './config/components';
@Component({
  selector: 'gq-reference-pricing-table',
  templateUrl: './reference-pricing-table.component.html',
})
export class ReferencePricingTableComponent implements OnInit {
  @Input() rowData: ComparableLinkedTransaction[];
  @Output() comparedMaterialClicked = new EventEmitter<string>();

  localeText$: Observable<AgGridLocale>;
  columnDefs = this.columnDefService.COLUMN_DEFS;
  components = COMPONENTS;
  gridOptions: GridOptions = {
    context: { componentParent: this },
  };

  private readonly TABLE_KEY = 'reference-pricing-table';
  constructor(
    private readonly localizationService: LocalizationService,
    private readonly columnDefService: ColumnDefinitionService,
    private readonly agGridStateService: AgGridStateService
  ) {}

  ngOnInit(): void {
    this.localeText$ = this.localizationService.locale$;
    this.agGridStateService.init(this.TABLE_KEY);
  }

  onGridReady(event: GridReadyEvent): void {
    event.api.sizeColumnsToFit();
    const state = this.agGridStateService.getColumnStateForCurrentView();
    if (state) {
      event.columnApi.applyColumnState({ state, applyOrder: true });
    }
  }

  onColumnChange(event: SortChangedEvent): void {
    const columnState: ColumnState[] = event.columnApi.getColumnState();

    this.agGridStateService.setColumnStateForCurrentView(columnState);
  }

  comparableMaterialClicked(value: string): void {
    this.comparedMaterialClicked.emit(value);
  }
}
