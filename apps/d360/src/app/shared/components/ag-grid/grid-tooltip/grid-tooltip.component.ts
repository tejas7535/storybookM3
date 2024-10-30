import { Component } from '@angular/core';

import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';

@Component({
  selector: 'app-grid-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './grid-tooltip.component.html',
  styleUrls: ['./grid-tooltip.component.scss'],
})
export class GridTooltipComponent implements ITooltipAngularComp {
  public params!: ITooltipParams;

  agInit(params: ITooltipParams): void {
    this.params = params;
  }
}
