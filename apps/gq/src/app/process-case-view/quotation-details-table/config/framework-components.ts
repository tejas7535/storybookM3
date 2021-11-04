import { EditCellComponent } from '../../../shared/cell-renderer/edit-cells/edit-cell/edit-cell.component';
import { EditCommentComponent } from '../../../shared/cell-renderer/edit-cells/edit-comment/edit-comment.component';
import { GqRatingComponent } from '../../../shared/cell-renderer/gq-rating/gq-rating.component';
import { PositionIdComponent } from '../../../shared/cell-renderer/position-id/position-id.component';
import { AddItemsButtonComponent } from '../../../shared/custom-status-bar/add-items-button/add-items-button.component';
import { DeleteItemsButtonComponent } from '../../../shared/custom-status-bar/delete-items-button/delete-items-button.component';
import { ExportToExcelButtonComponent } from '../../../shared/custom-status-bar/export-to-excel-button/export-to-excel-button.component';
import { QuotationDetailsStatusComponent } from '../../../shared/custom-status-bar/quotation-details-status/quotation-details-status.component';
import { TotalRowCountComponent } from '../../../shared/custom-status-bar/total-row-count/total-row-count.component';
import { UploadSelectionToSapButtonComponent } from '../../../shared/custom-status-bar/upload-selection-to-sap-button/upload-selection-to-sap-button.component';

export const FRAMEWORK_COMPONENTS = {
  quotationDetailsStatusComponent: QuotationDetailsStatusComponent,
  totalRowCountComponent: TotalRowCountComponent,
  deleteItemsButtonComponent: DeleteItemsButtonComponent,
  addItemsButtonComponent: AddItemsButtonComponent,
  gqRatingComponent: GqRatingComponent,
  uploadSelectionToSapButtonComponent: UploadSelectionToSapButtonComponent,
  exportToExcelButtonComponent: ExportToExcelButtonComponent,
  positionIdComponent: PositionIdComponent,
  editCommentComponent: EditCommentComponent,
  EditCellComponent,
};
