import { EditPriceComponent } from '../../../shared/cell-renderer/edit-price/edit-price.component';
import { EditQuantityComponent } from '../../../shared/cell-renderer/edit-quantity/edit-quantity.component';
import { EditingPriceComponent } from '../../../shared/cell-renderer/editing-price/editing-price.component';
import { EditingQuantityComponent } from '../../../shared/cell-renderer/editing-quantity/editing-quantity.component';
import { GqRatingComponent } from '../../../shared/cell-renderer/gq-rating/gq-rating.component';
import { AddItemsButtonComponent } from '../../../shared/custom-status-bar/add-items-button/add-items-button.component';
import { DeleteItemsButtonComponent } from '../../../shared/custom-status-bar/delete-items-button/delete-items-button.component';
import { DetailViewButtonComponent } from '../../../shared/custom-status-bar/detail-view-button/detail-view-button.component';
import { ExportToExcelButtonComponent } from '../../../shared/custom-status-bar/export-to-excel-button/export-to-excel-button.component';
import { QuotationDetailsStatusComponent } from '../../../shared/custom-status-bar/quotation-details-status/quotation-details-status.component';
import { UploadSelectionToSapButtonComponent } from '../../../shared/custom-status-bar/upload-selection-to-sap-button/upload-selection-to-sap-button.component';

export const FRAMEWORK_COMPONENTS = {
  detailViewButtonComponent: DetailViewButtonComponent,
  quotationDetailsStatusComponent: QuotationDetailsStatusComponent,
  deleteItemsButtonComponent: DeleteItemsButtonComponent,
  addItemsButtonComponent: AddItemsButtonComponent,
  gqRatingComponent: GqRatingComponent,
  editPriceComponent: EditPriceComponent,
  editingPriceComponent: EditingPriceComponent,
  editQuantityComponent: EditQuantityComponent,
  editingQuantityComponent: EditingQuantityComponent,
  uploadSelectionToSapButtonComponent: UploadSelectionToSapButtonComponent,
  exportToExcelButtonComponent: ExportToExcelButtonComponent,
};
