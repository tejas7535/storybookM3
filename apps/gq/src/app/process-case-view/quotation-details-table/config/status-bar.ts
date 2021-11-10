import { StatusPanelDef } from '@ag-grid-community/all-modules';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'UploadSelectionToSapButtonComponent', align: 'left' },
    { statusPanel: 'AddItemsButtonComponent', align: 'left' },
    { statusPanel: 'ExportToExcelButtonComponent', align: 'left' },
    { statusPanel: 'RefreshSapPriceComponent', align: 'left' },
    { statusPanel: 'TotalRowCountComponent', align: 'left' },
    { statusPanel: 'QuotationDetailsStatusComponent', align: 'right' },
    { statusPanel: 'DeleteItemsButtonComponent', align: 'right' },
  ],
};
