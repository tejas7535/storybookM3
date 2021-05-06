import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { ChartSeries } from '../../models/chart-series';

@Component({
  selector: 'ia-overview-chart-legend',
  templateUrl: './overview-chart-legend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewChartLegendComponent {
  @Input() public series: ChartSeries[];

  @Output()
  private readonly toggleSeries: EventEmitter<string> = new EventEmitter();

  public changeSelected(name: string): void {
    this.toggleSeries.emit(name);
  }

  public trackByFn(index: number): number {
    return index;
  }
}
