import { CustomLoadingOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';

import { BomMaterialDesignationCellRenderComponent } from '../bom-material-designation-cell-render/bom-material-designation-cell-render.component';
import { BomTableStatusBarComponent } from '../bom-table-status-bar/bom-table-status-bar.component';

export const BOM_TABLE_COMPONENTS = {
  customLoadingOverlay: CustomLoadingOverlayComponent,
  customNoRowsOverlay: CustomNoRowsOverlayComponent,
  bomTableStatusBar: BomTableStatusBarComponent,
  bomMaterialDesignationCellRenderComponent:
    BomMaterialDesignationCellRenderComponent,
};
