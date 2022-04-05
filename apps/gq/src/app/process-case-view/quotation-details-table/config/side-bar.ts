import { SideBarDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

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
