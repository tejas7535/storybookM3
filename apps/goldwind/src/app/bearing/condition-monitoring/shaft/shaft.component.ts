import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import {
  getShaftLatestGraphData,
  getShaftLatestLoading,
  getShaftLatestTimeStamp,
} from '../../../core/store/selectors';
import { chartOptions } from '../../../shared/chart/chart';
import { UPDATE_SETTINGS } from '../../../shared/constants';
import { DashboardMoreInfoDialogComponent } from '../dashboard-more-info-dialog/dashboard-more-info-dialog.component';

@Component({
  selector: 'goldwind-shaft',
  templateUrl: './shaft.component.html',
})
export class ShaftComponent implements OnInit {
  shaftLatestGraphData$: Observable<EChartsOption>;
  shaftTimeStamp$: Observable<string>;
  refresh = UPDATE_SETTINGS.shaft.refresh;
  loading$: Observable<boolean>;

  chartOptions: EChartsOption = {
    ...chartOptions,
    legend: {
      ...chartOptions.legend,
      show: false,
    },
  };

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.shaftLatestGraphData$ = this.store.select(getShaftLatestGraphData);

    this.shaftTimeStamp$ = this.store.select(getShaftLatestTimeStamp);
    this.loading$ = this.store.select(getShaftLatestLoading).pipe(take(2));
  }
  /**
   * opens a dialog with more info of the sensor
   */
  openMoreInfo() {
    this.dialog.open(DashboardMoreInfoDialogComponent, {
      maxWidth: '400px',
      data: {
        title: translate('conditionMonitoring.shaft.title'),
        text: `
        ${translate(
          'conditionMonitoring.conditionMeasuringEquipment.functionality'
        )}
        `,
      },
    });
  }
}
