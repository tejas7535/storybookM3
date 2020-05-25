import { Component, OnInit } from '@angular/core';

import {
  AllModules,
  ColDef,
  ColumnEvent,
  GetMainMenuItemsParams,
  MenuItemDef,
  SideBarDef,
  SortChangedEvent,
  StatusPanelDef,
} from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

import { AgGridStateService } from '../../shared/services/ag-grid-state.service';
import { ColumnState } from './column-state';
import {
  COLUMN_DEFINITIONS,
  DEFAULT_COLUMN_DEFINITION,
  DEFAULT_COLUMN_STATE,
  SIDE_BAR_CONFIG,
  STATUS_BAR_CONFIG,
} from './config';
import { SAMPLE_DATA } from './sample-data';
import { SortState } from './sort-state';
import { DetailViewButtonComponent } from './status-bar/detail-view-button/detail-view-button.component';

@Component({
  selector: 'cdba-reference-types-table',
  templateUrl: './reference-types-table.component.html',
  styleUrls: ['./reference-types-table.component.scss'],
})
export class ReferenceTypesTableComponent implements OnInit {
  private static readonly TABLE_KEY = 'referenceTypes';

  public modules = AllModules;

  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[] = [];

  public rowSelection = 'single';

  public frameworkComponents = {
    detailViewButtonComponent: DetailViewButtonComponent,
  };

  public statusBar: {
    statusPanels: StatusPanelDef[];
  } = STATUS_BAR_CONFIG;

  public sideBar: SideBarDef = SIDE_BAR_CONFIG;

  public rowData = SAMPLE_DATA;

  public constructor(private readonly agGridStateService: AgGridStateService) {}

  public ngOnInit(): void {
    this.setColumnDefinitions(
      COLUMN_DEFINITIONS,
      DEFAULT_COLUMN_STATE,
      this.agGridStateService.getColumnState(
        ReferenceTypesTableComponent.TABLE_KEY
      ),
      this.agGridStateService.getSortState(
        ReferenceTypesTableComponent.TABLE_KEY
      )
    );
  }

  public getMainMenuItems(
    params: GetMainMenuItemsParams
  ): (string | MenuItemDef)[] {
    const menuItems: (string | MenuItemDef)[] = params.defaultItems.filter(
      (item) => item !== 'resetColumns'
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

  public columnChange(event: ColumnEvent): void {
    const columnState = event.columnApi.getColumnState();

    this.agGridStateService.setColumnState(
      ReferenceTypesTableComponent.TABLE_KEY,
      columnState
    );
  }

  public sortChange(event: SortChangedEvent): void {
    const sortState = event.api.getSortModel();

    this.agGridStateService.setSortState(
      ReferenceTypesTableComponent.TABLE_KEY,
      sortState
    );
  }

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
}
