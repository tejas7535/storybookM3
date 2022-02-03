import { StatusPanelDef } from '@ag-grid-enterprise/all-modules';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'calculationsStatusBarComponent', align: 'left' },
    {
      statusPanel: 'agAggregationComponent',
      statusPanelParams: {
        aggFuncs: ['count', 'sum', 'min', 'max', 'avg'],
      },
    },
  ],
};
