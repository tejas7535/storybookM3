import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { BearingLoadState } from '../../../core/store/reducers/load-sense/load-sense.reducer';
import { GraphData } from '../../../core/store/reducers/shared/models';
import {
  getAverageLoadGraphData,
  getBearingLoadLatestTimeStamp,
  getLoadAverageLoading,
  getLoadGraphData,
  getLoadLatestLoading,
} from '../../../core/store/selectors';
import { polarChartOptions } from '../../../shared/chart/chart';
import { DATE_FORMAT, UPDATE_SETTINGS } from '../../../shared/constants';

@Component({
  selector: 'goldwind-center-load',
  templateUrl: './center-load.component.html',
  styleUrls: ['./center-load.component.scss'],
})
export class CenterLoadComponent implements OnInit {
  loadSenseGraphData$: Observable<GraphData>;
  timeStamp$: Observable<string>;
  refresh = UPDATE_SETTINGS.shaft.refresh;
  loading$: Observable<boolean>;

  @Input() averageLoad = false;

  chartOptions: EChartsOption = polarChartOptions;

  public constructor(private readonly store: Store<BearingLoadState>) {}

  ngOnInit(): void {
    this.timeStamp$ = this.store.pipe(select(getBearingLoadLatestTimeStamp));

    if (this.averageLoad) {
      this.loadSenseGraphData$ = this.store.pipe(
        select(getAverageLoadGraphData)
      );
      this.loading$ = this.store.pipe(select(getLoadAverageLoading));
    } else {
      this.loadSenseGraphData$ = this.store.pipe(select(getLoadGraphData));
      this.loading$ = this.store.pipe(select(getLoadLatestLoading), take(2));
    }
  }

  formatDate(current: string): string {
    return new Date(current).toLocaleTimeString(
      DATE_FORMAT.local,
      DATE_FORMAT.options
    );
  }
}
