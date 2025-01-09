import { Component } from '@angular/core';

import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';

export interface ToolTipParameter extends ITooltipParams {
  wide?: boolean;
  lineBreaks?: boolean;
  textLeft?: boolean;
}

@Component({
  selector: 'd360-grid-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './grid-tooltip.component.html',
  styleUrls: ['./grid-tooltip.component.scss'],
})
export class GridTooltipComponent implements ITooltipAngularComp {
  public params!: ToolTipParameter;

  public agInit(params: ToolTipParameter): void {
    this.params = params;
  }
}
