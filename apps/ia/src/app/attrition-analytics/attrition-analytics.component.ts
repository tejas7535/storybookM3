import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { BarChartConfig } from '../shared/charts/models/bar-chart-config.model';
import { IdValue, SortDirection } from '../shared/models';
import {
  FeatureImportanceGroup,
  FeatureParams,
  FeatureSelector,
} from './models';
import {
  changeSelectedFeatures,
  loadFeatureImportance,
  selectRegion,
} from './store/actions/attrition-analytics.action';
import {
  getAvailableRegionsIdValues,
  getBarChartConfigsForSelectedFeatures,
  getEmployeeAnalyticsLoading,
  getFeatureImportanceGroups,
  getFeatureImportanceHasNext,
  getFeatureImportanceLoading,
  getFeatureOverallAttritionRate,
  getFeatureSelectorsForSelectedRegion,
  getSelectedFeatureParams,
  getSelectedRegion,
  getYearFromCurrentFilters,
} from './store/selectors/attrition-analytics.selector';

@Component({
  selector: 'ia-attrition-analytics',
  templateUrl: './attrition-analytics.component.html',
  styleUrls: ['./attrition-analytics.scss'],
})
export class AttritionAnalyticsComponent implements OnInit {
  barChartConfigs$: Observable<BarChartConfig[]>;
  selectedFeatureParams: FeatureParams[];
  availableRegions$: Observable<IdValue[]>;
  selectedRegion$: Observable<string>;
  year$: Observable<number>;

  allFeatureParams$: Observable<FeatureParams[]>;

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
    this.availableRegions$ = this.store.select(getAvailableRegionsIdValues);
    this.selectedRegion$ = this.store.select(getSelectedRegion);
    this.year$ = this.store.select(getYearFromCurrentFilters);
    this.allFeatureParams$ = this.store.select(getSelectedFeatureParams);

    this.featureAnalysisSelectors$ = this.store.select(
      getFeatureSelectorsForSelectedRegion
    );
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

  regionSelected(region: IdValue) {
    this.store.dispatch(selectRegion({ selectedRegion: region.id }));
  }
}
