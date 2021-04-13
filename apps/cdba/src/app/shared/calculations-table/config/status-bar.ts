import { StatusPanelDef } from '@ag-grid-enterprise/all-modules';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'bomViewButtonComponent', align: 'left' },
    { statusPanel: 'compareViewButtonComponent', align: 'left' },
    {
      statusPanel: 'agAggregationComponent',
      statusPanelParams: {
        aggFuncs: ['count', 'sum', 'min', 'max', 'avg'],
      },
    },
  ],
};
