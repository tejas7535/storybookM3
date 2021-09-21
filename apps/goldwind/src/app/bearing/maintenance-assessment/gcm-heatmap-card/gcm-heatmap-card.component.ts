import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';
import { Observable } from 'rxjs';
import {
  getGCHeatmapGraph,
  getGCHeatmapLoading,
} from '../../../core/store/selectors/grease-status/heatmap.selector';
import { GaugeColors } from '../../../shared/chart/chart';
import { GCMHeatmapClassification } from '../../../shared/models';
import { CALENDAR_OPTIONS } from './config';

@Component({
  selector: 'goldwind-gcm-heatmap-card',
  templateUrl: './gcm-heatmap-card.component.html',
  styleUrls: ['./gcm-heatmap-card.component.scss'],
})
export class GcmHeatmapCardComponent {
  loading$: Observable<boolean>;
  private readonly CalGap = (window.innerHeight / 100) * 3;

  chartOptions: EChartsOption = {
    visualMap: {
      min: 0,
      max: 3,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      bottom: '0',
      precision: 0,
      calculable: false,
      categories: [
        'Empty',
        GCMHeatmapClassification.OKAY,
        GCMHeatmapClassification.WARNING,
        GCMHeatmapClassification.ERROR,
      ],
      dimension: 2,
      inRange: {
        color: [
          GaugeColors.GREY,
          GaugeColors.GREEN,
          GaugeColors.YELLOW,
          GaugeColors.RED,
        ],
        symbolSize: [10, 100],
      },
      itemHeight: 2,
    },
    calendar: [
      {
        ...CALENDAR_OPTIONS,
        top: this.CalGap,
        range: ['2021-01-01', '2021-03-31'],
      },
      {
        ...CALENDAR_OPTIONS,
        top: this.CalGap * 6,
        range: ['2021-04-01', '2021-06-30'],
      },
      {
        ...CALENDAR_OPTIONS,
        top: this.CalGap * 11,
        range: ['2021-07-01', '2021-09-30'],
      },
      {
        ...CALENDAR_OPTIONS,
        top: this.CalGap * 16,
        range: ['2021-10-01', '2021-12-31'],
      },
    ],
    tooltip: { show: true, appendToBody: true },
  };
  greaseHeatMapData$: any;

  constructor(private readonly store: Store) {
    this.greaseHeatMapData$ = this.store.select(getGCHeatmapGraph);
    this.loading$ = this.store.select(getGCHeatmapLoading);
  }
}
