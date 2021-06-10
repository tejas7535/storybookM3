import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  ClientSideRowModelModule,
  ClipboardModule,
  ColDef,
  ColumnEvent,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  GridApi,
  GridReadyEvent,
  IStatusPanelParams,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
  RowSelectedEvent,
  SetFilterModule,
  SideBarDef,
  SideBarModule,
  StatusBarModule,
  StatusPanelDef,
} from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

import { ReferenceType } from '@cdba/shared/models';
import { AgGridStateService } from '@cdba/shared/services';
import { arrayEquals } from '@cdba/shared/utils';

import {
  getMainMenuItems,
  SIDE_BAR_CONFIG,
} from '../../shared/components/table';
import {
  CustomNoRowsOverlayComponent,
  NoRowsParams,
} from '../../shared/components/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CompareViewButtonComponent } from '../../shared/components/table/custom-status-bar/compare-view-button/compare-view-button.component';
import { DetailViewButtonComponent } from '../../shared/components/table/custom-status-bar/detail-view-button/detail-view-button.component';
import {
  ColumnDefinitionService,
  DEFAULT_COLUMN_DEFINITION,
  STATUS_BAR_CONFIG,
} from './config';
import { PcmCellRendererComponent } from './pcm-cell-renderer/pcm-cell-renderer.component';

@Component({
  selector: 'cdba-reference-types-table',
  templateUrl: './reference-types-table.component.html',
  styleUrls: ['./reference-types-table.component.scss'],
})
export class ReferenceTypesTableComponent implements OnChanges {
  private static readonly TABLE_KEY = 'referenceTypes';

  @Input() rowData: ReferenceType[];
  @Input() selectedNodeIds: string[];
  @Output() readonly selectionChange: EventEmitter<string[]> =
    new EventEmitter();

  public modules = [
    ClientSideRowModelModule,
    FiltersToolPanelModule,
    ColumnsToolPanelModule,
    MenuModule,
    RangeSelectionModule,
    RowGroupingModule,
    StatusBarModule,
    ClipboardModule,
    SetFilterModule,
    SideBarModule,
  ];

  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[] = this.columnDefinitionService.COLUMN_DEFINITIONS;

  public rowSelection = 'multiple';

  public rowHeight = 30;

  public frameworkComponents = {
    detailViewButtonComponent: DetailViewButtonComponent,
    compareViewButtonComponent: CompareViewButtonComponent,
    customNoRowsOverlay: CustomNoRowsOverlayComponent,
    pcmCellRenderer: PcmCellRendererComponent,
  };

  public noRowsOverlayComponent = 'customNoRowsOverlay';
  public noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => translate('search.referenceTypesTable.noRowsMessage'),
  };

  public statusBar: {
    statusPanels: StatusPanelDef[];
  } = STATUS_BAR_CONFIG;

  public sideBar: SideBarDef = SIDE_BAR_CONFIG;

  public selectedRows: string[] = [];

  public getMainMenuItems = getMainMenuItems;

  private gridApi: GridApi;

  public constructor(
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefinitionService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowData && this.gridApi) {
      this.gridApi.setRowData(changes.rowData.currentValue);
    }
  }

  /**
   * Column change listener for table.
   */
  public columnChange(event: ColumnEvent): void {
    const columnState = event.columnApi.getColumnState();

    this.agGridStateService.setColumnState(
      ReferenceTypesTableComponent.TABLE_KEY,
      columnState
    );
  }

  public onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;

    const state = this.agGridStateService.getColumnState(
      ReferenceTypesTableComponent.TABLE_KEY
    );

    event.columnApi.applyColumnState({
      state,
      applyOrder: true,
    });

    event.api.setRowData(this.rowData);
  }

  /**
   * Autosize columns width when data is loaded.
   */
  public onFirstDataRendered(params: IStatusPanelParams): void {
    params.columnApi.autoSizeAllColumns(false);
    params.columnApi.setColumnVisible('identificationHash', false);

    this.selectNodes();
  }

  /**
   * Limit selected rows to a maximum of two
   */
  public onRowSelected({ node, api }: RowSelectedEvent): void {
    const maxLength = 2;

    const previouslySelectedRows = [...this.selectedRows];

    const { id } = node;
    const selected = node.isSelected();

    this.selectedRows = selected
      ? [...this.selectedRows, id]
      : this.selectedRows.filter((entry: string) => entry !== id);

    if (this.selectedRows.length > maxLength) {
      api.getRowNode(this.selectedRows.shift()).setSelected(false, false, true);
    }

    if (!arrayEquals(this.selectedRows, previouslySelectedRows)) {
      this.selectionChange.emit(this.selectedRows);
    }
  }

  private selectNodes(): void {
    if (this.selectedNodeIds) {
      this.selectedNodeIds.forEach((id) =>
        this.gridApi.getRowNode(id).setSelected(true, true, true)
      );
    }
  }
}
