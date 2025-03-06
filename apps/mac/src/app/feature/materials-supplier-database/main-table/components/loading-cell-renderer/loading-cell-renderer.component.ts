import { Component } from '@angular/core';

import { ILoadingCellRendererAngularComp } from 'ag-grid-angular';
import { ILoadingCellRendererParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'mac-loading-cell-renderer',
  templateUrl: './loading-cell-renderer.component.html',
  imports: [
    // libs
    SharedTranslocoModule,
  ],
})
export class LoadingCellRendererComponent
  implements ILoadingCellRendererAngularComp
{
  public params!: ILoadingCellRendererParams;

  agInit(params: ILoadingCellRendererParams): void {
    this.params = params;
  }
}
