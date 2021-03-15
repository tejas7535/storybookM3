import { ActionCellComponent } from '../../../../shared/cell-renderer/action-cell/action-cell.component';
import { InfoCellComponent } from '../../../../shared/cell-renderer/info-cell/info-cell.component';
import { CreateCaseButtonComponent } from '../../../../shared/custom-status-bar/create-case-button/create-case-button.component';
import { ResetAllButtonComponent } from '../../../../shared/custom-status-bar/reset-all-button/reset-all-button.component';
import { AddMaterialButtonComponent } from '../../../custom-status-bar/add-material-button/add-material-button.component';
import { MaterialValidationStatusComponent } from '../../../custom-status-bar/material-validation-status/material-validation-status.component';

export const FRAMEWORK_COMPONENTS = {
  addMaterialButtonComponent: AddMaterialButtonComponent,
  createCaseButtonComponent: CreateCaseButtonComponent,
  resetAllButtonComponent: ResetAllButtonComponent,
  infoCellComponent: InfoCellComponent,
  actionCellComponent: ActionCellComponent,
  materialValidationStatusComponent: MaterialValidationStatusComponent,
};
