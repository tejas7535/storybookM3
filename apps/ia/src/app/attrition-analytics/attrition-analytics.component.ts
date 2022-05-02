import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { BarChartConfig } from '../shared/charts/models/bar-chart-config.model';
import { SortDirection } from '../shared/models';
import {
  FeatureImportanceGroup,
  FeatureParams,
  FeatureSelector,
} from './models';
import {
  changeSelectedFeatures,
  loadFeatureImportance,
  toggleFeatureImportanceSort,
} from './store/actions/attrition-analytics.action';
import {
  getBarChartConfigsForSelectedFeatures,
  getEmployeeAnalyticsLoading,
  getFeatureImportanceGroups,
  getFeatureImportanceHasNext,
  getFeatureImportanceLoading,
  getFeatureImportanceSortDirection,
  getFeatureOverallAttritionRate,
  getFeatureSelectors,
} from './store/selectors/attrition-analytics.selector';

@Component({
  selector: 'ia-attrition-analytics',
  templateUrl: './attrition-analytics.component.html',
  styleUrls: ['./attrition-analytics.scss'],
})
export class AttritionAnalyticsComponent implements OnInit {
  barChartConfigs$: Observable<BarChartConfig[]>;
  featureAnalysisLoading$: Observable<boolean>;
  featureAnalysisSelectors$: Observable<FeatureSelector[]>;
  featureAnalysisOverallAttritionRate$: Observable<number>;

  featureImportanceLoading$: Observable<boolean>;
  featureImportanceGroups$: Observable<FeatureImportanceGroup[]>;
  featureImportanceHasNext$: Observable<boolean>;
  featureImportanceSortDirection$: Observable<SortDirection>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.featureAnalysisLoading$ = this.store.select(
      getEmployeeAnalyticsLoading
    );
    this.featureAnalysisSelectors$ = this.store.select(getFeatureSelectors);
    this.barChartConfigs$ = this.store.select(
      getBarChartConfigsForSelectedFeatures
    );

    this.featureImportanceLoading$ = this.store.select(
      getFeatureImportanceLoading
    );
    this.featureImportanceGroups$ = this.store.select(
      getFeatureImportanceGroups
    );
    this.featureImportanceHasNext$ = this.store.select(
      getFeatureImportanceHasNext
    );
    this.featureImportanceSortDirection$ = this.store.select(
      getFeatureImportanceSortDirection
    );

    this.featureAnalysisOverallAttritionRate$ = this.store.select(
      getFeatureOverallAttritionRate
    );
  }

  onSelectedFeatures(features: FeatureParams[]): void {
    this.store.dispatch(changeSelectedFeatures({ features }));
  }

  loadNextFeatureImportance(): void {
    this.store.dispatch(loadFeatureImportance());
  }

  toggleSortFeatureImportance(): void {
    this.store.dispatch(toggleFeatureImportanceSort());
  }
}
