import { Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-enterprise';

@Component({
  selector: 'cdba-pcm-cell-renderer',
  templateUrl: './pcm-cell-renderer.component.html',
  styleUrls: ['./pcm-cell-renderer.component.scss'],
})
export class PcmCellRendererComponent {
  public isPcmRow: boolean | 'true' | 'false'; // boolean gets stringified when rows are grouped

  agInit(params: ICellRendererParams): void {
    this.isPcmRow = params.value;
  }
}
