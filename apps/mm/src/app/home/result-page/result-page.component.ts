import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSnackBarModule,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { BehaviorSubject } from 'rxjs';

import { TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';
import { CalculationResultFacade } from '@mm/core/store/facades/calculation-result.facade';
import { MmHostMappingPipe } from '@mm/shared/pipes/mm-host-mapping.pipe';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ReportModule } from '@schaeffler/report';

import { environment } from '../../../environments/environment';
import { ResultPageService } from '../../core/services/result-page/result-page.service';

@Component({
  selector: 'mm-result-page',
  templateUrl: './result-page.component.html',
  providers: [ResultPageService],
  imports: [
    CommonModule,
    ReportModule,
    LoadingSpinnerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MmHostMappingPipe,
    TranslocoTestingModule,
    MatButtonModule,
  ],
})
export class ResultPageComponent {
  public reportSelector = environment.reportSelector;
  public snackBarRef?: MatSnackBarRef<TextOnlySnackBar>;

  public reportBodyURL = toSignal(
    this.calculationResultFacade.htmlBodyReportUrl$
  );

  public pdfReportReady$ = new BehaviorSubject<boolean>(false);

  public constructor(
    private readonly translocoService: TranslocoService,
    private readonly calculationResultFacade: CalculationResultFacade
  ) {}

  public get errorMsg(): string {
    return this.translocoService.translate('error.content');
  }

  public get actionText(): string {
    return this.translocoService.translate('error.retry');
  }

  public resetWizard(): void {
    window.location.reload();
  }
}
