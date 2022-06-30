import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/marbles';

import { LoadingSpinnerComponent } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BarChartConfig } from '../shared/charts/models/bar-chart-config.model';
import { SortDirection } from '../shared/models';
import { SelectInputModule } from '../shared/select-input/select-input.module';
import { AttritionAnalyticsComponent } from './attrition-analytics.component';
import { FeatureAnalysisComponent } from './feature-analysis/feature-analysis.component';
import { FeatureImportanceComponent } from './feature-importance/feature-importance.component';
import { FeatureParams } from './models/feature-params.model';
import { initialState } from './store';
import {
  changeSelectedFeatures,
  loadFeatureImportance,
  toggleFeatureImportanceSort,
} from './store/actions/attrition-analytics.action';
import {
  getEmployeeAnalyticsLoading,
  getFeatureImportanceGroups,
  getFeatureImportanceHasNext,
  getFeatureImportanceLoading,
  getFeatureImportanceSortDirection,
  getFeatureOverallAttritionRate,
} from './store/selectors/attrition-analytics.selector';

describe('AttritionAnalyticsComponent', () => {
  let component: AttritionAnalyticsComponent;
  let store: MockStore;
  let spectator: Spectator<AttritionAnalyticsComponent>;

  const createComponent = createComponentFactory({
    component: AttritionAnalyticsComponent,
    imports: [
      PushModule,
      provideTranslocoTestingModule({ en: {} }),
      SelectInputModule,
      MatCardModule,
      MatChipsModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          attritionAnalytics: initialState,
        },
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    declarations: [
      MockComponent(FeatureAnalysisComponent),
      MockComponent(FeatureImportanceComponent),
      MockComponent(LoadingSpinnerComponent),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should set bar chart configs',
      marbles((m) => {
        const expected = m.cold('a', { config: [] as BarChartConfig[] });

        component.ngOnInit();

        m.expect(component.barChartConfigs$).toBeObservable(expected);
      })
    );

    test(
      'should set featureAnalysisLoading',
      marbles((m) => {
        store.overrideSelector(getEmployeeAnalyticsLoading, true);

        m.expect(component.featureAnalysisLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should set featureImportanceLoading',
      marbles((m) => {
        store.overrideSelector(getFeatureImportanceLoading, true);

        m.expect(component.featureImportanceLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should set featureImportanceGroups',
      marbles((m) => {
        store.overrideSelector(getFeatureImportanceGroups, []);

        m.expect(component.featureImportanceGroups$).toBeObservable(
          m.cold('a', { a: [] })
        );
      })
    );

    test(
      'should set featureImportanceHasNext',
      marbles((m) => {
        store.overrideSelector(getFeatureImportanceHasNext, true);

        m.expect(component.featureImportanceHasNext$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should set featureImportanceSortDirection',
      marbles((m) => {
        store.overrideSelector(
          getFeatureImportanceSortDirection,
          SortDirection.ASC
        );

        m.expect(component.featureImportanceSortDirection$).toBeObservable(
          m.cold('a', { a: SortDirection.ASC })
        );
      })
    );

    test(
      'should set featureAnalysisOverallAttritionRate',
      marbles((m) => {
        store.overrideSelector(getFeatureOverallAttritionRate, 0.3);

        m.expect(component.featureAnalysisOverallAttritionRate$).toBeObservable(
          m.cold('a', { a: 0.3 })
        );
      })
    );
  });

  describe('onSelectedFeatures', () => {
    test('should dispatch selected features', () => {
      const feature1 = { feature: 'test 1' } as FeatureParams;
      const feature2 = { feature: 'test 2' } as FeatureParams;
      const features = [feature1, feature2];

      component.onSelectedFeatures(features);

      expect(store.dispatch).toHaveBeenCalledWith(
        changeSelectedFeatures({ features: [feature1, feature2] })
      );
    });
  });

  describe('loadNextFeatureImportance', () => {
    test('should dispatch action', () => {
      component.loadNextFeatureImportance();

      expect(store.dispatch).toHaveBeenCalledWith(loadFeatureImportance());
    });
  });

  describe('toggleSortFeatureImportance', () => {
    test('should dispatch action', () => {
      component.toggleSortFeatureImportance();

      expect(store.dispatch).toHaveBeenCalledWith(
        toggleFeatureImportanceSort()
      );
    });
  });
});
