import { CustomLoadingOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';

import { BomMaterialDesignationCellRenderComponent } from '../bom-material-designation-cell-render/bom-material-designation-cell-render.component';
import { AggregationComponent } from '../bom-table-status-bar/aggregation/aggregation.component';
import { TotalCostShareComponent } from '../bom-table-status-bar/total-cost-share/total-cost-share.component';

export const BOM_TABLE_COMPONENTS = {
  customLoadingOverlay: CustomLoadingOverlayComponent,
  customNoRowsOverlay: CustomNoRowsOverlayComponent,
  bomTableTotalCostShareStatusBar: TotalCostShareComponent,
  bomTableAggregationStatusBar: AggregationComponent,
  bomMaterialDesignationCellRenderComponent:
    BomMaterialDesignationCellRenderComponent,
};
