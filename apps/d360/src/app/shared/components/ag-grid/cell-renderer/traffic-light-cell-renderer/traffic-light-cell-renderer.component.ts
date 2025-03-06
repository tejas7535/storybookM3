import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'd360-traffic-light-cell-renderer',
  imports: [CommonModule],
  templateUrl: './traffic-light-cell-renderer.component.html',
  styleUrls: ['./traffic-light-cell-renderer.component.scss'],
})
export class TrafficLightCellRendererComponent
  implements ICellRendererAngularComp
{
  params!: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;

    return true;
  }
}
