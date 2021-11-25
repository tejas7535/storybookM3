import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { DoughnutChartData } from '../../shared/charts/models/doughnut-chart-data.model';
import { DoughnutConfig } from '../../shared/charts/models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../../shared/charts/models/doughnut-series-config.model';
import { EmployeeListDialogMetaHeadings } from '../../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { Color, Employee } from '../../shared/models';

@Component({
  selector: 'ia-entries-exits',
  templateUrl: './entries-exits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntriesExitsComponent {
  initialConfig = [
    new DoughnutSeriesConfig(
      [new DoughnutChartData(0)],
      translate('overview.internal'),
      Color.LIME
    ),
    new DoughnutSeriesConfig(
      [new DoughnutChartData(0)],
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
  @Input() employeeListDialogMetaHeadings: EmployeeListDialogMetaHeadings;
}
