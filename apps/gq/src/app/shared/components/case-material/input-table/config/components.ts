import { InfoCellComponent } from '@gq/shared/ag-grid/cell-renderer';

import { ExtendedColumnHeaderComponent } from '../../../../ag-grid/column-headers/extended-column-header/extended-column-header.component';
import { AddMaterialButtonComponent } from '../../../../ag-grid/custom-status-bar/case-material-table/add-material-button/add-material-button.component';
import { CreateCaseButtonComponent } from '../../../../ag-grid/custom-status-bar/case-material-table/create-case-button/create-case-button.component';
import { MaterialValidationStatusComponent } from '../../../../ag-grid/custom-status-bar/material-validation-status/material-validation-status.component';

export const COMPONENTS = {
  addMaterialButtonComponent: AddMaterialButtonComponent,
  createCaseButtonComponent: CreateCaseButtonComponent,
  infoCellComponent: InfoCellComponent,
  materialValidationStatusComponent: MaterialValidationStatusComponent,
  agColumnHeader: ExtendedColumnHeaderComponent,
};
