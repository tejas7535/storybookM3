import { Component, Input } from '@angular/core';

import { EChartOption } from 'echarts';

import { EdmGraphData } from '../../../core/store/reducers/condition-monitoring/models';

@Component({
  selector: 'goldwind-edm-monitor',
  templateUrl: './edm-monitor.component.html',
  styleUrls: ['./edm-monitor.component.scss'],
})
export class EdmMonitorComponent {
  @Input() edmGraphData: EdmGraphData;
  options: EChartOption = {
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    dataZoom: [
      {
        type: 'inside',
      },
      {}, // for slider zoom
    ],
    series: [
      {
        type: 'bar',
        large: true,
      },
    ],
  };
}
