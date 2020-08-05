import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import {
  ColDef,
  ColumnEvent,
  GetMainMenuItemsParams,
  GridApi,
  IStatusPanelParams,
  MenuItemDef,
  SideBarDef,
  SortChangedEvent,
  StatusPanelDef,
} from '@ag-grid-community/core';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { SideBarModule } from '@ag-grid-enterprise/side-bar';
import { StatusBarModule } from '@ag-grid-enterprise/status-bar';
import { translate } from '@ngneat/transloco';

import { Calculation } from '../../../core/store/reducers/shared/models/calculation.model';
import { SortState } from '../../../search/reference-types-table/sort-state';
import { AgGridStateService } from '../../../shared/services/ag-grid-state.service';
import { SIDE_BAR_CONFIG } from '../../../shared/table';
import { CustomLoadingOverlayComponent } from '../../../shared/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import {
  CustomNoRowsOverlayComponent,
  NoRowsParams,
} from '../../../shared/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { BomViewButtonComponent } from '../../../shared/table/custom-status-bar/bom-view-button/bom-view-button.component';
import { DetailViewButtonComponent } from '../../../shared/table/custom-status-bar/detail-view-button/detail-view-button.component';
import { ColumnState } from './column-state';
import {
  COLUMN_DEFINITIONS,
  DEFAULT_COLUMN_DEFINITION,
  DEFAULT_COLUMN_STATE,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'cdba-calculation-table',
  templateUrl: './calculations-table.component.html',
  styleUrls: ['./calculations-table.component.scss'],
})
export class CalculationsTableComponent implements OnChanges {
  private static readonly TABLE_KEY = 'calculations';

  private gridApi: GridApi;

  @Input() rowData: Calculation[];
  @Input() isLoading: boolean;
  @Input() errorMessage: string;

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

  public frameworkComponents = {
    detailViewButtonComponent: DetailViewButtonComponent,
    bomViewButtonComponent: BomViewButtonComponent,
    customLoadingOverlay: CustomLoadingOverlayComponent,
    customNoRowsOverlay: CustomNoRowsOverlayComponent,
  };

  public noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => this.errorMessage,
  };

  public loadingOverlayComponent = 'customLoadingOverlay';
  public noRowsOverlayComponent = 'customNoRowsOverlay';

  public statusBar: {
    statusPanels: StatusPanelDef[];
  } = STATUS_BAR_CONFIG;

  public sideBar: SideBarDef = SIDE_BAR_CONFIG;

  /**
   * Identify necessary column definitions on provided data.
   */
  private static getUpdatedDefaultColumnDefinitions(
    update: Calculation[]
  ): { [key: string]: ColDef } {
    const defaultColumnDefinitions: { [key: string]: ColDef } = {};

    Object.keys(COLUMN_DEFINITIONS).forEach((column: string) => {
      const showColumn =
        update.length > 0 && (update[0] as any)[column] !== undefined;

      if (showColumn || column === 'checkbox') {
        defaultColumnDefinitions[column] = COLUMN_DEFINITIONS[column];
      }
    });

    return defaultColumnDefinitions;
  }

  public constructor(private readonly agGridStateService: AgGridStateService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowData && changes.rowData.currentValue) {
      // get updated default column definitions
      const updatedDefaultColumnDefinitions = CalculationsTableComponent.getUpdatedDefaultColumnDefinitions(
        changes.rowData.currentValue
      );

      // set column definitions
      this.setColumnDefinitions(
        updatedDefaultColumnDefinitions,
        DEFAULT_COLUMN_STATE,
        this.agGridStateService.getColumnState(
          CalculationsTableComponent.TABLE_KEY
        ),
        this.agGridStateService.getSortState(
          CalculationsTableComponent.TABLE_KEY
        )
      );
    }

    if (changes.isLoading && changes.isLoading.currentValue && this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }
  }

  public getMainMenuItems(
    params: GetMainMenuItemsParams
  ): (string | MenuItemDef)[] {
    const menuItems: (string | MenuItemDef)[] = params.defaultItems.filter(
      (item: any) => item !== 'resetColumns'
    );

    const resetMenuItem: MenuItemDef = {
      name: 'Reset Table',
      tooltip: translate('detail.calculationTable.menu.resetAll'),
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
      CalculationsTableComponent.TABLE_KEY,
      columnState
    );
  }

  /**
   * Sort listener for table.
   */
  public sortChange(event: SortChangedEvent): void {
    const sortState = event.api.getSortModel();

    this.agGridStateService.setSortState(
      CalculationsTableComponent.TABLE_KEY,
      sortState
    );
  }

  /**
   * Set complete column config for AG Grid table.
   */
  private setColumnDefinitions(
    defaultColumnDefinitions: { [key: string]: ColDef },
    defaultColumnState: { [key: string]: ColumnState },
    usersColumnState: ColumnState[],
    usersSortState: SortState[]
  ): void {
    const columnDefinitions: ColDef[] = [];

    Object.keys(defaultColumnDefinitions).forEach((key: string) => {
      const columnStateUser = usersColumnState
        ? usersColumnState.find((col) => col.colId === key)
        : undefined;

      const sortStateUser = usersSortState
        ? usersSortState.find((col) => col.colId === key)
        : undefined;

      columnDefinitions.push({
        ...defaultColumnDefinitions[key],
        ...(defaultColumnState[key] as any),
        ...columnStateUser,
        sort: sortStateUser ? sortStateUser.sort : undefined,
      });
    });

    this.columnDefs = columnDefinitions;
  }

  onGridReady(params: IStatusPanelParams): void {
    this.gridApi = params.api;
  }
}
