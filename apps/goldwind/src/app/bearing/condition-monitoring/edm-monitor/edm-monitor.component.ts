import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { setEdmInterval } from '../../../core/store/actions/edm-monitor/edm-monitor.actions';
import { EdmMonitorState } from '../../../core/store/reducers/edm-monitor/edm-monitor.reducer';
import { AntennaName } from '../../../core/store/reducers/edm-monitor/models';
import {
  GraphData,
  Interval,
} from '../../../core/store/reducers/shared/models';
import {
  getEdmGraphData,
  getEdmInterval,
  getEdmLoading,
} from '../../../core/store/selectors/edm-monitor/edm-monitor.selector';
import { axisChartOptions } from '../../../shared/chart/chart';
import { DATE_FORMAT } from '../../../shared/constants';
import { Sensor } from '../../../shared/sensor/sensor.enum';

@Component({
  selector: 'goldwind-edm-monitor',
  templateUrl: './edm-monitor.component.html',
  styleUrls: ['./edm-monitor.component.scss'],
})
export class EdmMonitorComponent implements OnInit {
  edmGraphData$: Observable<GraphData>;
  interval$: Observable<Interval>;
  loading$: Observable<boolean>;
  sensor = false;
  type = Sensor.ANTENNA;
  chartOptions: EChartsOption = {
    ...axisChartOptions,
    grid: {
      left: 75,
      right: 50,
    },
    legend: {
      ...axisChartOptions.legend,
      formatter: (name: string) => this.formatLegend(name),
    },
    tooltip: {
      ...axisChartOptions.tooltip,
      formatter: (params: any) => this.formatTooltip(params),
    },
  };

  public constructor(private readonly store: Store<EdmMonitorState>) {}

  ngOnInit(): void {
    this.getEdmGraphData({ sensor: this.sensor });
    this.interval$ = this.store.pipe(select(getEdmInterval));
    this.loading$ = this.store.pipe(select(getEdmLoading), take(2));
  }

  getEdmGraphData({ sensor }: { sensor: boolean }): void {
    const antenna = sensor ? AntennaName.Antenna2 : AntennaName.Antenna1;

    this.edmGraphData$ = this.store.pipe(
      select(getEdmGraphData, { sensorName: antenna })
    );
  }

  setInterval(interval: Interval): void {
    this.store.dispatch(setEdmInterval({ interval }));
  }

  formatLegend(name: string): string {
    let result: string;
    if (Object.values(AntennaName as any).includes(name)) {
      result = translate(
        'conditionMonitoring.edmMonitor.relativeAmountOfEvents'
      );
    } else if (
      Object.values(AntennaName as any).includes(name.replace('Max', ''))
    ) {
      result = translate('conditionMonitoring.edmMonitor.peakValues');
    }

    return `${result} (${this.getAntennaLabel(name)})`;
  }

  formatTooltip(params: any): string {
    return (
      Array.isArray(params) &&
      params.reduce((acc, param, index) => {
        const result = `${acc}${this.formatLegend(param.seriesName)}: ${
          param.data.value[1]
        }<br>`;

        return index === params.length - 1
          ? `${result}${new Date(param.data.value[0]).toLocaleString(
              DATE_FORMAT.local,
              DATE_FORMAT.options
            )}`
          : `${result}`;
      }, '')
    );
  }

  getAntennaLabel(name: string): string {
    const antennaNumber =
      Object.values(AntennaName as any).indexOf(name.replace('Max', '')) + 1;

    return `${translate('sensor.antenna')} ${antennaNumber}`;
  }
}
