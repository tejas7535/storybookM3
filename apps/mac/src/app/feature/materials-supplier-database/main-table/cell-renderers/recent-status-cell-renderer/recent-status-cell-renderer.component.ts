import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LetDirective } from '@ngrx/component';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { getRecentlyChanged } from '@mac/msd/main-table/util';
import { DataResult } from '@mac/msd/models';
import { DataFacade } from '@mac/msd/store/facades/data';

@Component({
  selector: 'mac-recent-status-cell-renderer',
  templateUrl: './recent-status-cell-renderer.component.html',
  imports: [
    // default
    CommonModule,
    // angular material
    MatIconModule,
    MatTooltipModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    LetDirective,
  ],
})
export class RecentStatusCellRendererComponent
  implements ICellRendererAngularComp
{
  public isRecent = false;

  public navigation$ = this.dataFacade.navigation$;

  constructor(private readonly dataFacade: DataFacade) {}

  public agInit(params: ICellRendererParams<any, DataResult>): void {
    this.isRecent = getRecentlyChanged(params.data?.lastModified);
  }

  public refresh(): boolean {
    return false;
  }
}
