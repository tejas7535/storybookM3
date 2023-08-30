import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscription, tap } from 'rxjs';

import { Store } from '@ngrx/store';

import { BarChartConfig } from '../shared/charts/models/bar-chart-config.model';
import { IdValue, SortDirection } from '../shared/models';
import { EditFeatureSelectionComponent } from './edit-feature-selection/edit-feature-selection.component';
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
  getSelectedFeaturesForSelectedRegion,
  getSelectedRegion,
  getYearFromCurrentFilters,
} from './store/selectors/attrition-analytics.selector';

@Component({
  selector: 'ia-attrition-analytics',
  templateUrl: './attrition-analytics.component.html',
  styleUrls: ['./attrition-analytics.scss'],
})
export class AttritionAnalyticsComponent implements OnInit, OnDestroy {
  barChartConfigs$: Observable<BarChartConfig[]>;
  selectedFeatureParams: FeatureParams[];
  availableRegions$: Observable<IdValue[]>;
  year$: Observable<number>;

  selectedFeaturesForSelectedRegion$: Observable<FeatureParams[]>;
  allSelectedFeatures: FeatureParams[];

  featureAnalysisLoading$: Observable<boolean>;
  featureAnalysisOverallAttritionRate$: Observable<number>;

  featureImportanceLoading$: Observable<boolean>;
  featureImportanceGroups$: Observable<FeatureImportanceGroup[]>;
  featureImportanceHasNext$: Observable<boolean>;
  featureImportanceSortDirection$: Observable<SortDirection>;

  region: string;
  selectors$: Observable<FeatureSelector[]>;

  @ViewChild(EditFeatureSelectionComponent)
  editFeatureSelectionComponent: EditFeatureSelectionComponent;

  subscriptions: Subscription[] = [];

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.featureAnalysisLoading$ = this.store.select(
      getEmployeeAnalyticsLoading
    );
    this.availableRegions$ = this.store.select(getAvailableRegionsIdValues);
    this.barChartConfigs$ = this.store.select(
      getBarChartConfigsForSelectedFeatures
    );

    this.year$ = this.store.select(getYearFromCurrentFilters);
    this.selectedFeaturesForSelectedRegion$ = this.store.select(
      getSelectedFeaturesForSelectedRegion
    );
    this.subscriptions.push(
      this.store
        .select(getSelectedFeatureParams)
        .pipe(
          tap(
            (allSelectedFeatures) =>
              (this.allSelectedFeatures = allSelectedFeatures)
          )
        )
        .subscribe(),
      this.store
        .select(getSelectedRegion)
        .pipe(tap((region) => (this.region = region)))
        .subscribe()
    );
    this.selectors$ = this.store.select(getFeatureSelectorsForSelectedRegion);

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

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  loadNextFeatureImportance(): void {
    this.store.dispatch(loadFeatureImportance());
  }

  regionSelected(region: IdValue): void {
    this.store.dispatch(selectRegion({ selectedRegion: region.id }));
  }

  changeSelectedFeatures(selectedFeatures: FeatureParams[]) {
    const allSelectedFeatures = this.replaceRegionSelectedFeatures(
      this.allSelectedFeatures,
      selectedFeatures
    );
    this.store.dispatch(
      changeSelectedFeatures({ features: allSelectedFeatures })
    );
  }

  openEditFeatureSelectionDialog() {
    this.editFeatureSelectionComponent.editFeatureSelection();
  }

  replaceRegionSelectedFeatures(
    allFeatures: FeatureParams[],
    newFeatures: FeatureParams[]
  ) {
    const otherFeatures = allFeatures.filter(
      (feature) => feature.region !== this.region
    );

    return [...otherFeatures, ...newFeatures];
  }
}
