import { Component, Input } from '@angular/core';

import { EChartOption } from 'echarts';

import { GraphData } from '../../../core/store/reducers/shared/models';
import { chartOptions } from '../../../shared/chart/chart';

@Component({
  selector: 'goldwind-shaft',
  templateUrl: './shaft.component.html',
  styleUrls: ['./shaft.component.scss'],
})
export class ShaftComponent {
  @Input() shaftLatestGraphData: GraphData;

  chartOptions: EChartOption = {
    ...chartOptions,
    legend: {
      ...chartOptions.legend,
      show: false,
    },
  };
}
