import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { translate } from '@jsverse/transloco';

import { DoughnutChartData } from '../../../shared/charts/models';
import { SolidDoughnutChartConfig } from '../../../shared/charts/models/solid-doughnut-chart-config.model';
import { SolidDoughnutChartComponent } from '../../../shared/charts/solid-doughnut-chart/solid-doughnut-chart.component';
import { CHART_COLOR_PALETTE, Color } from '../../../shared/models';
import { ReasonForLeavingTab } from '../../models';

@Component({
  selector: 'ia-reasons-for-leaving-chart',
  templateUrl: './reasons-for-leaving-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ReasonsForLeavingChartComponent {
  config: SolidDoughnutChartConfig;
  @Output() selectedReason = new EventEmitter<string>();
  @Input() data: DoughnutChartData[];
  @Input() isLoading: boolean;
  @Input() children: { reason: string; children: DoughnutChartData[] }[];

  @ViewChild(SolidDoughnutChartComponent) chart: SolidDoughnutChartComponent;

  @Input() set selectedTab(_tab: ReasonForLeavingTab) {
    if (this.chart) {
      this.chart.resetChart();
    }
  }

  @Input() set side(side: 'left' | 'right') {
    this.config = {
      ...this.config,
      title: '',
      color: Object.values(CHART_COLOR_PALETTE),
      side,
    };
  }

  @Input() set title(title: string) {
    this.config = {
      ...this.config,
      title,
    };
  }

  @Input() set conductedInterviewsInfo(info: { conducted: number }) {
    const title = translate(
      'reasonsAndCounterMeasures.reasonsForLeaving.chart.conductedInfo',
      {
        conducted: info?.conducted,
      }
    );
    const titleTooltip = `<div style="max-width: 200px; white-space: normal;">
    ${translate(
      'reasonsAndCounterMeasures.reasonsForLeaving.chart.conductedInfoTooltip'
    )}</div>`;

    if (info) {
      this.config = {
        ...this.config,
        subTitle: {
          formatter: `${title} {icon|\uE88E}`,
          rich: {
            icon: {
              fontFamily: 'Material Icons',
              fontSize: 14,
              color: Color.TEXT_PRIMARY,
              padding: [0, 0, 2, 0],
            },
          },
        },
        titleTooltip,
      };
    }
  }

  onSelectedReason(reason: string): void {
    this.selectedReason.emit(reason);
  }
}
