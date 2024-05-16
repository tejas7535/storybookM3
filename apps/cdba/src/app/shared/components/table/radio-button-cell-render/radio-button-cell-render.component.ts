import { Component } from '@angular/core';

import { IRowNode } from 'ag-grid-community';
import { ICellRendererParams } from 'ag-grid-enterprise';

@Component({
  selector: 'cdba-radio-button-cell-render',
  templateUrl: './radio-button-cell-render.component.html',
  styleUrls: ['./radio-button-cell-render.component.scss'],
})
export class RadioButtonCellRenderComponent {
  public node: IRowNode;

  public agInit(params: ICellRendererParams): void {
    this.node = params.node;
  }
}
