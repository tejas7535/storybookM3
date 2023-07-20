import {
  GqIdComponent,
  QuotationStatusCellComponent,
  SapStatusCellComponent,
} from '@gq/shared/ag-grid/cell-renderer';
import { CreateCustomerCaseButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-view/create-customer-case-button/create-customer-case-button.component';
import { CreateManualCaseButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-view/create-manual-case-button/create-manual-case-button.component';
import { ImportCaseButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-view/import-case-button/import-case-button.component';

export const COMPONENTS = {
  importCaseButtonComponent: ImportCaseButtonComponent,
  createManualCaseButtonComponent: CreateManualCaseButtonComponent,
  createCustomerCaseButtonComponent: CreateCustomerCaseButtonComponent,
  gqIdComponent: GqIdComponent,
  SapStatusCellComponent,
  QuotationStatusCellComponent,
};
