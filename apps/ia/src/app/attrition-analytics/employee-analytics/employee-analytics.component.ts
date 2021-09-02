import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { BarChartConfig } from '../../shared/charts/models/bar-chart-config.model';

@Component({
  selector: 'ia-employee-analytics',
  templateUrl: './employee-analytics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeAnalyticsComponent {
  @Input() config: BarChartConfig;

  @Output() readonly editClick: EventEmitter<void> = new EventEmitter();

  edit(): void {
    this.editClick.emit();
  }
}
