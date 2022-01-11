import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { LegendSelectAction } from '../../../shared/charts/models';
import { ChartLegendItem } from '../../../shared/charts/models/chart-legend-item.model';
import { DoughnutChartData } from '../../../shared/charts/models/doughnut-chart-data.model';
import { SolidDoughnutChartConfig } from '../../../shared/charts/models/solid-doughnut-chart-config.model';

@Component({
  selector: 'ia-reasons-for-leaving-chart',
  templateUrl: './reasons-for-leaving-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonsForLeavingChartComponent {
  @Input() config: SolidDoughnutChartConfig;
  @Input() isLoading: boolean;
  @Input() orgUnit: string;

  @Input() comparedConfig: SolidDoughnutChartConfig;
  @Input() comparedIsLoading: boolean;
  @Input() comparedOrgUnit: string;

  @Input() combinedLegend: ChartLegendItem[] = [];

  _data: [DoughnutChartData[], DoughnutChartData[]];

  defaultData: DoughnutChartData[]; // left chart
  comparedData: DoughnutChartData[]; // right chart

  legendSelectAction: LegendSelectAction;

  @Input()
  set data(data: [DoughnutChartData[], DoughnutChartData[]]) {
    // copy of data is needed to trigger internal reset
    this.defaultData = data[0] ? [...data[0]] : undefined;
    this.comparedData = data[1] ? [...data[1]] : undefined;
  }

  onSelectedLegendItem(action: LegendSelectAction): void {
    this.legendSelectAction = action;
  }
}
