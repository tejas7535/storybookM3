import { translate } from '@jsverse/transloco';
import { SideBarDef } from 'ag-grid-community';

export const SIDE_BAR: SideBarDef = {
  toolPanels: [
    {
      id: 'columns',
      labelDefault: translate('shared.quotationDetailsTable.sidebar.columns'),
      labelKey: 'columns',
      iconKey: 'columns',
      toolPanel: 'agColumnsToolPanel',
      toolPanelParams: {
        suppressPivotMode: true,
        suppressRowGroups: true,
        suppressValues: true,
      },
    },
    {
      id: 'filters',
      labelDefault: translate('shared.quotationDetailsTable.sidebar.filters'),
      labelKey: 'filters',
      iconKey: 'filter',
      toolPanel: 'agFiltersToolPanel',
    },
  ],
};
