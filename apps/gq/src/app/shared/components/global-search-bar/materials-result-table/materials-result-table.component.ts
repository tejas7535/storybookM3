import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { map, Observable, take } from 'rxjs';

import { RolesFacade } from '@gq/core/store/facades';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import { BaseResultTableComponent } from '@gq/shared/components/global-search-bar/base-result-table/base-result-table.component';
import { QuotationSearchResultByMaterials } from '@gq/shared/models/quotation/quotation-search-result-by-materials.interface';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { ColDef, FilterChangedEvent, GridReadyEvent } from 'ag-grid-enterprise';

import { ROW_SELECTION } from '../config/row-selection.config';
import { MaterialsCriteriaSelection } from './material-criteria-selection.enum';

@Component({
  selector: 'gq-materials-result-table',
  templateUrl: './materials-result-table.component.html',
  // define service as seperate instance (non-singleton) to avoid overriding of the columnState in the case-table
  providers: [AgGridStateService],
})
export class MaterialsResultTableComponent
  extends BaseResultTableComponent
  implements OnInit, OnDestroy
{
  @Input() materialsResults: QuotationSearchResultByMaterials[];
  @Input() resetInputs$: Observable<void>;

  @Output() criteriaSelected: EventEmitter<MaterialsCriteriaSelection> =
    new EventEmitter<MaterialsCriteriaSelection>();

  private readonly TABLE_KEY = 'search-material-results-table';
  private readonly destroyRef = inject(DestroyRef);
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
  rowSelection = ROW_SELECTION;
  defaultColDef = this.columnDefService.DEFAULT_COL_DEF;
  components = this.columnDefService.COMPONENTS;
  gridOptions = this.columnDefService.GRID_OPTIONS;
  gridOptionsWithoutPagination =
    this.columnDefService.GRID_OPTIONS_WITHOUT_PAGINATION;

  ngOnInit(): void {
    this.localeText$ = this.localizationService.locale$;
    this.agGridStateService.init(this.TABLE_KEY);
    this.criteriaSelected.emit(this.criteriaSelectedValue);

    this.resetInputs$
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.criteriaSelectedValue = MaterialsCriteriaSelection.MATERIAL_NUMBER;
        this.criteriaSelected.emit(this.criteriaSelectedValue);
      });
    this.gridContext.filter = this.criteriaSelectedValue;
  }

  ngOnDestroy(): void {
    this.agGridStateService.saveUserSettings();
  }
  radioButtonChanged(): void {
    this.gridContext.filter = this.criteriaSelectedValue;
    this.criteriaSelected.emit(this.criteriaSelectedValue);
  }

  onGridReady(event: GridReadyEvent): void {
    super.onGridReady(event, this.TABLE_KEY);
  }

  onFilterChanged(event: FilterChangedEvent): void {
    super.onFilterChanged(event, this.TABLE_KEY);
  }
}
