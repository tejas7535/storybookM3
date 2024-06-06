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
  selector: 'mac-release-status-cell-renderer',
  templateUrl: './release-status-cell-renderer.component.html',
  standalone: true,
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
