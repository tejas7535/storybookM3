import { StatusPanelDef } from '@ag-grid-community/core';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'bomViewButtonComponent', align: 'left' },
    {
      statusPanel: 'agAggregationComponent',
      statusPanelParams: {
        aggFuncs: ['count', 'sum', 'min', 'max', 'avg'],
      },
    },
  ],
};
