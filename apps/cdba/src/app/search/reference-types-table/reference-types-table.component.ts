import { Component } from '@angular/core';

import {
  AllModules,
  ColDef,
  SideBarDef,
  StatusPanelDef,
} from '@ag-grid-enterprise/all-modules';

import { COLUMN_DEFINITIONS } from './config/column-definitions';
import { DEFAULT_COLUMN_DEFINITION } from './config/default-column-definition';
import { SIDE_BAR_CONFIG } from './config/side-bar';
import { STATUS_BAR_CONFIG } from './config/status-bar';
import { SAMPLE_DATA } from './sample-data';
import { DetailViewButtonComponent } from './status-bar/detail-view-button/detail-view-button.component';

@Component({
  selector: 'cdba-reference-types-table',
  templateUrl: './reference-types-table.component.html',
  styleUrls: ['./reference-types-table.component.scss'],
})
export class ReferenceTypesTableComponent {
  modules = AllModules;

  defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  columnDefs: ColDef[] = COLUMN_DEFINITIONS;

  rowSelection = 'single';

  frameworkComponents = {
    detailViewButtonComponent: DetailViewButtonComponent,
  };

  statusBar: {
    statusPanels: StatusPanelDef[];
  } = STATUS_BAR_CONFIG;

  sideBar: SideBarDef = SIDE_BAR_CONFIG;

  rowData = SAMPLE_DATA;
}
