import { Component } from '@angular/core';

import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core/dist/cjs/rendering/cellRenderers/iCellRenderer';
import { ScrambleMaterialDesignationPipe } from '@cdba/shared/pipes';
import { CostShareService } from '@cdba/shared/services';

import { COST_SHARE_CATEGORY_COLORS } from '../../../constants/colors';

@Component({
  selector: 'cdba-material-designation-cell-renderer',
  templateUrl: './material-designation-cell-renderer.component.html',
})
export class MaterialDesignationCellRendererComponent
  implements ICellRendererAngularComp
{
  public constructor(
    protected scrambleMaterialDesignationPipe: ScrambleMaterialDesignationPipe,
    private readonly costShareService: CostShareService
  ) {}

  public materialDesignation: string;
  public color: string;

  agInit(params: Partial<ICellRendererParams>): void {
    this.assignRenderParams(params);
  }

  refresh(params: Partial<ICellRendererParams>): boolean {
    this.assignRenderParams(params);

    return true;
  }

  assignRenderParams(params: Partial<ICellRendererParams>): void {
    this.materialDesignation = this.scrambleMaterialDesignationPipe.transform(
      params.value
    );
    this.color = COST_SHARE_CATEGORY_COLORS.get(
      this.costShareService.getCostShareCategory(params.data.costShareOfParent)
    );
  }
}
