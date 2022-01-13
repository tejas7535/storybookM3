import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import {
  getEdmHeatmapSeries,
  getEdmHistogram,
  setEdmChannel,
  stopEdmHistogramPolling,
} from '../../../core/store';
import { setEdmInterval } from '../../../core/store/actions/edm-monitor/edm-monitor.actions';
import { AntennaName } from '../../../core/store/reducers/edm-monitor/models';
import { Interval } from '../../../core/store/reducers/shared/models';
import {
  getEdmInterval,
  getEdmLoading,
} from '../../../core/store/selectors/edm-monitor/edm-monitor.selector';
import { DATE_FORMAT, UPDATE_SETTINGS } from '../../../shared/constants';
import { DashboardMoreInfoDialogComponent } from '../../../shared/dashboard-more-info-dialog/dashboard-more-info-dialog.component';
import { Sensor } from '../../../shared/sensor/sensor.enum';
import { config } from './heatmap-chart.config';

@Component({
  selector: 'goldwind-edm-monitor',
  templateUrl: './edm-monitor.component.html',
})
export class EdmMonitorComponent implements OnInit, OnDestroy {
  /**
   * Used not for polling only displaying on the template
   */
  refresh = UPDATE_SETTINGS.edmhistorgram.refresh;
  /**
   * Retrives the glanced data array used for echarts format
   */
  edmGraphData$: Observable<any>;
  /**
   * To retrieve the correct timerange
   */
  interval$: Observable<Interval>;
  /**
   * passed to the switch component
   */
  sensor = false;
  /**
   * Loading indicator
   */
  loading$: Observable<boolean>;
  /**
   * Used for the radio buttons
   **/
  type = Sensor.ANTENNA;
  /**
   * Config for echarts to render a heatmap
   **/
  chartOptions: EChartsOption = config;
  /**
   * The current selected Antenna Channel
   */
  channel = 'edm-1';
  /**
   * A Subscription to observe the current device id within the path params
   */
  routeParamsSub: Subscription;
  /**
   *
   * @param store
   * @param activate
   */
  public constructor(
    private readonly store: Store,
    private readonly activate: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {}

  /**
   * Deconstructs the component and there used observables
   */
  ngOnDestroy(): void {
    this.routeParamsSub.unsubscribe();
    this.store.dispatch(stopEdmHistogramPolling());
  }
  /**
   * initilaizse the component with nessessarry data from store
   */
  ngOnInit(): void {
    this.updateEDM();
    this.interval$ = this.store.select(getEdmInterval);
    this.loading$ = this.store.select(getEdmLoading);
    this.edmGraphData$ = this.store.select(getEdmHeatmapSeries);
  }
  /**
   * Sets the local route information the get correct device information for the upcomming request
   */
  private updateEDM() {
    this.routeParamsSub = this.activate.params.subscribe((params) => {
      this.store.dispatch(
        getEdmHistogram({
          deviceId: params.id,
        })
      );
    });
  }
  /**
   * Dispatches an event when the interval has changed
   * @deprecated cause no interval can be set anymore
   * @param interval
   */
  setInterval(interval: Interval): void {
    this.store.dispatch(setEdmInterval({ interval }));
  }

  /**
   * @deprecated cause be dont have a legend anymore in favor of the visual map
   * @param name
   * @returns
   */
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
  /**
   * Returns a string contain the tooltip template
   * @param params
   * @returns
   */
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
  /**
   * Get the current Antenna Name with number
   * @param name
   * @returns
   */
  getAntennaLabel(name: string): string {
    const antennaNumber =
      Object.values(AntennaName as any).indexOf(name.replace('Max', '')) + 1;

    return `${translate('sensor.antenna')} ${antennaNumber}`;
  }
  /**
   * Switch between the tweo sensors
   * @param event
   */
  switchSensor(event: any) {
    this.channel = `edm-${event.value}`;
    this.store.dispatch(
      setEdmChannel({ channel: this.channel.replace('-', '') })
    );
  }

  openMoreInfo() {
    this.dialog.open(DashboardMoreInfoDialogComponent, {
      maxWidth: '400px',
      data: {
        title: translate('conditionMonitoring.edmMonitor.title'),
        text: `${translate('conditionMonitoring.edmMonitor.description')}`,
      },
    });
  }
}
