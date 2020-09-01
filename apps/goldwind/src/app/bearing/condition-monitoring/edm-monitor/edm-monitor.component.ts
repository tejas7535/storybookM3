import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EChartOption } from 'echarts';

import {
  AntennaName,
  EdmGraphData,
} from '../../../core/store/reducers/condition-monitoring/models';

@Component({
  selector: 'goldwind-edm-monitor',
  templateUrl: './edm-monitor.component.html',
  styleUrls: ['./edm-monitor.component.scss'],
})
export class EdmMonitorComponent {
  @Input() edmGraphData: EdmGraphData;
  @Output() readonly antennaChange: EventEmitter<{
    antennaName: AntennaName;
  }> = new EventEmitter();

  antenna = false;
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

  toggleAntenna(): void {
    this.antenna = !this.antenna;

    const antennaName = this.antenna
      ? AntennaName.Antenna2
      : AntennaName.Antenna1;
    this.antennaChange.emit({ antennaName });
  }
}
