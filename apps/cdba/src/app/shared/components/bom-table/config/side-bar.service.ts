import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { SideBarDef } from 'ag-grid-enterprise';

@Injectable()
export class SidebarService {
  SIDE_BAR_CONFIG: SideBarDef = {
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
    ],
  };
}
