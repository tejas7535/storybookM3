import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { translate } from '@ngneat/transloco';

import { LegendSelectAction } from '../../shared/charts/models';
import { ChartLegendItem } from '../../shared/charts/models/chart-legend-item.model';
import { DoughnutChartData } from '../../shared/charts/models/doughnut-chart-data.model';
import { DoughnutConfig } from '../../shared/charts/models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../../shared/charts/models/doughnut-series-config.model';
import { EmployeeListDialogMetaHeadings } from '../../shared/dialogs/employee-list-dialog/models/employee-list-dialog-meta-headings.model';
import { Color, EmployeeWithAction } from '../../shared/models';

@Component({
  selector: 'ia-entries-exits',
  templateUrl: './entries-exits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntriesExitsComponent {
  private _dimensionHint: string;

  initialConfig = [
    new DoughnutSeriesConfig(
      [new DoughnutChartData(0)],
      translate('overview.workforceBalance.internal'),
      Color.LIME
    ),
    new DoughnutSeriesConfig(
      [new DoughnutChartData(0)],
      translate('overview.workforceBalance.external'),
      Color.LIGHT_BLUE
    ),
  ];

  legendSelectAction: LegendSelectAction;
  entriesDoughnutConfig: DoughnutConfig;
  exitsDoughnutConfig: DoughnutConfig;

  legend: ChartLegendItem[] = [];

  @Input() isDataLoading: boolean;
  @Input() entriesCount: number;
  @Input() exitsCount: number;
  @Input() totalEmployeesCount: number;
  @Input() exitEmployees: EmployeeWithAction[];
  @Input() exitEmployeesLoading: boolean;
  @Input() entryEmployees: EmployeeWithAction[];
  @Input() entryEmployeesLoading: boolean;
  @Input() leaversListDialogMetaHeadings: EmployeeListDialogMetaHeadings;
  @Input() newJoinersListDialogMetaHeadings: EmployeeListDialogMetaHeadings;

  @Input() set dimensionHint(dimensionHint: string) {
    this._dimensionHint = dimensionHint;
    this.createLegend();
  }

  get dimensionHint(): string {
    return this._dimensionHint;
  }

  @Input() set data(data: [DoughnutConfig, DoughnutConfig]) {
    // copy of data is needed to trigger internal reset
    this.entriesDoughnutConfig = data[0];
    this.exitsDoughnutConfig = data[1];
  }

  @Output()
  readonly loadExitEmployees: EventEmitter<void> = new EventEmitter();
  @Output()
  readonly loadEntryEmployees: EventEmitter<void> = new EventEmitter();

  onSelectedLegendItem(action: LegendSelectAction): void {
    this.legendSelectAction = action;
  }

  createLegend(): void {
    this.legend = [
      new ChartLegendItem(
        translate('overview.workforceBalance.internal'),
        Color.LIME,
        translate('overview.workforceBalance.hintInternal', {
          dimension: this.dimensionHint,
        }),
        true
      ),
      new ChartLegendItem(
        translate('overview.workforceBalance.external'),
        Color.LIGHT_BLUE,
        translate('overview.workforceBalance.hintExternal'),
        true
      ),
    ];
  }

  triggerExitEmployeesAction(): void {
    this.loadExitEmployees.emit();
  }

  triggerEntryEmployeesAction(): void {
    this.loadEntryEmployees.emit();
  }
}
