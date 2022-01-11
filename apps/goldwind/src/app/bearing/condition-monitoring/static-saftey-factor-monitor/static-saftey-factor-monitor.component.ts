import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts/types/dist/echarts';

import {
  getStaticSafetyLatestGraphData,
  getStaticSafetyLatestTimeStamp,
  getStaticSafetyLoading,
} from '../../../core/store/selectors/static-safety/static-safety.selector';
import { chartOptions } from '../../../shared/chart/chart';
import { UPDATE_SETTINGS } from '../../../shared/constants/update-settings';
import { DashboardMoreInfoDialogComponent } from '../dashboard-more-info-dialog/dashboard-more-info-dialog.component';

@Component({
  selector: 'goldwind-static-saftey-factor-monitor',
  templateUrl: './static-saftey-factor-monitor.component.html',
})
export class StaticSafteyFactorMonitorComponent implements OnInit {
  refresh = UPDATE_SETTINGS.staticSafety.refresh;

  chartOptions: EChartsOption = {
    ...chartOptions,
    legend: {
      ...chartOptions.legend,
      show: false,
    },
  };
  staticSafetyTimeStamp$: Observable<string>;
  loading$: Observable<boolean>;
  staticSafetyLatestGraphData$: Observable<EChartsOption>;

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.staticSafetyLatestGraphData$ = this.store.select(
      getStaticSafetyLatestGraphData
    );

    this.staticSafetyTimeStamp$ = this.store.select(
      getStaticSafetyLatestTimeStamp
    );
    this.loading$ = this.store.select(getStaticSafetyLoading).pipe(take(2));
  }

  /**
   * opens a dialog with more info of the sensor
   */
  openMoreInfo() {
    this.dialog.open(DashboardMoreInfoDialogComponent, {
      maxWidth: '400px',
      data: {
        title: translate(
          'conditionMonitoring.static-saftey-factor-monitor.title'
        ),
        text: `
        ${translate(
          'conditionMonitoring.conditionMeasuringEquipment.functionality'
        )}
        `,
      },
    });
  }
}
