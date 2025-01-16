import { DeleteItemsButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/delete-items-button/delete-items-button.component';
import { QuotationDetailsStatusComponent } from '@gq/shared/ag-grid/custom-status-bar/quotation-details-status/quotation-details-status.component';
import { TotalRowCountComponent } from '@gq/shared/ag-grid/custom-status-bar/total-row-count/total-row-count.component';
import { UploadQuoteToSapButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/upload-quote-to-sap-button/upload-quote-to-sap-button.component';
import { StatusPanelDef } from 'ag-grid-enterprise';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'UploadSelectionToSapButtonComponent', align: 'left' },
    { statusPanel: 'ConfirmSimulationButtonComponent', align: 'left' },
    { statusPanel: 'DiscardSimulationButtonComponent', align: 'left' },
    { statusPanel: 'AddItemsButtonComponent', align: 'left' },
    { statusPanel: UploadQuoteToSapButtonComponent, align: 'left' },
    { statusPanel: 'ExportToExcelButtonComponent', align: 'left' },
    { statusPanel: 'RefreshSapPriceComponent', align: 'left' },
    { statusPanel: TotalRowCountComponent, align: 'left' },
    { statusPanel: QuotationDetailsStatusComponent, align: 'right' },
    { statusPanel: DeleteItemsButtonComponent, align: 'right' },
  ],
};
