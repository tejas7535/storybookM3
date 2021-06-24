import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Employee } from '../../shared/models/employee.model';
import { DoughnutConfig } from './doughnut-chart/models/doughnut-config.model';

@Component({
  selector: 'ia-entries-exits',
  templateUrl: './entries-exits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntriesExitsComponent {
  @Input() entriesDoughnutConfig: DoughnutConfig;
  @Input() exitsDoughnutConfig: DoughnutConfig;
  @Input() entriesCount: number;
  @Input() exitsCount: number;
  @Input() exitEmployees: Employee[] = [];
  @Input() entryEmployees: Employee[] = [];
}
