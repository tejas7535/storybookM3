import {
  EditCellComponent,
  EditCommentComponent,
  FreeStockCellComponent,
  GqRatingComponent,
  PositionIdComponent,
  QuotationStatusCellComponent,
  SapStatusCellComponent,
} from '@gq/shared/ag-grid/cell-renderer';
import { ExtendedColumnHeaderComponent } from '@gq/shared/ag-grid/column-headers/extended-column-header/extended-column-header.component';
import { AddItemsButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/add-items-button/add-items-button.component';
import { ConfirmSimulationButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/confirm-simulation-button/confirm-simulation-button.component';
import { DeleteItemsButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/delete-items-button/delete-items-button.component';
import { DiscardSimulationButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/discard-simulation-button/discard-simulation-button.component';
import { ExportToExcelButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/export-to-excel-button/export-to-excel-button.component';
import { QuotationDetailsStatusComponent } from '@gq/shared/ag-grid/custom-status-bar/quotation-details-status/quotation-details-status.component';
import { RefreshSapPriceComponent } from '@gq/shared/ag-grid/custom-status-bar/refresh-sap-price/refresh-sap-price.component';
import { TotalRowCountComponent } from '@gq/shared/ag-grid/custom-status-bar/total-row-count/total-row-count.component';
import { UploadSelectionToSapButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/upload-selection-to-sap-button/upload-selection-to-sap-button.component';

export const COMPONENTS = {
  QuotationDetailsStatusComponent,
  TotalRowCountComponent,
  DeleteItemsButtonComponent,
  AddItemsButtonComponent,
  GqRatingComponent,
  UploadSelectionToSapButtonComponent,
  ExportToExcelButtonComponent,
  PositionIdComponent,
  EditCommentComponent,
  EditCellComponent,
  FreeStockCellComponent,
  RefreshSapPriceComponent,
  ConfirmSimulationButtonComponent,
  DiscardSimulationButtonComponent,
  SapStatusCellComponent,
  QuotationStatusCellComponent,
  agColumnHeader: ExtendedColumnHeaderComponent,
};
