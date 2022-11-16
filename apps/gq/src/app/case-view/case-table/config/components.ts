import { GqIdComponent } from '../../../shared/ag-grid/cell-renderer/gq-id/gq-id.component';
import { SapStatusCellComponent } from '../../../shared/ag-grid/cell-renderer/sap-sync-status-cell/sap-sync-status-cell.component';
import { ExtendedColumnHeaderComponent } from '../../../shared/ag-grid/column-headers/extended-column-header/extended-column-header.component';
import { CreateCustomerCaseButtonComponent } from '../../../shared/ag-grid/custom-status-bar/case-view/create-customer-case-button/create-customer-case-button.component';
import { CreateManualCaseButtonComponent } from '../../../shared/ag-grid/custom-status-bar/case-view/create-manual-case-button/create-manual-case-button.component';
import { ImportCaseButtonComponent } from '../../../shared/ag-grid/custom-status-bar/case-view/import-case-button/import-case-button.component';

export const COMPONENTS = {
  importCaseButtonComponent: ImportCaseButtonComponent,
  createManualCaseButtonComponent: CreateManualCaseButtonComponent,
  createCustomerCaseButtonComponent: CreateCustomerCaseButtonComponent,
  gqIdComponent: GqIdComponent,
  agColumnHeader: ExtendedColumnHeaderComponent,
  SapStatusCellComponent,
};
