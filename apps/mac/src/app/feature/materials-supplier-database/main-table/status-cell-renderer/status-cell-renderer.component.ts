import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { Status } from '@mac/msd/constants';
import { getStatus } from '@mac/msd/main-table/util';
import { DataResult } from '@mac/msd/models';
import { DataFacade } from '@mac/msd/store/facades/data';

@Component({
  selector: 'mac-status-cell-renderer',
  templateUrl: './status-cell-renderer.component.html',
})
export class StatusCellRendererComponent implements ICellRendererAngularComp {
  public readonly statusType: typeof Status = Status;

  public status = Status.DEFAULT;

  public navigation$ = this.dataFacade.navigation$;

  constructor(private readonly dataFacade: DataFacade) {}

  public agInit(params: ICellRendererParams<any, DataResult>): void {
    this.status = getStatus(params.data?.blocked, params.data?.lastModified);
  }

  public refresh(): boolean {
    return false;
  }
}
