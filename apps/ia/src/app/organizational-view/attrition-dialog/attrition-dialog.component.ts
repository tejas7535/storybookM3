import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getAttritionOverTimeOrgChartData,
  getIsLoadingAttritionOverTimeOrgChart,
} from '../store/selectors/organizational-view.selector';
import { AttritionDialogMeta } from './models/attrition-dialog-meta.model';

@Component({
  selector: 'ia-attrition-dialog',
  templateUrl: './attrition-dialog.component.html',
})
export class AttritionDialogComponent implements OnInit {
  public data$: Observable<any>;
  public attritionRateLoading$: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public meta: AttritionDialogMeta,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.data$ = this.store.select(getAttritionOverTimeOrgChartData);
    this.attritionRateLoading$ = this.store.select(
      getIsLoadingAttritionOverTimeOrgChart
    );
  }
}
