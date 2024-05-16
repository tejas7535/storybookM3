import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { Observable, take } from 'rxjs';

import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '@gq/shared/ag-grid/services';
import { FilterState } from '@gq/shared/models/grid-state.model';
import { QuotationSearchResultByCases } from '@gq/shared/models/quotation/quotation-search-result-by-cases.interface';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import {
  ColumnState,
  FilterChangedEvent,
  GridReadyEvent,
  SortChangedEvent,
} from 'ag-grid-community';

import { ColumnDefinitionService } from './../config/column-definition-service';
import { CasesCriteriaSelection } from './cases-criteria-selection.enum';

@Component({
  selector: 'gq-cases-result-table',
  templateUrl: './cases-result-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // define service as seperate instance (non-singleton) to avoid overriding of the columnState in the case-table
  providers: [AgGridStateService],
})
export class CasesResultTableComponent implements OnInit {
  @Input() casesResults: QuotationSearchResultByCases[];
  @Input() loading: boolean;
  @Output() criteriaSelected: EventEmitter<CasesCriteriaSelection> =
    new EventEmitter<CasesCriteriaSelection>();

  private readonly TABLE_KEY = 'search-cases-results-table';

  private readonly localizationService = inject(LocalizationService);
  private readonly columnDefService = inject(ColumnDefinitionService);
  private readonly agGridStateService = inject(AgGridStateService);

  criteriaSelections = Object.values(CasesCriteriaSelection);
  criteriaSelectedValue = CasesCriteriaSelection.GQ_ID;
  localeText$: Observable<AgGridLocale>;
  columnDefs = this.columnDefService.COLUMN_DEFS;
  defaultColDef = this.columnDefService.DEFAULT_COL_DEF;
  components = this.columnDefService.COMPONENTS;
  gridOptions = this.columnDefService.GRID_OPTIONS;
  gridOptionsWithoutPagination =
    this.columnDefService.GRID_OPTIONS_WITHOUT_PAGINATION;

  ngOnInit(): void {
    this.localeText$ = this.localizationService.locale$;
    this.agGridStateService.init(this.TABLE_KEY);
    this.criteriaSelected.emit(this.criteriaSelectedValue);
  }

  radioButtonChanged(): void {
    this.criteriaSelected.emit(this.criteriaSelectedValue);
  }

  onGridReady(event: GridReadyEvent): void {
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
          (filter) => filter.actionItemId === this.TABLE_KEY
        );
        event?.api?.setFilterModel?.(curFilter?.filterModels || {});
      });
  }

  onColumnChange(event: SortChangedEvent): void {
    const columnState: ColumnState[] = event.columnApi.getColumnState();

    this.agGridStateService.setColumnStateForCurrentView(columnState);
  }

  onFilterChanged(event: FilterChangedEvent): void {
    const filterModels = event.api.getFilterModel();
    this.agGridStateService.setColumnFilterForCurrentView(
      this.TABLE_KEY,
      filterModels
    );
  }
}
