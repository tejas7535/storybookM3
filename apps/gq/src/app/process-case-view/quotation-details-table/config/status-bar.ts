import { StatusPanelDef } from 'ag-grid-community';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'UploadSelectionToSapButtonComponent', align: 'left' },
    { statusPanel: 'ConfirmSimulationButtonComponent', align: 'left' },
    { statusPanel: 'DiscardSimulationButtonComponent', align: 'left' },
    { statusPanel: 'AddItemsButtonComponent', align: 'left' },
    { statusPanel: 'ExportToExcelButtonComponent', align: 'left' },
    { statusPanel: 'RefreshSapPriceComponent', align: 'left' },
    { statusPanel: 'TotalRowCountComponent', align: 'left' },
    { statusPanel: 'QuotationDetailsStatusComponent', align: 'right' },
    { statusPanel: 'DeleteItemsButtonComponent', align: 'right' },
  ],
};
