import { CreateCaseActionCellComponent } from '../../../../shared/cell-renderer/action-cells/create-case-action-cell/create-case-action-cell.component';
import { ProcessCaseActionCellComponent } from '../../../../shared/cell-renderer/action-cells/process-case-action-cell/process-case-action-cell.component';
import { InfoCellComponent } from '../../../../shared/cell-renderer/info-cell/info-cell.component';
import { CreateCaseButtonComponent } from '../../../../shared/custom-status-bar/case-material-table/create-case-button/create-case-button.component';
import { CreateCaseResetAllButtonComponent } from '../../../../shared/custom-status-bar/case-material-table/create-case-reset-all-button/create-case-reset-all-button.component';
import { ProcessCaseResetAllButtonComponent } from '../../../../shared/custom-status-bar/case-material-table/process-case-reset-all-button/process-case-reset-all-button.component';
import { AddMaterialButtonComponent } from '../../../custom-status-bar/case-material-table/add-material-button/add-material-button.component';
import { MaterialValidationStatusComponent } from '../../../custom-status-bar/material-validation-status/material-validation-status.component';

export const FRAMEWORK_COMPONENTS = {
  addMaterialButtonComponent: AddMaterialButtonComponent,
  createCaseButtonComponent: CreateCaseButtonComponent,
  createCaseResetAllComponent: CreateCaseResetAllButtonComponent,
  processCaseResetAllComponent: ProcessCaseResetAllButtonComponent,
  infoCellComponent: InfoCellComponent,
  createCaseActionCellComponent: CreateCaseActionCellComponent,
  processCaseActionCellComponent: ProcessCaseActionCellComponent,
  materialValidationStatusComponent: MaterialValidationStatusComponent,
};
