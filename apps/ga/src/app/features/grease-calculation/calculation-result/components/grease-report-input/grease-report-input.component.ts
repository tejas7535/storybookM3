import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { GreaseReportSubordinate } from '../../models';
import { GreaseReportInputItemComponent } from '../grease-report-input-item';

@Component({
  selector: 'ga-grease-report-input',
  standalone: true,
  imports: [CommonModule, GreaseReportInputItemComponent],
  templateUrl: './grease-report-input.component.html',
  styleUrls: ['./grease-report-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseReportInputComponent {
  @Input() public greaseReportInput!: GreaseReportSubordinate;
}
