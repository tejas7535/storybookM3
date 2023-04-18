import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CalculationParametersFacade } from '@ea/core/store';
import { CalculationResultFacade } from '@ea/core/store/facades/calculation-result/calculation-result.facade';
import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultPreviewItemComponent } from '../calculation-result-preview-item/calculation-result-preview-item.component';

@Component({
  selector: 'ea-calculation-result-preview',
  templateUrl: './calculation-result-preview.html',
  standalone: true,
  imports: [
    CommonModule,
    PushModule,
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
  public isResultAvailable$ =
    this.calculationResultFacade.isCalculationResultAvailable$;
  public isCalculationImpossible$ =
    this.calculationResultFacade.isCalculationImpossible$;
  public isCalculationMissingInput$ =
    this.calculationParametersFacade.isCalculationMissingInput$;
  public isCalculationLoading$ =
    this.calculationResultFacade.isCalculationLoading$;

  constructor(
    private readonly calculationResultFacade: CalculationResultFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade
  ) {}

  showReport() {}
}
