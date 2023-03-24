import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { CalculationParametersFacade } from '@ea/core/store';
import { runCalculation } from '@ea/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { CalculationResultFacade } from '@ea/core/store/facades/calculation-result/calculation-result.facade';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultPreviewItemComponent } from '../calculation-result-preview-item/calculation-result-preview-item.component';

@Component({
  selector: 'ea-calculation-result-preview',
  templateUrl: './calculation-result-preview.html',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    CalculationResultPreviewItemComponent,
    SharedTranslocoModule,
  ],
})
export class CalculationResultPreviewComponent {
  public overlayData$ =
    this.calculationResultFacade.getCalculationResultPreviewData$;
  public isResultAvailable$ =
    this.calculationResultFacade.isCalculationResultAvailable$;
  public isCalculationImpossible$ =
    this.calculationResultFacade.isCalculationImpossible$;
  public isCalculationMissingInput$ =
    this.calculationParametersFacade.isCalculationMissingInput$;

  constructor(
    private readonly calculationResultFacade: CalculationResultFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade
  ) {}

  calculate() {
    this.calculationResultFacade.dispatch(runCalculation);
  }
}
