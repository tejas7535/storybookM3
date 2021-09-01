import { Component, OnInit } from '@angular/core';

import { map, mergeMap, Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { BarChartConfig } from '../shared/charts/models/bar-chart-config.model';
import { EmployeeAnalyticsTranslations } from './models/employee-analytics-translations.model';
import { FeatureSelector } from './models/feature-selector.model';
import {
  changeSelectedFeatures,
  initializeSelectedFeatures,
  loadEmployeeAnalytics,
} from './store/actions/attrition-analytics.action';
import {
  getBarChartConfigsForSelectedFeatures,
  getFeatureSelectors,
} from './store/selectors/attrition-analytics.selector';

@Component({
  selector: 'ia-attrition-analytics',
  templateUrl: './attrition-analytics.component.html',
})
export class AttritionAnalyticsComponent implements OnInit {
  readonly NUMBER_OF_TILES = 4;
  readonly AGE_FEATURE_NAME = 'Age';
  readonly EDUCATION_FEATURE_NAME = 'Education';
  readonly POSITION_FEATURE_NAME = 'Position';

  barChartConfigs$: Observable<BarChartConfig[]>;

  selectedFeatures$: Observable<FeatureSelector[]>;

  constructor(
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadEmployeeAnalytics());
    this.selectDefaultFeatures();

    this.selectedFeatures$ = this.store.select(getFeatureSelectors);

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
      config.belowAverageText = translations.belowAverage;
      config.aboveAverageText = translations.aboveAverage;
      config.series.forEach(
        (serie) =>
          (serie.names = [translations.attrRate, translations.numEmployees])
      );
    });

    return configs;
  }

  selectDefaultFeatures() {
    this.store.dispatch(
      initializeSelectedFeatures({
        features: [
          this.EDUCATION_FEATURE_NAME,
          this.AGE_FEATURE_NAME,
          this.POSITION_FEATURE_NAME,
        ],
      })
    );
  }

  onSelectedFeatures(featureSelectors: FeatureSelector[]): void {
    const features = featureSelectors.map((selector) => selector.name);
    this.store.dispatch(changeSelectedFeatures({ features }));
  }

  anySelectedFeature(selectedFeatures: FeatureSelector[]): boolean {
    return selectedFeatures?.filter((feature) => feature.selected).length > 0;
  }

  trackByFn(index: number): number {
    return index;
  }
}
