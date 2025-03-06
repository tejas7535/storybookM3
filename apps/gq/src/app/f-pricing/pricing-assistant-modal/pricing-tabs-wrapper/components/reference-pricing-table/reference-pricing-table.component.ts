import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Observable } from 'rxjs';

import { ComparableMaterialsRowData } from '@gq/core/store/transactions/models/f-pricing-comparable-materials.interface';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '@gq/shared/ag-grid/services';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { groupBy } from '@gq/shared/utils/misc.utils';
import {
  ColumnEvent,
  ColumnState,
  GridApi,
  GridOptions,
  GridReadyEvent,
  SortChangedEvent,
} from 'ag-grid-enterprise';

import { ColumnDefinitionService } from './config/column-definition.service';
import { COMPONENTS } from './config/components';
import { ROW_SELECTION } from './config/row-selection.config';
@Component({
  selector: 'gq-reference-pricing-table',
  templateUrl: './reference-pricing-table.component.html',
  standalone: false,
})
export class ReferencePricingTableComponent implements OnInit, OnDestroy {
  @Input() inputRowData: ComparableMaterialsRowData[];
  @Output() comparedMaterialClicked = new EventEmitter<string>();
  @Input() currency: string;

  localeText$: Observable<AgGridLocale>;
  columnDefs = this.columnDefService.COLUMN_DEFS;
  defaultColDef = this.columnDefService.DEFAULT_COL_DEF;
  autoGroupColumnDef = this.columnDefService.ROW_GROUP_CONFIG;
  rowSelection = ROW_SELECTION;
  components = COMPONENTS;
  griApi: GridApi;
  gridOptions: GridOptions;

  comparableMaterialsByMaterialDescription: Map<
    string,
    ComparableMaterialsRowData[]
  > = new Map<string, ComparableMaterialsRowData[]>();

  visibleRowData: ComparableMaterialsRowData[] = [];

  private readonly rowsToDisplayByMaterial: Map<string, number> = new Map<
    string,
    number
  >();

  private readonly TABLE_KEY = 'reference-pricing-table';

  constructor(
    private readonly localizationService: LocalizationService,
    private readonly columnDefService: ColumnDefinitionService,
    private readonly agGridStateService: AgGridStateService
  ) {}

  ngOnInit(): void {
    this.gridOptions = {
      ...this.columnDefService.GRID_OPTIONS,
      context: {
        componentParent: this,
        quotation: {
          currency: this.currency,
        },
      },
    };
    this.localeText$ = this.localizationService.locale$;
    this.agGridStateService.init(this.TABLE_KEY);

    this.setInitialRowData();
  }

  ngOnDestroy(): void {
    this.agGridStateService.saveUserSettings();
  }

  onGridReady(event: GridReadyEvent): void {
    event.api.sizeColumnsToFit();
    const state = this.agGridStateService.getColumnStateForCurrentView();
    if (state) {
      event.api.applyColumnState({ state, applyOrder: true });
    }
    this.griApi = event.api;
    event.api.updateGridOptions({ rowData: this.visibleRowData });
  }

  onColumnChange(event: SortChangedEvent | ColumnEvent): void {
    const columnState: ColumnState[] = event.api.getColumnState();
    this.agGridStateService.setColumnStateForCurrentView(columnState);
  }

  comparableMaterialClicked(value: string): void {
    this.comparedMaterialClicked.emit(value);
  }

  /**
   * show more rows of a material
   * fired when 'show more' button is clicked inside the full width row
   */
  showMoreRowsClicked(material: string): void {
    this.addRowsOfMaterial(material);
  }

  // handle the logic to not show all rows of a group at once
  private setInitialRowData(): void {
    // for not rerendering the grid each time data is added, we need to have a unique identifier
    // the optional showMoreRows also need an unique identifier, initially it's undefined
    // the identifier is used for the getRowId() function of ColumnDefinitionService.gridOptions to identify the row

    // get the max number of all identifier from the input data and add 1
    // the new identifier value will be set to the showMoreRow and than incremented
    const identifiers = this.inputRowData?.map((row) => row.identifier);
    let maxIdentifier = Math.max(...identifiers) + 1;
    this.comparableMaterialsByMaterialDescription = groupBy(
      this.inputRowData,
      (row) => row.parentMaterialDescription
    );

    this.comparableMaterialsByMaterialDescription.forEach((listOfMats, key) => {
      this.rowsToDisplayByMaterial.set(key, 0);
      this.addRowsOfMaterial(
        key,
        this.columnDefService.INITIAL_NUMBER_OF_DISPLAYED_ROWS
      );

      if (
        listOfMats.length >
        this.columnDefService.INITIAL_NUMBER_OF_DISPLAYED_ROWS
      ) {
        // eslint-disable-next-line no-plusplus
        this.addShowMoreRow(key, maxIdentifier++);
      }
    });
  }

  private addShowMoreRow(
    parentMaterialDescription: string,
    identifier: number
  ): void {
    this.visibleRowData.push({
      identifier,
      parentMaterialDescription,
      isShowMoreRow: true,
    } as ComparableMaterialsRowData);
  }

  private addRowsOfMaterial(
    material: string,
    numberOfRowsToAdd: number = this.columnDefService.ROWS_TO_ADD_ON_SHOW_MORE
  ): void {
    // when sliceStart is undefined, everything addable has been added
    const sliceStart = this.rowsToDisplayByMaterial.get(material);
    if (sliceStart === undefined) {
      return;
    }

    const sliceEnd = sliceStart + +numberOfRowsToAdd;

    const rowsToAdd = this.comparableMaterialsByMaterialDescription
      .get(material)
      .slice(sliceStart, sliceEnd);
    // when rows to add is empty Array, everything addable has been added
    // set the value to undefined to not add more rows
    if (rowsToAdd.length === 0) {
      this.rowsToDisplayByMaterial.set(material, undefined);

      return;
    }

    this.visibleRowData.push(...rowsToAdd);
    this.setRowsOfMaterialsToDisplay(material, sliceEnd);
    this.griApi?.updateGridOptions({ rowData: this.visibleRowData });
  }

  private setRowsOfMaterialsToDisplay(
    material: string,
    displayAmount: number
  ): void {
    this.rowsToDisplayByMaterial.set(material, displayAmount);

    if (
      displayAmount >=
      this.comparableMaterialsByMaterialDescription.get(material).length
    ) {
      this.rowsToDisplayByMaterial.set(material, undefined);
      this.removeShowMoreRow(material);
    }
  }
  // removes the helper row to display the 'show more' buttons
  private removeShowMoreRow(material: string): void {
    const indexOfShowMoreRow = this.visibleRowData.findIndex(
      (row) => row.isShowMoreRow && row.parentMaterialDescription === material
    );
    if (indexOfShowMoreRow > -1) {
      this.visibleRowData.splice(indexOfShowMoreRow, 1);
    }
  }
}
