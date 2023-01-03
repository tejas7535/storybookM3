import { InfoCellComponent } from '../../../../ag-grid/cell-renderer/info-cell/info-cell.component';
import { ExtendedColumnHeaderComponent } from '../../../../ag-grid/column-headers/extended-column-header/extended-column-header.component';
import { AddMaterialButtonComponent } from '../../../../ag-grid/custom-status-bar/case-material-table/add-material-button/add-material-button.component';
import { CancelCaseButtonComponent } from '../../../../ag-grid/custom-status-bar/case-material-table/cancel-case-button/cancel-case-button.component';
import { CreateCaseButtonComponent } from '../../../../ag-grid/custom-status-bar/case-material-table/create-case-button/create-case-button.component';
import { MaterialValidationStatusComponent } from '../../../../ag-grid/custom-status-bar/material-validation-status/material-validation-status.component';

export const COMPONENTS = {
  addMaterialButtonComponent: AddMaterialButtonComponent,
  createCaseButtonComponent: CreateCaseButtonComponent,
  cancelButtonComponent: CancelCaseButtonComponent,
  infoCellComponent: InfoCellComponent,
  materialValidationStatusComponent: MaterialValidationStatusComponent,
  agColumnHeader: ExtendedColumnHeaderComponent,
};
