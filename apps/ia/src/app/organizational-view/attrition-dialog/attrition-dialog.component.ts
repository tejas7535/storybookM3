import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable, take } from 'rxjs';

import { Store } from '@ngrx/store';
import { EChartsOption, LineSeriesOption } from 'echarts';

import { getDefaultFluctuationChartConfig } from '../../overview/store/selectors/overview.selector';
import { ChartType, SeriesType } from '../models';
import { changeAttritionOverTimeSeries } from '../store/actions/organizational-view.action';
import {
  getChildAttritionOverTimeOrgChartSeries,
  getChildDimensionName,
  getChildIsLoadingAttritionOverTimeOrgChart,
  getParentAttritionOverTimeOrgChartData,
  getParentIsLoadingAttritionOverTimeOrgChart,
  getSelectedSeriesType,
} from '../store/selectors/organizational-view.selector';
import { AttritionDialogMeta } from './models/attrition-dialog-meta.model';

@Component({
  selector: 'ia-attrition-dialog',
  templateUrl: './attrition-dialog.component.html',
  styleUrls: ['./attrition-dialog.component.scss'],
})
export class AttritionDialogComponent implements OnInit {
  parentFluctuationOverTimeData$: Observable<LineSeriesOption[]>;
  parentFluctuationOverTimeDataLoading$: Observable<boolean>;

  childFluctuationOverTimeData$: Observable<LineSeriesOption[]>;
  childFluctuationOverTimeDataLoading$: Observable<boolean>;

  fluctuationLoading$: Observable<boolean>;
  childDimensionName$: Observable<string>;
  fluctuationChartConfig$: Observable<EChartsOption>;
  meta: AttritionDialogMeta;

  selectedSeriesType$: Observable<SeriesType>;
  seriesType = SeriesType;
  mergeOptions: EChartsOption;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { type: ChartType; meta: AttritionDialogMeta },
    private readonly store: Store
  ) {
    this.meta = data.meta;
  }

  ngOnInit(): void {
    this.fluctuationChartConfig$ = this.store.select(
      getDefaultFluctuationChartConfig
    );
    this.parentFluctuationOverTimeData$ = this.store.select(
      getParentAttritionOverTimeOrgChartData
    );
    this.parentFluctuationOverTimeDataLoading$ = this.store.select(
      getParentIsLoadingAttritionOverTimeOrgChart
    );
    this.childFluctuationOverTimeData$ = this.store.select(
      getChildAttritionOverTimeOrgChartSeries
    );
    this.childFluctuationOverTimeDataLoading$ = this.store.select(
      getChildIsLoadingAttritionOverTimeOrgChart
    );
    this.childDimensionName$ = this.store.select(getChildDimensionName);
    this.selectedSeriesType$ = this.store
      .select(getSelectedSeriesType)
      .pipe(take(1));
  }

  onSeriesTypeChange(serie: SeriesType): void {
    this.store.dispatch(changeAttritionOverTimeSeries({ serie }));

    this.mergeOptions = {
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter:
            serie === SeriesType.UNFORCED_FLUCTUATION ? '{value}%' : undefined,
        },
        minInterval: serie === SeriesType.UNFORCED_FLUCTUATION ? undefined : 1,
      },
    };
  }
}
