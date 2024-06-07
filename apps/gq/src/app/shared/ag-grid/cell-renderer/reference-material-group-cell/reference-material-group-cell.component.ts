import { Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'gq-reference-material-group-cell',
  templateUrl: './reference-material-group-cell.component.html',
})
export class ReferenceMaterialGroupCellComponent {
  value: string;
  params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.value = params.value;
  }

  clickMaterial(event: MouseEvent): void {
    event.preventDefault();
    this.params.context.componentParent.comparableMaterialClicked(this.value);
  }
}
