import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { CalculationParametersCalculationTypeConfig } from '@ea/core/store/models';
import { CalculationResultReportCalculationTypeSelection } from '@ea/core/store/models/calculation-result-report.model';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  templateUrl: './calculation-result-report-selection.component.html',
  selector: 'ea-calculation-result-report-selection',
  imports: [
    CommonModule,
    MatDividerModule,
    MatIconModule,
    TranslocoModule,
    MatButtonModule,
  ],
})
export class CalculationResultReportSelectionComponent {
  @Input()
  calculationResultTypeSelection: CalculationResultReportCalculationTypeSelection;
  @Input() isDownloadDisabled: boolean;
  @Input() isDownloadButtonHidden: boolean;
  @Input() hasDownstreamResult: boolean;

  @Output() readonly downloadClicked: EventEmitter<void> = new EventEmitter();
  @Output() readonly calculationTypeClicked: EventEmitter<
    CalculationParametersCalculationTypeConfig['name']
  > = new EventEmitter();

  public readonly CALCULATION_TYPE_CO2 = 'emission';

  onDownloadAction(): void {
    this.downloadClicked.emit();
  }

  onCalculationTypeClicked(
    configName: CalculationParametersCalculationTypeConfig['name']
  ): void {
    this.calculationTypeClicked.emit(configName);
  }
}
