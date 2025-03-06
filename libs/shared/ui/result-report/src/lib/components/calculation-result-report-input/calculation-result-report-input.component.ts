import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { CalculationResultReportInput } from '../../models/calculation-result-report-input.model';
import { CalculationResultReportInputItemComponent } from '../calculation-result-report-input-item/calculation-result-report-input-item.component';

@Component({
  selector: 'schaeffler-calculation-result-report-input',
  imports: [CalculationResultReportInputItemComponent],
  templateUrl: './calculation-result-report-input.component.html',
  styleUrls: ['./calculation-result-report-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationResultReportInputComponent implements OnInit {
  @Input() public reportInput: CalculationResultReportInput[] | undefined;

  public nestedInputs: CalculationResultReportInput[] = [];
  public regularInputs: CalculationResultReportInput[] = [];

  public ngOnInit(): void {
    this.nestedInputs =
      this.reportInput?.filter((input) => input.hasNestedStructure) || [];

    this.regularInputs =
      this.reportInput?.filter((input) => !input.hasNestedStructure) || [];
  }
}
