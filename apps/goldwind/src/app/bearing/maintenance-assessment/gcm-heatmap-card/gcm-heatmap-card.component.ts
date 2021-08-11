import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { EChartsOption, format, time, number } from 'echarts';
import { Observable, of } from 'rxjs';
import { getGCHeatmapResult } from '../../../core/store/selectors/grease-status/heatmap.selector';

@Component({
  selector: 'goldwind-gcm-heatmap-card',
  templateUrl: './gcm-heatmap-card.component.html',
  styleUrls: ['./gcm-heatmap-card.component.css'],
})
export class GcmHeatmapCardComponent {
  loading$: Observable<boolean> = of(false); // TODO get Value from Store
  /**
   * TODO: Compute in seperate class and store
   */
  chartOptions: EChartsOption = {
    visualMap: {
      min: 0,
      max: 3,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 600,
    },
    calendar: [
      {
        top: 50,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: ['2021-01-01', '2021-03-31'],
        itemStyle: {
          borderWidth: 0.5,
        },
        monthLabel: { show: true },
        yearLabel: { show: true },
      },
      {
        top: 200,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: ['2021-04-01', '2021-06-30'],
        itemStyle: {
          borderWidth: 0.5,
        },
        yearLabel: { show: true },
      },
      {
        top: 350,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: ['2021-07-01', '2021-09-30'],
        itemStyle: {
          borderWidth: 0.5,
        },
        yearLabel: { show: true },
      },
      {
        top: 500,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: ['2021-10-01', '2021-12-31'],
        itemStyle: {
          borderWidth: 0.5,
        },
        yearLabel: { show: true },
      },
    ],
    tooltip: { show: true },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      calendarIndex: 1, // TODO: has to be the correctt one according to the date
      data: [
        [new Date('2021-2-12'), 3],
        [new Date('2021-3-12'), 2],
        [new Date('2021-4-12'), 2],
        [new Date('2021-2-3'), 3],
        [new Date('2021-12-12'), 1],
      ],
    },
  };
  greaseHeatMapData$: any;

  constructor(private readonly store: Store) {
    this.greaseHeatMapData$ = this.store.select(getGCHeatmapResult);
  }
}
