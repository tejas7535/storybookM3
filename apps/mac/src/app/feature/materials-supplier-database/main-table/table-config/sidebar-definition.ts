import { SideBarDef } from 'ag-grid-community';

export const SIDE_BAR_CONFIG: SideBarDef = {
  toolPanels: [
    {
      id: 'columns',
      labelDefault: 'Columns',
      labelKey: 'columns',
      iconKey: 'columns',
      toolPanel: 'agColumnsToolPanel',
      toolPanelParams: {
        suppressValues: true,
        suppressPivots: true,
        suppressPivotMode: true,
        suppressRowGroups: true,
        suppressColumnMove: true,
        suppressSyncLayoutWithGrid: true,
      },
    },
    {
      id: 'filters',
      labelDefault: 'Filters',
      labelKey: 'filters',
      iconKey: 'filter',
      toolPanel: 'agFiltersToolPanel',
    },
  ],
  hiddenByDefault: false,
  defaultToolPanel: undefined,
};
