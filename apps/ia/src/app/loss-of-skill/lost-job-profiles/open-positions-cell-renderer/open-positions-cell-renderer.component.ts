import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ia-open-positions-cell-renderer',
  templateUrl: './open-positions-cell-renderer.component.html',
  standalone: false,
})
export class OpenPositionsCellRendererComponent
  implements ICellRendererAngularComp
{
  count: number;
  available: boolean;

  agInit(params: ICellRendererParams): void {
    this.count = params.value.count;
    this.available = params.value.available;
  }

  refresh(_params: ICellRendererParams): boolean {
    return false;
  }
}
