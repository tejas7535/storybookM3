import { StatusPanelDef } from '@ag-grid-community/all-modules';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'finishOfferButtonComponent', align: 'left' },
    { statusPanel: 'removeFromOfferButtonComponent', align: 'left' },
  ],
};
