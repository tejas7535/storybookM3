import { GqRatingComponent } from '../../cell-renderer/gq-rating/gq-rating.component';
import { ExportToExcelButtonComponent } from '../../custom-status-bar/export-to-excel-button/export-to-excel-button.component';
import { FinishOfferButtonComponent } from '../../custom-status-bar/finish-offer-button/finish-offer-button.component';
import { RemoveFromOfferButtonComponent } from '../../custom-status-bar/remove-from-offer-button/remove-from-offer-button.component';
import { TotalRowCountComponent } from '../../custom-status-bar/total-row-count/total-row-count.component';
import { UploadToSapButtonComponent } from '../../custom-status-bar/upload-to-sap-button/upload-to-sap-button.component';

export const FRAMEWORK_COMPONENTS = {
  finishOfferButtonComponent: FinishOfferButtonComponent,
  removeFromOfferButtonComponent: RemoveFromOfferButtonComponent,
  totalRowCountComponent: TotalRowCountComponent,
};

export const FRAMEWORK_COMPONENTS_FINISH_OFFER = {
  uploadToSAPButtonComponent: UploadToSapButtonComponent,
  exportToExcelButtonComponent: ExportToExcelButtonComponent,
  totalRowCountComponent: TotalRowCountComponent,
  gqRatingComponent: GqRatingComponent,
};
