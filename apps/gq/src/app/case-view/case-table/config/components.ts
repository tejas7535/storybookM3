import { GqIdComponent } from '../../../shared/cell-renderer/gq-id/gq-id.component';
import { CreateCustomerCaseButtonComponent } from '../../../shared/custom-status-bar/case-view/create-customer-case-button/create-customer-case-button.component';
import { CreateManualCaseButtonComponent } from '../../../shared/custom-status-bar/case-view/create-manual-case-button/create-manual-case-button.component';
import { ImportCaseButtonComponent } from '../../../shared/custom-status-bar/case-view/import-case-button/import-case-button.component';
import { DeleteCaseButtonComponent } from '../../../shared/custom-status-bar/delete-case-button/delete-case-button.component';

export const COMPONENTS = {
  deleteCaseButtonComponent: DeleteCaseButtonComponent,
  importCaseButtonComponent: ImportCaseButtonComponent,
  createManualCaseButtonComponent: CreateManualCaseButtonComponent,
  createCustomerCaseButtonComponent: CreateCustomerCaseButtonComponent,
  gqIdComponent: GqIdComponent,
};
