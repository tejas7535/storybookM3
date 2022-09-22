import { GqIdComponent } from '../../../shared/ag-grid/cell-renderer/gq-id/gq-id.component';
import { ExtendedColumnHeaderComponent } from '../../../shared/ag-grid/column-headers/extended-column-header/extended-column-header.component';
import { CreateCustomerCaseButtonComponent } from '../../../shared/ag-grid/custom-status-bar/case-view/create-customer-case-button/create-customer-case-button.component';
import { CreateManualCaseButtonComponent } from '../../../shared/ag-grid/custom-status-bar/case-view/create-manual-case-button/create-manual-case-button.component';
import { ImportCaseButtonComponent } from '../../../shared/ag-grid/custom-status-bar/case-view/import-case-button/import-case-button.component';
import { DeleteCaseButtonComponent } from '../../../shared/ag-grid/custom-status-bar/delete-case-button/delete-case-button.component';

export const COMPONENTS = {
  deleteCaseButtonComponent: DeleteCaseButtonComponent,
  importCaseButtonComponent: ImportCaseButtonComponent,
  createManualCaseButtonComponent: CreateManualCaseButtonComponent,
  createCustomerCaseButtonComponent: CreateCustomerCaseButtonComponent,
  gqIdComponent: GqIdComponent,
  agColumnHeader: ExtendedColumnHeaderComponent,
};
