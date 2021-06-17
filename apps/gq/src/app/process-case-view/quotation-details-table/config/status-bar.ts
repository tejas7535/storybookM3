import { StatusPanelDef } from '@ag-grid-community/all-modules';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'detailViewButtonComponent', align: 'left' },
    { statusPanel: 'uploadSelectionToSapButtonComponent', align: 'left' },
    { statusPanel: 'addItemsButtonComponent', align: 'left' },
    { statusPanel: 'exportToExcelButtonComponent', align: 'left' },
    { statusPanel: 'quotationDetailsStatusComponent', align: 'right' },
    { statusPanel: 'deleteItemsButtonComponent', align: 'right' },
  ],
};
