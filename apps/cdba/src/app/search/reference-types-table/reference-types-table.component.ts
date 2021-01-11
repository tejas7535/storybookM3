import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import {
  ClientSideRowModelModule,
  ColDef,
  ColumnEvent,
  ColumnState,
  IStatusPanelParams,
  RowSelectedEvent,
  SideBarDef,
  StatusPanelDef,
} from '@ag-grid-community/all-modules';
import {
  ClipboardModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
  SetFilterModule,
  SideBarModule,
  StatusBarModule,
} from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

import { environment } from '../../../environments/environment';
import { ReferenceType } from '../../core/store/reducers/shared/models';
import { AgGridStateService } from '../../shared/services/ag-grid-state.service';
import {
  columnDefinitionToReferenceTypeProp,
  getMainMenuItems,
  SIDE_BAR_CONFIG,
} from '../../shared/table';
import {
  CustomNoRowsOverlayComponent,
  NoRowsParams,
} from '../../shared/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CompareViewButtonComponent } from '../../shared/table/custom-status-bar/compare-view-button/compare-view-button.component';
import { DetailViewButtonComponent } from '../../shared/table/custom-status-bar/detail-view-button/detail-view-button.component';
import {
  ColumnDefinitionService,
  DEFAULT_COLUMN_DEFINITION,
  DEFAULT_COLUMN_STATE,
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
  public columnDefs: ColDef[] = [];

  public rowSelection = !environment.production ? 'multiple' : 'single';

  public rowHeight = 30;

  public frameworkComponents = {
    detailViewButtonComponent: DetailViewButtonComponent,
    compareViewButtonComponent: CompareViewButtonComponent,
    customNoRowsOverlay: CustomNoRowsOverlayComponent,
    pcmCellRenderer: PcmCellRendererComponent,
  };

  noRowsOverlayComponent = 'customNoRowsOverlay';
  noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => translate('search.referenceTypesTable.noRowsMessage'),
  };

  public statusBar: {
    statusPanels: StatusPanelDef[];
  } = STATUS_BAR_CONFIG;

  public sideBar: SideBarDef = SIDE_BAR_CONFIG;

  public selectedRows: number[] = [];

  public getMainMenuItems = getMainMenuItems;

  @Input() rowData: ReferenceType[];

  /**
   * Identify necessary column definitions on provided data.
   */
  private getUpdatedDefaultColumnDefinitions(
    update: ReferenceType[]
  ): { [key: string]: ColDef } {
    const defaultColumnDefinitions: { [key: string]: ColDef } = {};

    Object.keys(this.columnDefinitionService.COLUMN_DEFINITIONS).forEach(
      (column: string) => {
        const showColumn =
          update.length > 0 &&
          (update[0] as any)[columnDefinitionToReferenceTypeProp(column)] !==
            undefined;

        if (showColumn || column === 'checkbox') {
          defaultColumnDefinitions[
            column
          ] = this.columnDefinitionService.COLUMN_DEFINITIONS[column];
        }
      }
    );

    return defaultColumnDefinitions;
  }

  public constructor(
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefinitionService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowData) {
      // get updated default column definitions
      const updatedDefaultColumnDefinitions = this.getUpdatedDefaultColumnDefinitions(
        changes.rowData.currentValue
      );

      // set column definitions
      this.setColumnDefinitions(
        updatedDefaultColumnDefinitions,
        DEFAULT_COLUMN_STATE,
        this.agGridStateService.getColumnState(
          ReferenceTypesTableComponent.TABLE_KEY
        )
      );
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

  /**
   * Autosize columns width when data is loaded.
   */
  public onFirstDataRendered(params: IStatusPanelParams): void {
    params.columnApi.autoSizeAllColumns(false);
    params.columnApi.setColumnVisible('identificationHash', false);
  }

  /**
   * Limit selected rows to a maximum of two
   */
  onRowSelected({ node, api }: RowSelectedEvent): void {
    const id = +node.id;
    const selected = node.isSelected();

    this.selectedRows = selected
      ? [...this.selectedRows, id]
      : this.selectedRows.filter((entry: number) => entry !== id);

    if (this.selectedRows.length > 2) {
      api.deselectIndex(this.selectedRows.shift());
    }
  }

  /**
   * Set complete column config for AG Grid table.
   */
  private setColumnDefinitions(
    defaultColumnDefinitions: { [key: string]: ColDef },
    defaultColumnState: { [key: string]: ColumnState },
    usersColumnState: ColumnState[]
  ): void {
    const columnDefinitions: ColDef[] = [];

    Object.keys(defaultColumnDefinitions).forEach(
      (key: string, index: number) => {
        const columnStateUser = usersColumnState
          ? usersColumnState.find((col) => col.colId === key)
          : undefined;

        columnDefinitions[
          (columnStateUser && usersColumnState.indexOf(columnStateUser)) ||
            index
        ] = {
          ...defaultColumnDefinitions[key],
          ...(defaultColumnState[key] as any),
          ...columnStateUser,
        };
      }
    );

    this.columnDefs = columnDefinitions;
  }
}
