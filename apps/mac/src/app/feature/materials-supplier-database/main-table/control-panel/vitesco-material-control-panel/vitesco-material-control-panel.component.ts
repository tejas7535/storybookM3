import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LetDirective, PushPipe } from '@ngrx/component';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  MsdAgGridReadyService,
  MsdDialogService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

import { BaseControlPanelComponent } from '../base-control-panel.component';

@Component({
  selector: 'mac-vitesco-material-control-panel',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // angular material
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    PushPipe,
    LetDirective,
  ],
  templateUrl: './vitesco-material-control-panel.component.html',
})
export class VitescoMaterialControlPanelComponent
  extends BaseControlPanelComponent
  implements OnInit, OnDestroy
{
  public rowData$ = this.dataFacade.vitescoResult$;

  public constructor(
    protected readonly dataFacade: DataFacade,
    protected readonly agGridReadyService: MsdAgGridReadyService,
    protected readonly datePipe: DatePipe,
    protected readonly applicationInsightsService: ApplicationInsightsService,
    protected readonly dialogService: MsdDialogService
  ) {
    super(
      dataFacade,
      agGridReadyService,
      datePipe,
      applicationInsightsService,
      dialogService
    );
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public reload(): void {
    this.agGridApi?.refreshServerSide();
  }
}
