import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { LoadSenseState } from '../../../core/store/reducers/load-sense/load-sense.reducer';
import { GraphData } from '../../../core/store/reducers/shared/models';
import {
  getLoadGraphData,
  getLoadSenseMeasturementTimes,
} from '../../../core/store/selectors/';
import { polarChartOptions } from '../../../shared/chart/chart';
import { DATE_FORMAT } from '../../../shared/constants';

@Component({
  selector: 'goldwind-center-load',
  templateUrl: './center-load.component.html',
  styleUrls: ['./center-load.component.scss'],
})
export class CenterLoadComponent implements OnInit {
  @Input() live: boolean;
  loadSenseGraphData$: Observable<GraphData>;
  loadSenseMeasurementTimes$: Observable<string[]>;
  current: string;

  chartOptions: EChartsOption = {
    ...polarChartOptions,
  };

  public constructor(private readonly store: Store<LoadSenseState>) {}

  ngOnInit(): void {
    this.getLoadSenseGraphData();

    this.loadSenseMeasurementTimes$ = this.store.pipe(
      select(getLoadSenseMeasturementTimes),
      tap((val) => {
        this.current =
          this.current ?? val ? this.formatDate(val.pop()) : undefined;
      })
    );
  }

  getLoadSenseGraphData(timestamp?: string): void {
    this.loadSenseGraphData$ = this.store.pipe(
      select(getLoadGraphData, { timestamp })
    );
  }

  timeChange(event: any, loadSenseMeasurementTimes: string[]): void {
    const current = loadSenseMeasurementTimes[event.value];

    this.current = this.formatDate(current);
    this.getLoadSenseGraphData(current);
  }

  formatDate(current: string): string {
    return new Date(current).toLocaleTimeString(
      DATE_FORMAT.local,
      DATE_FORMAT.options
    );
  }
}
