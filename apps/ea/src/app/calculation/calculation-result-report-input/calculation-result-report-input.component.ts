import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { CalculationResultReportInput } from '@ea/core/store/models';

import { CalculationResultReportInputItemComponent } from '../calculation-result-report-input-item';

@Component({
  selector: 'ea-calculation-result-report-input',
  standalone: true,
  imports: [CalculationResultReportInputItemComponent],
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
      (input) => input.hasNestedStructure
    );
    this.regularInputs = this.reportInput?.filter(
      (input) => !input.hasNestedStructure
    );
  }
}
