import { Component, Input } from '@angular/core';

import { EChartOption } from 'echarts';

import { Message } from '../../../core/store/reducers/condition-monitoring/models';
import { chartOptions } from '../../../shared/chart/chart';

@Component({
  selector: 'goldwind-center-load',
  templateUrl: './center-load.component.html',
  styleUrls: ['./center-load.component.scss'],
})
export class CenterLoadComponent {
  @Input() currentMessage: Message;
  @Input() live: boolean;

  data: any = [];

  chartOptions: EChartOption = {
    ...chartOptions,
    polar: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    angleAxis: {
      type: 'value',
      startAngle: 0,
      max: 360,
      clockwise: false,
    },
    radiusAxis: {
      type: 'value',
    },
  };

  centerLoadGraphData = {
    series: [
      {
        name: 'Load inner',
        type: 'line',
        coordinateSystem: 'polar',
        data: [
          [0.5, 0],
          [0.7, 5],
          [0.6, 10],
          [0.6, 15],
          [0.4, 25],
          [0.6, 30],
        ],
        areaStyle: {},
      },
      {
        name: 'Load Line outer',
        type: 'line',
        coordinateSystem: 'polar',
        data: [
          [0.85, 0],
          [0.8, 5],
          [0.82, 10],
          [0.79, 15],
          [0.81, 25],
          [0.86, 30],
        ],
      },
    ],
  };
}
