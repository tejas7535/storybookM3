import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { setEdmInterval } from '../../../core/store/actions/edm-monitor/edm-monitor.actions';
import { AntennaName } from '../../../core/store/reducers/edm-monitor/models';
import { Interval } from '../../../core/store/reducers/shared/models';
import {
  getEdmInterval,
  getEdmLoading,
} from '../../../core/store/selectors/edm-monitor/edm-monitor.selector';
import { DATE_FORMAT, UPDATE_SETTINGS } from '../../../shared/constants';
import { Sensor } from '../../../shared/sensor/sensor.enum';
import {
  getEdmHeatmapSeries,
  getEdmHistogram,
  stopEdmHistogramPolling,
} from '../../../core/store';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';

@Component({
  selector: 'goldwind-edm-monitor',
  templateUrl: './edm-monitor.component.html',
  styleUrls: ['./edm-monitor.component.scss'],
})
export class EdmMonitorComponent implements OnInit, OnDestroy {
  refresh = UPDATE_SETTINGS.edmhistorgram.refresh;

  edmGraphData$: Observable<any>;
  interval$: Observable<Interval>;
  sensor = false;
  loading$: Observable<boolean>;
  type = Sensor.ANTENNA;
  chartOptions: EChartsOption = {
    yAxis: {
      type: 'category',
      data: [0, 10, 100, 1000, 10_000],
      splitArea: {
        show: true,
      },
      splitLine: {
        show: true,
        interval: 1,
        lineStyle: { color: 'white' },
      },
      axisLabel: {
        color: '#646464',
      },
      axisLine: {
        lineStyle: {
          color: '#ced5da',
        },
      },
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      data: [],
      splitArea: {
        show: true,
      },
      splitLine: {
        show: true,
        interval: 'auto',
        lineStyle: {
          color: 'white',
        },
      },
      axisLabel: {
        color: '#646464',
        formatter: (d: any) => format(new Date(d), 'YYY-MM-dd'),
      },
      axisLine: {
        lineStyle: {
          color: '#ced5da',
        },
      },
    },
    gradientColor: ['#B5ECF8', '#0E656D'],
    visualMap: {
      min: 0,
      max: 100_000,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      show: true,
      z: 0,
    },
    series: [],
    grid: {
      top: 0,
      left: 40,
      right: 0,
    },
    tooltip: {
      position: 'top',
      formatter: (params: any) => `
        <div class="grid grid-cols-2 grid-rows-3 gap-2">
          <span>Number of Incidents:</span>
          <span>${params.data[2]}</span>
          <span>Class:</span>
          <span>${this.getClassificationString(params.data[1])}</span>
          <span>Time:</span> <span>${this.reformatLegendDate(
            params.data[0]
          )}</span>

        </div>
      `,
    },
  };
  channel = 'edm-1';
  routeParamsSub: Subscription;

  public constructor(
    private readonly store: Store,
    private readonly activate: ActivatedRoute
  ) {}

  /**
   *
   * @param index
   * @returns
   */
  public getClassificationString(index: number): string {
    switch (index) {
      case 0:
        return '0 - 100';
      case 1:
        return '100 - 1000';
      case 2:
        return '1000 - 10000';
      case 3:
        return '10000 - 100000';
      case 4:
        return '> 100000';
      default:
        return 'n.A.';
    }
  }
  ngOnDestroy(): void {
    this.routeParamsSub.unsubscribe();
    this.store.dispatch(stopEdmHistogramPolling());
  }
  ngOnInit(): void {
    this.updateEDM();
    this.interval$ = this.store.select(getEdmInterval);
    this.loading$ = this.store.select(getEdmLoading);
    this.edmGraphData$ = this.store.select(getEdmHeatmapSeries);
  }

  private updateEDM() {
    this.routeParamsSub = this.activate.params.subscribe((params) => {
      this.store.dispatch(
        getEdmHistogram({
          deviceId: params.id,
          channel: this.channel,
        })
      );
    });
  }

  setInterval(interval: Interval): void {
    this.store.dispatch(setEdmInterval({ interval }));
  }

  reformatLegendDate(date: string) {
    return format(new Date(date), 'MM/dd/yyyy HH:mm');
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
      // eslint-disable-next-line unicorn/no-array-reduce
      params.reduce((acc, param, index) => {
        const result = `${acc}${this.formatLegend(param.seriesName)}: ${
          param.data?.value[1]
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

  switchSensor(event: any) {
    this.channel = `edm-${event.value}`;
    this.updateEDM();
  }
}
