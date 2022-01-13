import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { GreaseSensorName } from '../../../core/store/reducers/grease-status/models';
import {
  getGreaseStatusLatestDeteriorationGraphData,
  getGreaseStatusLatestLoading,
  getGreaseStatusLatestTemperatureOpticsGraphData,
  getGreaseStatusLatestWaterContentGraphData,
  getGreaseTimeStamp,
} from '../../../core/store/selectors';
import { chartOptions } from '../../../shared/chart/chart';
import { UPDATE_SETTINGS } from '../../../shared/constants';
import { DashboardMoreInfoDialogComponent } from '../../../shared/dashboard-more-info-dialog/dashboard-more-info-dialog.component';
import { Sensor } from '../../../shared/sensor/sensor.enum';

@Component({
  selector: 'goldwind-grease-monitor',
  templateUrl: './grease-monitor.component.html',
})
export class GreaseMonitorComponent implements OnInit {
  getGreaseStatusLatestWaterContentGraphData$: Observable<EChartsOption>;
  getGreaseStatusLatestTemperatureOpticsGraphData$: Observable<EChartsOption>;
  getGreaseStatusLatestDeteriorationGraphData$: Observable<EChartsOption>;
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
  refresh = UPDATE_SETTINGS.grease.refresh;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

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

    this.getGreaseStatusLatestWaterContentGraphData$ = this.store.select(
      getGreaseStatusLatestWaterContentGraphData,
      { sensorName: greaseSensor }
    );
    this.getGreaseStatusLatestTemperatureOpticsGraphData$ = this.store.select(
      getGreaseStatusLatestTemperatureOpticsGraphData,
      { sensorName: greaseSensor }
    );
    this.getGreaseStatusLatestDeteriorationGraphData$ = this.store.select(
      getGreaseStatusLatestDeteriorationGraphData,
      { sensorName: greaseSensor }
    );

    this.greaseTimeStamp$ = this.store.select(getGreaseTimeStamp);
  }

  /**
   * opens a dialog with more info of the sensor
   */
  openMoreInfo() {
    this.dialog.open(DashboardMoreInfoDialogComponent, {
      maxWidth: '400px',
      data: {
        title: translate('greaseStatus.title'),
        text: `${translate('conditionMonitoring.grease.description')}`,
      },
    });
  }
}
