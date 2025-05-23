import { Injectable } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { SideBarDef } from 'ag-grid-enterprise';

import { NavigateColumnsPanelComponent } from './navigate-columns-panel';

@Injectable({ providedIn: 'root' })
export class SideBarService {
  ICONS: {
    [key: string]: ((...args: any[]) => any) | string;
  } = {
    navigate: '<span class="ag-icon ag-icon-eye"></span>',
  };

  DEFAULT_SIDE_BAR_CONFIG: SideBarDef = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: translate('shared.table.sidebar.columns'),
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
        },
      },
      {
        id: 'filters',
        labelDefault: translate('shared.table.sidebar.filters'),
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      },
    ],
    defaultToolPanel: 'columns',
  };

  NAVIGATE_SIDE_BAR_CONFIG: SideBarDef = {
    toolPanels: [
      ...this.DEFAULT_SIDE_BAR_CONFIG.toolPanels,
      {
        id: 'navigate',
        labelDefault: translate('shared.table.sidebar.navigate'),
        labelKey: 'navigate',
        iconKey: 'navigate',
        minWidth: 280,
        width: 280,
        toolPanel: NavigateColumnsPanelComponent,
      },
    ],
    defaultToolPanel: 'columns',
  };

  BOM_SIDE_BAR_CONFIG: SideBarDef = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: translate('shared.table.sidebar.columns'),
        labelKey: 'columns',
        iconKey: 'columns',
        minWidth: 450,
        width: 450,
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
          suppressSyncLayoutWithGrid: true,
        },
      },
      {
        id: 'navigate',
        labelDefault: translate('shared.table.sidebar.navigate'),
        labelKey: 'navigate',
        iconKey: 'navigate',
        minWidth: 280,
        width: 280,
        toolPanel: NavigateColumnsPanelComponent,
      },
    ],
  };
}
