import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MsdAgGridReadyService } from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

import { AbstractControlPanelComponent } from '../abstract-control-panel.component';
import { BaseControlPanelComponent } from '../base-control-panel/base-control-panel.component';

@Component({
  selector: 'mac-estimation-matrix-control-panel',
  imports: [
    // default
    CommonModule,
    // angular material
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    // libs
    SharedTranslocoModule,
    // msd
    BaseControlPanelComponent,
  ],
  templateUrl: './estimation-matrix-control-panel.component.html',
})
export class EstimationMatrixControlPanelComponent
  extends AbstractControlPanelComponent
  implements OnInit, OnDestroy
{
  public rowData$ = this.dataFacade.estimationMatrixResult$;

  public constructor(
    protected readonly dataFacade: DataFacade,
    protected readonly agGridReadyService: MsdAgGridReadyService
  ) {
    super(dataFacade, agGridReadyService);
  }

  public reload(): void {
    this.agGridApi?.refreshServerSide();
  }
}
