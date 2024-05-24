import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { map, Observable, take } from 'rxjs';

import { RolesFacade } from '@gq/core/store/facades';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import { BaseResultTableComponent } from '@gq/shared/components/global-search-bar/base-result-table.component';
import { QuotationSearchResultByMaterials } from '@gq/shared/models/quotation/quotation-search-result-by-materials.interface';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import {
  FilterChangedEvent,
  GridReadyEvent,
} from 'ag-grid-community/dist/lib/events';
import { ColDef } from 'ag-grid-enterprise';

import { MaterialsCriteriaSelection } from './material-criteria-selection.enum';

@Component({
  selector: 'gq-materials-result-table',
  templateUrl: './materials-result-table.component.html',
  // define service as seperate instance (non-singleton) to avoid overriding of the columnState in the case-table
  providers: [AgGridStateService],
})
export class MaterialsResultTableComponent
  extends BaseResultTableComponent
  implements OnInit
{
  @Input() materialsResults: QuotationSearchResultByMaterials[];
  @Output() criteriaSelected: EventEmitter<MaterialsCriteriaSelection> =
    new EventEmitter<MaterialsCriteriaSelection>();

  private readonly TABLE_KEY = 'search-material-results-table';

  private readonly rolesFacade = inject(RolesFacade);

  criteriaSelections = Object.values(MaterialsCriteriaSelection);
  criteriaSelectedValue = MaterialsCriteriaSelection.MATERIAL_NUMBER;

  localeText$: Observable<AgGridLocale>;
  columnDefs$: Observable<ColDef[]> = this.rolesFacade.userHasGPCRole$.pipe(
    take(1),
    map((userHasGPCRole) =>
      userHasGPCRole
        ? this.columnDefService.MATERIALS_TABLE_COLUMN_DEFS
        : this.columnDefService.MATERIALS_TABLE_COLUMN_DEFS_WITHOUT_GPI
    )
  );

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
