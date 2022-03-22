import { StatusPanelDef } from '@ag-grid-enterprise/all-modules';

export const BOM_TABLE_STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'bomTableStatusBar', align: 'left' },
    {
      statusPanel: 'agAggregationComponent',
      statusPanelParams: {
        aggFuncs: ['count', 'sum', 'min', 'max', 'avg'],
      },
    },
  ],
};
