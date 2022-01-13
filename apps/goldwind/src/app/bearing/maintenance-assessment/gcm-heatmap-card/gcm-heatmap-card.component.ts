import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { format } from 'date-fns';
import { EChartsOption } from 'echarts';

import {
  getGCHeatmapGraph,
  getGCHeatmapLoading,
} from '../../../core/store/selectors/grease-status/heatmap.selector';
import { GaugeColors } from '../../../shared/chart/chart';
import { DashboardMoreInfoDialogComponent } from '../../../shared/dashboard-more-info-dialog/dashboard-more-info-dialog.component';
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
        range: [
          format(new Date(), 'yyyy-01-01'),
          format(new Date(), 'yyyy-03-31'),
        ],
      },
      {
        ...CALENDAR_OPTIONS,
        top: this.CalGap * 6,
        range: [
          format(new Date(), 'yyyy-04-01'),
          format(new Date(), 'yyyy-06-30'),
        ],
      },
      {
        ...CALENDAR_OPTIONS,
        top: this.CalGap * 11,
        range: [
          format(new Date(), 'yyyy-07-01'),
          format(new Date(), 'yyyy-09-30'),
        ],
      },
      {
        ...CALENDAR_OPTIONS,
        top: this.CalGap * 16,
        range: [
          format(new Date(), 'yyyy-10-01'),
          format(new Date(), 'yyyy-12-31'),
        ],
      },
    ],
    tooltip: { show: true, appendToBody: true },
  };
  greaseHeatMapData$: any;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {
    this.greaseHeatMapData$ = this.store.select(getGCHeatmapGraph);
    this.loading$ = this.store.select(getGCHeatmapLoading);
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
