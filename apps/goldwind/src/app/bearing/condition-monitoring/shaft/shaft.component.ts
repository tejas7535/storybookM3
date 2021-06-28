import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { GraphData } from '../../../core/store/reducers/shared/models';
import {
  getShaftLatestGraphData,
  getShaftLatestLoading,
  getShaftLatestTimeStamp,
} from '../../../core/store/selectors';
import { chartOptions } from '../../../shared/chart/chart';
import { UPDATE_SETTINGS } from '../../../shared/constants';

@Component({
  selector: 'goldwind-shaft',
  templateUrl: './shaft.component.html',
  styleUrls: ['./shaft.component.scss'],
})
export class ShaftComponent implements OnInit {
  shaftLatestGraphData$: Observable<GraphData>;
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

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.shaftLatestGraphData$ = this.store.select(getShaftLatestGraphData);

    this.shaftTimeStamp$ = this.store.select(getShaftLatestTimeStamp);
    this.loading$ = this.store.select(getShaftLatestLoading).pipe(take(2));
  }
}
