import { CreateCustomerCaseButtonComponent } from '../../../shared/custom-status-bar/case-view/create-customer-case-button/create-customer-case-button.component';
import { CreateManualCaseButtonComponent } from '../../../shared/custom-status-bar/case-view/create-manual-case-button/create-manual-case-button.component';
import { ImportCaseButtonComponent } from '../../../shared/custom-status-bar/case-view/import-case-button/import-case-button.component';
import { DeleteCaseButtonComponent } from '../../../shared/custom-status-bar/delete-case-button/delete-case-button.component';
import { OpenCaseButtonComponent } from '../../../shared/custom-status-bar/open-case-button/open-case-button.component';

export const FRAMEWORK_COMPONENTS = {
  openCaseButtonComponent: OpenCaseButtonComponent,
  deleteCaseButtonComponent: DeleteCaseButtonComponent,
  importCaseButtonComponent: ImportCaseButtonComponent,
  createManualCaseButtonComponent: CreateManualCaseButtonComponent,
  createCustomerCaseButtonComponent: CreateCustomerCaseButtonComponent,
};
