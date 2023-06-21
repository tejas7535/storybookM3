import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { CalculationResultReportInput } from '@ea/core/store/models';

import { CalculationResultReportInputItemComponent } from '../calculation-result-report-input-item';
import { CalculationResultReportInputIdentifierType } from './calculation-result-report-input-identifier-type';

@Component({
  selector: 'ea-calculation-result-report-input',
  standalone: true,
  imports: [CommonModule, CalculationResultReportInputItemComponent],
  templateUrl: './calculation-result-report-input.component.html',
  styleUrls: ['./calculation-result-report-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationResultReportInputComponent implements OnInit {
  @Input() public reportInput!: CalculationResultReportInput[];

  public nestedInputs: CalculationResultReportInput[];
  public regularInputs: CalculationResultReportInput[];

  ngOnInit(): void {
    this.nestedInputs = this.reportInput?.filter(
      (input) =>
        CalculationResultReportInputIdentifierType.Block === input.identifier
    );
    this.regularInputs = this.reportInput?.filter(
      (input) =>
        CalculationResultReportInputIdentifierType.VariableBlock ===
        input.identifier
    );
  }
}
