import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { Observable } from 'rxjs';

import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import { BaseResultTableComponent } from '@gq/shared/components/global-search-bar/base-result-table.component';
import { QuotationSearchResultByCases } from '@gq/shared/models/quotation/quotation-search-result-by-cases.interface';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import {
  FilterChangedEvent,
  GridReadyEvent,
} from 'ag-grid-community/dist/lib/events';

import { ColumnUtilityService } from '../config/column-utility.service';
import { CasesCriteriaSelection } from './cases-criteria-selection.enum';

@Component({
  selector: 'gq-cases-result-table',
  templateUrl: './cases-result-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // define service as seperate instance (non-singleton) to avoid overriding of the columnState in the case-table
  providers: [AgGridStateService],
})
export class CasesResultTableComponent
  extends BaseResultTableComponent
  implements OnInit
{
  @Input() casesResults: QuotationSearchResultByCases[];
  @Output() criteriaSelected: EventEmitter<CasesCriteriaSelection> =
    new EventEmitter<CasesCriteriaSelection>();

  protected readonly columnUtilityService = inject(ColumnUtilityService);
  private readonly TABLE_KEY = 'search-cases-results-table';

  criteriaSelections = Object.values(CasesCriteriaSelection);
  criteriaSelectedValue = CasesCriteriaSelection.GQ_ID;

  localeText$: Observable<AgGridLocale>;
  columnDefs = this.columnDefService.CASES_TABLE_COLUMN_DEFS;
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
    super.onGridReady(event, this.TABLE_KEY);
  }

  onFilterChanged(event: FilterChangedEvent): void {
    super.onFilterChanged(event, this.TABLE_KEY);
  }
}
