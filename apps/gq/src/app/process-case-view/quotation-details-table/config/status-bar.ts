import { StatusPanelDef } from '@ag-grid-community/all-modules';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'addToOfferButtonComponent', align: 'left' },
    { statusPanel: 'detailViewButtonComponent', align: 'left' },
    { statusPanel: 'totalRowCountComponent', align: 'right' },
  ],
};
