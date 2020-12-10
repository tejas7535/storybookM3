import { StatusPanelDef } from '@ag-grid-community/all-modules';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'finishOfferButtonComponent', align: 'left' },
    { statusPanel: 'removeFromOfferButtonComponent', align: 'left' },
    { statusPanel: 'totalRowCountComponent', align: 'right' },
  ],
};

export const STATUS_BAR_CONFIG_FINISH_OFFER: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'uploadToSAPButtonComponent', align: 'left' },
    { statusPanel: 'exportToExcelButtonComponent', align: 'left' },
    { statusPanel: 'totalRowCountComponent', align: 'right' },
  ],
};
