import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Subordinate } from '../../models';

@Component({
  selector: 'schaeffler-grease-report-input',
  templateUrl: './grease-report-input.component.html',
  styleUrls: ['./grease-report-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseReportInputComponent {
  @Input() public greaseReportInput!: Subordinate;
}
