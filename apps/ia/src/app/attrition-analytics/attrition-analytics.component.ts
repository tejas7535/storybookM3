import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { filter, map, mergeMap, Observable, Subscription } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { BarChartConfig } from '../shared/charts/models/bar-chart-config.model';
import { AttritionAnalyticsStateService } from './attrition-analytics-state.service';
import { FeaturesDialogComponent } from './features-dialog/features-dialog.component';
import { EmployeeAnalyticsTranslations } from './models/employee-analytics-translations.model';
import { FeatureSelector } from './models/feature-selector.model';
import {
  changeSelectedFeatures,
  initializeSelectedFeatures,
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
  getFeatureSelectors,
} from './store/selectors/attrition-analytics.selector';
import { FeatureImportanceGroup, SortDirection } from './models';

@Component({
  selector: 'ia-attrition-analytics',
  templateUrl: './attrition-analytics.component.html',
  styleUrls: ['./attrition-analytics.scss'],
})
export class AttritionAnalyticsComponent implements OnInit, OnDestroy {
  readonly NUMBER_OF_TILES = 4;

  barChartConfigs$: Observable<BarChartConfig[]>;
  isLoadingAnalytics$: Observable<boolean>;

  featureImportanceLoading$: Observable<boolean>;
  featureImportanceGroups$: Observable<FeatureImportanceGroup[]>;
  featureImportanceHasNext$: Observable<boolean>;
  featureImportanceSortDirection$: Observable<SortDirection>;

  allFeatureSelectors: FeatureSelector[] = [];

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly store: Store,
    private readonly stateService: AttritionAnalyticsStateService,
    private readonly translocoService: TranslocoService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.selectDefaultFeatures();
    this.isLoadingAnalytics$ = this.store.select(getEmployeeAnalyticsLoading);

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

    this.subscription.add(
      this.store
        .select(getFeatureSelectors)
        .subscribe(
          (selectedFeatures) => (this.allFeatureSelectors = selectedFeatures)
        )
    );

    this.barChartConfigs$ = this.store
      .select(getBarChartConfigsForSelectedFeatures)
      .pipe(
        mergeMap((configs) =>
          this.translocoService
            .selectTranslateObject('barChart', {}, 'attrition-analytics')
            .pipe(
              map((translations: EmployeeAnalyticsTranslations) =>
                this.mapConfigsWithTranslations(configs, translations)
              )
            )
        )
      );
  }

  mapConfigsWithTranslations(
    configs: BarChartConfig[],
    translations: EmployeeAnalyticsTranslations
  ): BarChartConfig[] {
    configs?.forEach((config) => {
      config.belowReferenceValueText = translations.belowOverall;
      config.aboveReferenceValueText = translations.aboveOverall;
      config.referenceValueText = translations.overallAttritionRate;
      config.series.forEach(
        (serie) =>
          (serie.names = [
            translations.attritionRate,
            translations.numEmployees,
          ])
      );
    });

    return configs;
  }

  selectDefaultFeatures(): void {
    this.store.dispatch(
      initializeSelectedFeatures({
        features: this.stateService.getSelectedFeatures(),
      })
    );
  }

  onSelectedFeatures(featureSelectors: FeatureSelector[]): void {
    const features = featureSelectors.map((selector) => selector.feature);
    this.store.dispatch(changeSelectedFeatures({ features }));
    this.stateService.setSelectedFeatures(features);
  }

  trackByFn(index: number): number {
    return index;
  }

  openFeaturesDialog(): void {
    const dialogRef = this.dialog.open(FeaturesDialogComponent, {
      data: this.allFeatureSelectors,
    });

    this.dispatchResultOnClose(dialogRef);
  }

  dispatchResultOnClose(
    dialogRef: MatDialogRef<FeaturesDialogComponent>
  ): void {
    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(filter((result) => result))
        .subscribe((result) => this.onSelectedFeatures(result))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>): void {
    const selectedFeatures = this.allFeatureSelectors.filter(
      (feature) => feature.selected
    );

    moveItemInArray(selectedFeatures, event.previousIndex, event.currentIndex);
    this.onSelectedFeatures(selectedFeatures);
  }

  loadNextFeatureImportance(): void {
    this.store.dispatch(loadFeatureImportance());
  }

  toggleSortFeatureImportance(): void {
    this.store.dispatch(toggleFeatureImportanceSort());
  }
}
