import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import {
  ClientSideRowModelModule,
  ColDef,
  ColumnEvent,
  ColumnState,
  GetMainMenuItemsParams,
  IStatusPanelParams,
  MenuItemDef,
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

import { ReferenceType } from '../../core/store/reducers/shared/models';
import { AgGridStateService } from '../../shared/services/ag-grid-state.service';
import {
  columnDefinitionToReferenceTypeProp,
  SIDE_BAR_CONFIG,
} from '../../shared/table';
import {
  CustomNoRowsOverlayComponent,
  NoRowsParams,
} from '../../shared/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { DetailViewButtonComponent } from '../../shared/table/custom-status-bar/detail-view-button/detail-view-button.component';
import {
  COLUMN_DEFINITIONS,
  DEFAULT_COLUMN_DEFINITION,
  DEFAULT_COLUMN_STATE,
  STATUS_BAR_CONFIG,
} from './config';

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

  public rowSelection = 'single';

  public rowHeight = 30;

  public frameworkComponents = {
    detailViewButtonComponent: DetailViewButtonComponent,
    customNoRowsOverlay: CustomNoRowsOverlayComponent,
  };

  noRowsOverlayComponent = 'customNoRowsOverlay';
  noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => translate('search.referenceTypesTable.noRowsMessage'),
  };

  public statusBar: {
    statusPanels: StatusPanelDef[];
  } = STATUS_BAR_CONFIG;

  public sideBar: SideBarDef = SIDE_BAR_CONFIG;

  @Input() rowData: ReferenceType[];

  /**
   * Identify necessary column definitions on provided data.
   */
  private static getUpdatedDefaultColumnDefinitions(
    update: ReferenceType[]
  ): { [key: string]: ColDef } {
    const defaultColumnDefinitions: { [key: string]: ColDef } = {};

    Object.keys(COLUMN_DEFINITIONS).forEach((column: string) => {
      const showColumn =
        update.length > 0 &&
        (update[0] as any)[columnDefinitionToReferenceTypeProp(column)] !==
          undefined;

      if (showColumn || column === 'checkbox') {
        defaultColumnDefinitions[column] = COLUMN_DEFINITIONS[column];
      }
    });

    return defaultColumnDefinitions;
  }

  public constructor(private readonly agGridStateService: AgGridStateService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowData) {
      // get updated default column definitions
      const updatedDefaultColumnDefinitions = ReferenceTypesTableComponent.getUpdatedDefaultColumnDefinitions(
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
   * Provide custom items for main menu of the table.
   */
  public getMainMenuItems(
    params: GetMainMenuItemsParams
  ): (string | MenuItemDef)[] {
    const menuItems: (string | MenuItemDef)[] = params.defaultItems.filter(
      (item: any) => item !== 'resetColumns'
    );

    const resetMenuItem: MenuItemDef = {
      name: 'Reset Table',
      tooltip: translate('search.referenceTypesTable.menu.resetAll'),
      action: () => {
        params.columnApi.setColumnState(
          Object.values(DEFAULT_COLUMN_STATE) as any[]
        );
        params.api.setSortModel([]);
      },
    };

    menuItems.push(resetMenuItem);

    return menuItems;
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
   * Set complete column config for AG Grid table.
   */
  private setColumnDefinitions(
    defaultColumnDefinitions: { [key: string]: ColDef },
    defaultColumnState: { [key: string]: ColumnState },
    usersColumnState: ColumnState[]
  ): void {
    const columnDefinitions: ColDef[] = [];

    Object.keys(defaultColumnDefinitions).forEach((key: string) => {
      const columnStateUser = usersColumnState
        ? usersColumnState.find((col) => col.colId === key)
        : undefined;

      columnDefinitions.push({
        ...defaultColumnDefinitions[key],
        ...(defaultColumnState[key] as any),
        ...columnStateUser,
      });
    });

    this.columnDefs = columnDefinitions;
  }
}
