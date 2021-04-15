import { Component } from '@angular/core';

import { ICellRendererAngularComp } from '@ag-grid-community/angular';

import { COLOR_PLATTE } from '../../bom-chart/bom-chart.config';

@Component({
  selector: 'cdba-material-designation-cell-renderer',
  templateUrl: './material-designation-cell-renderer.component.html',
  styleUrls: ['./material-designation-cell-renderer.component.scss'],
})
export class MaterialDesignationCellRendererComponent
  implements ICellRendererAngularComp {
  public materialDesignation: string;
  public color: string;

  agInit(params: any): void {
    this.materialDesignation = params.value;
    this.color = COLOR_PLATTE[params.rowIndex];
  }

  refresh(params: any): boolean {
    this.materialDesignation = params.value;
    this.color = COLOR_PLATTE[params.rowIndex];

    return true;
  }
}
