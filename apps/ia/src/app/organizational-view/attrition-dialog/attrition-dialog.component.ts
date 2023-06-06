import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { EChartsOption, LineSeriesOption } from 'echarts';

import { createFluctuationRateChartConfig } from '../../shared/charts/line-chart/line-chart-utils';
import { ChartType } from '../models';
import {
  getChildAttritionOverTimeOrgChartSeries,
  getChildDimensionName,
  getChildIsLoadingAttritionOverTimeOrgChart,
  getIsLoadingOrgUnitFluctuationRate,
  getOrgUnitFluctuationDialogMeta,
  getParentAttritionOverTimeOrgChartData,
  getParentIsLoadingAttritionOverTimeOrgChart,
  getWorldMapFluctuationDialogMeta,
} from '../store/selectors/organizational-view.selector';
import { AttritionDialogMeta } from './models/attrition-dialog-meta.model';

@Component({
  selector: 'ia-attrition-dialog',
  templateUrl: './attrition-dialog.component.html',
})
export class AttritionDialogComponent implements OnInit {
  parentFluctuationOverTimeData$: Observable<LineSeriesOption>;
  parentFluctuationOverTimeDataLoading$: Observable<boolean>;

  childFluctuationOverTimeData$: Observable<LineSeriesOption>;
  childFluctuationOverTimeDataLoading$: Observable<boolean>;

  meta$: Observable<AttritionDialogMeta>;
  fluctuationLoading$: Observable<boolean>;
  childDimensionName$: Observable<string>;
  fluctuationChartConfig: EChartsOption;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ChartType,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.fluctuationChartConfig = createFluctuationRateChartConfig('', 1);
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

    this.meta$ =
      this.data === ChartType.ORG_CHART
        ? this.store.select(getOrgUnitFluctuationDialogMeta)
        : this.store.select(getWorldMapFluctuationDialogMeta);

    // TODO: consider also world map loading as soon as this is implemented
    this.fluctuationLoading$ = this.store.select(
      getIsLoadingOrgUnitFluctuationRate
    );
  }
}
