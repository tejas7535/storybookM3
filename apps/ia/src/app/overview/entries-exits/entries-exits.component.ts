import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { LegendSelectAction } from '../../shared/charts/models';
import { ChartLegendItem } from '../../shared/charts/models/chart-legend-item.model';
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
  legend: ChartLegendItem[];
  legendSelectAction: LegendSelectAction;
  entriesDoughnutConfig: DoughnutConfig;
  exitsDoughnutConfig: DoughnutConfig;

  @Input() isDataLoading: boolean;
  @Input() entriesCount: number;
  @Input() exitsCount: number;
  @Input() exitEmployees: Employee[] = [];
  @Input() entryEmployees: Employee[] = [];
  @Input() employeeListDialogMetaHeadings: EmployeeListDialogMetaHeadings;

  @Input() set data(data: [DoughnutConfig, DoughnutConfig]) {
    // copy of data is needed to trigger internal reset
    this.entriesDoughnutConfig = data[0];
    this.exitsDoughnutConfig = data[1];
    this.legend = this.getLegend();
  }

  onSelectedLegendItem(action: LegendSelectAction): void {
    this.legendSelectAction = action;
  }

  getLegend(): ChartLegendItem[] {
    return [
      new ChartLegendItem(
        translate('overview.internal'),
        Color.LIME,
        undefined,
        true
      ),
      new ChartLegendItem(
        translate('overview.external'),
        Color.LIGHT_BLUE,
        undefined,
        true
      ),
    ];
  }
}
