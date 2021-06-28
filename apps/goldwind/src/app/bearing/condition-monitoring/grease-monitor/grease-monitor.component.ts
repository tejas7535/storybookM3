import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { GreaseSensorName } from '../../../core/store/reducers/grease-status/models';
import { GraphData } from '../../../core/store/reducers/shared/models';
import {
  getGreaseStatusLatestGraphData,
  getGreaseStatusLatestLoading,
  getGreaseTimeStamp,
} from '../../../core/store/selectors';
import { chartOptions } from '../../../shared/chart/chart';
import { Sensor } from '../../../shared/sensor/sensor.enum';

@Component({
  selector: 'goldwind-grease-monitor',
  templateUrl: './grease-monitor.component.html',
  styleUrls: ['./grease-monitor.component.scss'],
})
export class GreaseMonitorComponent implements OnInit {
  greaseStatusLatestGraphData$: Observable<GraphData>;
  greaseTimeStamp$: Observable<string>;
  sensor = false;
  loading$: Observable<boolean>;
  type = Sensor.GC;
  chartOptions: EChartsOption = {
    ...chartOptions,
    legend: {
      ...chartOptions.legend,
      show: false,
    },
  };

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.getGreaseStatusLatestGraphData({ sensor: this.sensor });
    this.loading$ = this.store
      .select(getGreaseStatusLatestLoading)
      .pipe(take(2));
  }

  getGreaseStatusLatestGraphData({ sensor }: { sensor: boolean }): void {
    const greaseSensor = sensor
      ? GreaseSensorName.GCM02
      : GreaseSensorName.GCM01;

    this.greaseStatusLatestGraphData$ = this.store.select(
      getGreaseStatusLatestGraphData,
      { sensorName: greaseSensor }
    );

    this.greaseTimeStamp$ = this.store.select(getGreaseTimeStamp);
  }
}
