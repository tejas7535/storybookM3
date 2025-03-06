import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';

@Component({
  selector: 'd360-delete-button-cell-renderer',
  imports: [MatIconModule, MatIconButton],
  templateUrl: './delete-button-cell-renderer.component.html',
  styleUrls: ['./delete-button-cell-renderer.component.scss'],
})
export class DeleteButtonCellRendererComponent
  implements ICellRendererAngularComp
{
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.params = params;

    return true;
  }

  onDeleteRow() {
    this.params.api.applyTransaction({ remove: [this.params.node.data] });
  }
}
