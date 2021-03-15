import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { ShaftState } from '../../../core/store/reducers/shaft/shaft.reducer';
import { GraphData } from '../../../core/store/reducers/shared/models';
import {
  getShaftLatestGraphData,
  getShaftLoading,
  getShaftTimeStamp,
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

  public constructor(private readonly store: Store<ShaftState>) {}

  ngOnInit(): void {
    this.shaftLatestGraphData$ = this.store.pipe(
      select(getShaftLatestGraphData)
    );

    this.shaftTimeStamp$ = this.store.pipe(select(getShaftTimeStamp));
    this.loading$ = this.store.pipe(select(getShaftLoading), take(2));
  }
}
