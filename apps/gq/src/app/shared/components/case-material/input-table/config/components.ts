import { CreateCaseActionCellComponent } from '../../../../cell-renderer/action-cells/create-case-action-cell/create-case-action-cell.component';
import { ProcessCaseActionCellComponent } from '../../../../cell-renderer/action-cells/process-case-action-cell/process-case-action-cell.component';
import { InfoCellComponent } from '../../../../cell-renderer/info-cell/info-cell.component';
import { AddMaterialButtonComponent } from '../../../../custom-status-bar/case-material-table/add-material-button/add-material-button.component';
import { CreateCaseButtonComponent } from '../../../../custom-status-bar/case-material-table/create-case-button/create-case-button.component';
import { CreateCaseResetAllButtonComponent } from '../../../../custom-status-bar/case-material-table/create-case-reset-all-button/create-case-reset-all-button.component';
import { ProcessCaseResetAllButtonComponent } from '../../../../custom-status-bar/case-material-table/process-case-reset-all-button/process-case-reset-all-button.component';
import { MaterialValidationStatusComponent } from '../../../../custom-status-bar/material-validation-status/material-validation-status.component';

export const COMPONENTS = {
  addMaterialButtonComponent: AddMaterialButtonComponent,
  createCaseButtonComponent: CreateCaseButtonComponent,
  createCaseResetAllComponent: CreateCaseResetAllButtonComponent,
  processCaseResetAllComponent: ProcessCaseResetAllButtonComponent,
  infoCellComponent: InfoCellComponent,
  createCaseActionCellComponent: CreateCaseActionCellComponent,
  processCaseActionCellComponent: ProcessCaseActionCellComponent,
  materialValidationStatusComponent: MaterialValidationStatusComponent,
};
