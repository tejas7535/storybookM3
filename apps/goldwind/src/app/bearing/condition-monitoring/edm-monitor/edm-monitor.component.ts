import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';
import { EChartOption } from 'echarts';

import { setEdmInterval } from '../../../core/store/actions/edm-monitor/edm-monitor.actions';
import { EdmMonitorState } from '../../../core/store/reducers/edm-monitor/edm-monitor.reducer';
import {
  Antenna,
  AntennaName,
  EdmGraphData,
} from '../../../core/store/reducers/edm-monitor/models';
import { Interval } from '../../../core/store/reducers/shared/models';
import {
  getEdmGraphData,
  getEdmInterval,
} from '../../../core/store/selectors/edm-monitor/edm-monitor.selector';

@Component({
  selector: 'goldwind-edm-monitor',
  templateUrl: './edm-monitor.component.html',
  styleUrls: ['./edm-monitor.component.scss'],
})
export class EdmMonitorComponent implements OnInit {
  edmGraphData$: Observable<EdmGraphData>;
  interval$: Observable<Interval>;
  antenna = false;
  options: EChartOption = {
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    grid: {
      left: 75,
      top: 10,
      right: 50,
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
    tooltip: {
      trigger: 'axis',
    },
  };

  public constructor(private readonly store: Store<EdmMonitorState>) {}

  ngOnInit(): void {
    this.getEdmGraphData({ antennaName: AntennaName.Antenna1 });
    this.interval$ = this.store.pipe(select(getEdmInterval));
  }

  getEdmGraphData(antenna: Antenna): void {
    this.edmGraphData$ = this.store.pipe(select(getEdmGraphData, antenna));
  }

  setInterval(interval: Interval): void {
    this.store.dispatch(setEdmInterval({ interval }));
  }

  toggleAntenna(): void {
    this.antenna = !this.antenna;

    const antennaName = this.antenna
      ? AntennaName.Antenna2
      : AntennaName.Antenna1;
    this.getEdmGraphData({ antennaName });
  }
}
