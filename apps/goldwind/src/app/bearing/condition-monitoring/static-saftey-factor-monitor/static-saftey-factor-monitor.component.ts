import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts/types/dist/echarts';

import {
  getStaticSafetyLatestGraphData,
  getStaticSafetyLatestTimeStamp,
  getStaticSafetyLoading,
} from '../../../core/store/selectors/static-safety/static-safety.selector';
import { chartOptions } from '../../../shared/chart/chart';
import { UPDATE_SETTINGS } from '../../../shared/constants/update-settings';

@Component({
  selector: 'goldwind-static-saftey-factor-monitor',
  templateUrl: './static-saftey-factor-monitor.component.html',
  styleUrls: ['./static-saftey-factor-monitor.component.scss'],
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

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.staticSafetyLatestGraphData$ = this.store.select(
      getStaticSafetyLatestGraphData
    );

    this.staticSafetyTimeStamp$ = this.store.select(
      getStaticSafetyLatestTimeStamp
    );
    this.loading$ = this.store.select(getStaticSafetyLoading).pipe(take(2));
  }
}
