import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { BarChartConfig } from '../shared/charts/models/bar-chart-config.model';
import { Color } from '../shared/models/color.enum';
import { loadEmployeeAnalytics } from './store/actions/attrition-analytics.action';
import { getEmployeeAnalyticsBarChartConfig } from './store/selectors/attrition-analytics.selector';

@Component({
  selector: 'ia-attrition-analytics',
  templateUrl: './attrition-analytics.component.html',
})
export class AttritionAnalyticsComponent implements OnInit {
  readonly AGE_FEATURE_NAME = 'Age';
  readonly EDUCATION_FEATURE_NAME = 'Education';
  readonly POSITION_FEATURE_NAME = 'Position';

  ageChartConfig$: Observable<BarChartConfig>;
  educationChartConfig$: Observable<BarChartConfig>;
  positionChartConfig$: Observable<BarChartConfig>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadEmployeeAnalytics());
    this.ageChartConfig$ = this.store.select(
      getEmployeeAnalyticsBarChartConfig(this.AGE_FEATURE_NAME, Color.LIME)
    );
    this.educationChartConfig$ = this.store.select(
      getEmployeeAnalyticsBarChartConfig(
        this.EDUCATION_FEATURE_NAME,
        Color.LIGHT_BLUE
      )
    );
    this.positionChartConfig$ = this.store.select(
      getEmployeeAnalyticsBarChartConfig(
        this.POSITION_FEATURE_NAME,
        Color.PICTON_BLUE
      )
    );
  }
}
