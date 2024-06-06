import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'mac-url-cell-renderer',
  templateUrl: './url-cell-renderer.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // angular material
    MatIconModule,
    // libs
    SharedTranslocoModule,
  ],
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
