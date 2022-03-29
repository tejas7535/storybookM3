import { Component } from '@angular/core';

import { RowNode } from '@ag-grid-community/all-modules';
import { ICellRendererParams } from '@ag-grid-enterprise/all-modules';

@Component({
  selector: 'cdba-radio-button-cell-render',
  templateUrl: './radio-button-cell-render.component.html',
  styleUrls: ['./radio-button-cell-render.component.scss'],
})
export class RadioButtonCellRenderComponent {
  public node: RowNode;

  public agInit(params: ICellRendererParams): void {
    this.node = params.node;
  }
}
