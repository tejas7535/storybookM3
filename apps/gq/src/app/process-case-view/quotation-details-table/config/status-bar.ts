import { DeleteItemsButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/delete-items-button/delete-items-button.component';
import { QuotationDetailsStatusComponent } from '@gq/shared/ag-grid/custom-status-bar/quotation-details-status/quotation-details-status.component';
import { RefreshSapPriceComponent } from '@gq/shared/ag-grid/custom-status-bar/refresh-sap-price/refresh-sap-price.component';
import { TotalRowCountComponent } from '@gq/shared/ag-grid/custom-status-bar/total-row-count/total-row-count.component';
import { UploadQuoteToSapButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/upload-quote-to-sap-button/upload-quote-to-sap-button.component';
import { StatusPanelDef } from 'ag-grid-enterprise';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: QuotationDetailsStatusComponent, align: 'left' },
    { statusPanel: TotalRowCountComponent, align: 'center' },

    { statusPanel: 'DiscardSimulationButtonComponent', align: 'right' },
    { statusPanel: 'ConfirmSimulationButtonComponent', align: 'right' },

    { statusPanel: RefreshSapPriceComponent, align: 'right' },
    { statusPanel: 'ExportToExcelButtonComponent', align: 'right' },
    { statusPanel: 'UploadSelectionToSapButtonComponent', align: 'right' },
    { statusPanel: UploadQuoteToSapButtonComponent, align: 'right' },
    { statusPanel: 'AddItemsButtonComponent', align: 'right' },
    { statusPanel: DeleteItemsButtonComponent, align: 'right' },
  ],
};
