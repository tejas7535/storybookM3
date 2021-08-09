import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { EmployeeListDialogMetaHeadings } from '../../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { Color } from '../../shared/models/color.enum';
import { Employee } from '../../shared/models/employee.model';
import { DoughnutConfig } from '../../shared/charts/models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../../shared/charts/models/doughnut-series-config.model';

@Component({
  selector: 'ia-entries-exits',
  templateUrl: './entries-exits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntriesExitsComponent {
  initialConfig = [
    new DoughnutSeriesConfig(
      [{ value: 0 }],
      translate('overview.internal'),
      Color.LIGHT_GREEN
    ),
    new DoughnutSeriesConfig(
      [{ value: 0 }],
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
