import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EChartOption } from 'echarts';

import { GraphData } from '../../../core/store/reducers/shared/models';
import { chartOptions } from '../../../shared/chart/chart';
import { BearingRoutePath } from '../../bearing-route-path.enum';

@Component({
  selector: 'goldwind-grease-monitor',
  templateUrl: './grease-monitor.component.html',
  styleUrls: ['./grease-monitor.component.scss'],
})
export class GreaseMonitorComponent {
  @Input() greaseStatusLatestGraphData: GraphData;
  chartOptions: EChartOption = {
    ...chartOptions,
    legend: {
      ...chartOptions.legend,
      show: false,
    },
  };

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  navigateToGreaseStatus(): void {
    this.router.navigate([`../${BearingRoutePath.GreaseStatusPath}`], {
      relativeTo: this.activatedRoute.parent,
    });
  }
}
