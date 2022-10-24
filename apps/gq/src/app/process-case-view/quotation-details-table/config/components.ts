import { EditCellComponent } from '../../../shared/ag-grid/cell-renderer/edit-cells/edit-cell/edit-cell.component';
import { EditCommentComponent } from '../../../shared/ag-grid/cell-renderer/edit-cells/edit-comment/edit-comment.component';
import { FreeStockCellComponent } from '../../../shared/ag-grid/cell-renderer/free-stock/free-stock-cell/free-stock-cell.component';
import { GqRatingComponent } from '../../../shared/ag-grid/cell-renderer/gq-rating/gq-rating.component';
import { PositionIdComponent } from '../../../shared/ag-grid/cell-renderer/position-id/position-id.component';
import { SapStatusCellComponent } from '../../../shared/ag-grid/cell-renderer/sap-sync-status-cell/sap-sync-status-cell.component';
import { ExtendedColumnHeaderComponent } from '../../../shared/ag-grid/column-headers/extended-column-header/extended-column-header.component';
import { AddItemsButtonComponent } from '../../../shared/ag-grid/custom-status-bar/add-items-button/add-items-button.component';
import { ConfirmSimulationButtonComponent } from '../../../shared/ag-grid/custom-status-bar/confirm-simulation-button/confirm-simulation-button.component';
import { DeleteItemsButtonComponent } from '../../../shared/ag-grid/custom-status-bar/delete-items-button/delete-items-button.component';
import { DiscardSimulationButtonComponent } from '../../../shared/ag-grid/custom-status-bar/discard-simulation-button/discard-simulation-button.component';
import { ExportToExcelButtonComponent } from '../../../shared/ag-grid/custom-status-bar/export-to-excel-button/export-to-excel-button.component';
import { QuotationDetailsStatusComponent } from '../../../shared/ag-grid/custom-status-bar/quotation-details-status/quotation-details-status.component';
import { RefreshSapPriceComponent } from '../../../shared/ag-grid/custom-status-bar/refresh-sap-price/refresh-sap-price.component';
import { TotalRowCountComponent } from '../../../shared/ag-grid/custom-status-bar/total-row-count/total-row-count.component';
import { UploadSelectionToSapButtonComponent } from '../../../shared/ag-grid/custom-status-bar/upload-selection-to-sap-button/upload-selection-to-sap-button.component';

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
  agColumnHeader: ExtendedColumnHeaderComponent,
};
