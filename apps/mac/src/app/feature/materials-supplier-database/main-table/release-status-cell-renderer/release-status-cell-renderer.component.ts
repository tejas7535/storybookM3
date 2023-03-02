import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { getRecentlyChanged } from '@mac/msd/main-table/util';
import { DataResult } from '@mac/msd/models';
import { DataFacade } from '@mac/msd/store/facades/data';

@Component({
  selector: 'mac-release-status-cell-renderer',
  templateUrl: './release-status-cell-renderer.component.html',
})
export class ReleaseStatusCellRendererComponent
  implements ICellRendererAngularComp
{
  public isBlocked = false;
  public isRecent = false;

  public navigation$ = this.dataFacade.navigation$;

  constructor(private readonly dataFacade: DataFacade) {}

  public agInit(params: ICellRendererParams<any, DataResult>): void {
    this.isBlocked = params.data?.blocked;
    this.isRecent = getRecentlyChanged(params.data?.lastModified);
  }

  public refresh(): boolean {
    return false;
  }
}
