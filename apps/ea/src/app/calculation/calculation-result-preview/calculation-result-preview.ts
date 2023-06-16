import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { of } from 'rxjs';

import { CalculationParametersFacade } from '@ea/core/store';
import { CalculationResultFacade } from '@ea/core/store/facades/calculation-result/calculation-result.facade';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultPreviewItemComponent } from '../calculation-result-preview-item/calculation-result-preview-item.component';
import { CalculationResultReportComponent } from '../calculation-result-report/calculation-result-report.component';

@Component({
  selector: 'ea-calculation-result-preview',
  templateUrl: './calculation-result-preview.html',
  standalone: true,
  imports: [
    CommonModule,
    PushPipe,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    CalculationResultPreviewItemComponent,
    SharedTranslocoModule,
    MatProgressSpinnerModule,
  ],
})
export class CalculationResultPreviewComponent {
  @Input() sticky = true;

  public overlayData$ =
    this.calculationResultFacade.getCalculationResultPreviewData$;
  public isCalculationResultReportAvailable$ =
    this.calculationResultFacade.isCalculationResultReportAvailable$;
  public isCalculationImpossible$ = of(false);
  public isCalculationMissingInput$ =
    this.calculationParametersFacade.isCalculationMissingInput$;

  constructor(
    private readonly calculationResultFacade: CalculationResultFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly dialog: MatDialog
  ) {}

  showReport() {
    this.dialog.open(CalculationResultReportComponent, {
      autoFocus: false,
      hasBackdrop: true,
    });
  }
}
