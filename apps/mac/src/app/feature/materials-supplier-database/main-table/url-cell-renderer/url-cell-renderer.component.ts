import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'mac-url-cell-renderer',
  templateUrl: './url-cell-renderer.component.html',
})
export class UrlCellRendererComponent implements ICellRendererAngularComp {
  url: string;
  hovered: boolean;

  agInit(params: ICellRendererParams): void {
    this.url = params.value;
  }

  refresh(): boolean {
    return false;
  }
}
