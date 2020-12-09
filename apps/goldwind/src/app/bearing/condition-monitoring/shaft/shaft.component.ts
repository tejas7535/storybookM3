import { Component, Input } from '@angular/core';

import { EChartOption } from 'echarts';

import { GraphData } from '../../../core/store/reducers/shared/models';
import { chartOptions } from '../../../shared/chart/chart';
import { UPDATE_SETTINGS } from '../../../shared/constants';

@Component({
  selector: 'goldwind-shaft',
  templateUrl: './shaft.component.html',
  styleUrls: ['./shaft.component.scss'],
})
export class ShaftComponent {
  @Input() shaftLatestGraphData: GraphData;
  refresh = UPDATE_SETTINGS.shaft.refresh;

  chartOptions: EChartOption = {
    ...chartOptions,
    legend: {
      ...chartOptions.legend,
      show: false,
    },
  };
}
