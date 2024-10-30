import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-customer-material-number-cell-renderer',
  templateUrl: './customer-material-number-cell-renderer.component.html',
  styleUrls: ['./customer-material-number-cell-renderer.component.css'],
  standalone: true,
})
export class CustomerMaterialNumberCellRendererComponent
  implements ICellRendererAngularComp
{
  value = '';

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }
  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;

    return true;
  }
}
