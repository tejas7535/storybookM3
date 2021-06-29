import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { Color } from '../../shared/models/color.enum';
import { Employee } from '../../shared/models/employee.model';
import { DoughnutConfig } from './doughnut-chart/models/doughnut-config.model';
import { DoughnutSeriesConfig } from './doughnut-chart/models/doughnut-series-config.model';

@Component({
  selector: 'ia-entries-exits',
  templateUrl: './entries-exits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntriesExitsComponent {
  initialConfig = [
    new DoughnutSeriesConfig(
      0,
      translate('overview.internal'),
      Color.LIGHT_GREEN
    ),
    new DoughnutSeriesConfig(
      0,
      translate('overview.external'),
      Color.LIGHT_BLUE
    ),
  ];
  @Input() entriesDoughnutConfig: DoughnutConfig;
  @Input() isDataLoading: boolean;
  @Input() exitsDoughnutConfig: DoughnutConfig;
  @Input() entriesCount: number;
  @Input() exitsCount: number;
  @Input() exitEmployees: Employee[] = [];
  @Input() entryEmployees: Employee[] = [];
}
