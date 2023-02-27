import { StatusPanelDef } from 'ag-grid-enterprise';

export const BOM_TABLE_STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'bomTableTotalCostShareStatusBar', align: 'left' },
    { statusPanel: 'bomTableAggregationStatusBar', align: 'right' },
  ],
};
