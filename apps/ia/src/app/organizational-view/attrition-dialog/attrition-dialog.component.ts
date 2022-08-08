import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getSelectOrgUnitValueShort } from '../../core/store/selectors';
import { ChartType } from '../models/chart-type.enum';
import {
  getAttritionOverTimeOrgChartData,
  getIsLoadingAttritionOverTimeOrgChart,
  getIsLoadingOrgUnitFluctuationRate,
  getOrgUnitFluctuationDialogMeta,
  getWorldMapFluctuationDialogMeta,
} from '../store/selectors/organizational-view.selector';
import { AttritionDialogMeta } from './models/attrition-dialog-meta.model';

@Component({
  selector: 'ia-attrition-dialog',
  templateUrl: './attrition-dialog.component.html',
})
export class AttritionDialogComponent implements OnInit {
  public fluctuationOverTimeData$: Observable<any>;
  public fluctuationOverTimeDataLoading$: Observable<boolean>;

  public meta$: Observable<AttritionDialogMeta>;
  public fluctuationLoading$: Observable<boolean>;
  public referenceOrgUnit$: Observable<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ChartType,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.fluctuationOverTimeData$ = this.store.select(
      getAttritionOverTimeOrgChartData
    );
    this.fluctuationOverTimeDataLoading$ = this.store.select(
      getIsLoadingAttritionOverTimeOrgChart
    );
    this.referenceOrgUnit$ = this.store.select(getSelectOrgUnitValueShort);

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
