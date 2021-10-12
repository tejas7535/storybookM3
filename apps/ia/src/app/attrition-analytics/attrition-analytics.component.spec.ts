import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';
import { marbles } from 'rxjs-marbles/marbles';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BarChartComponent } from '../shared/charts/bar-chart/bar-chart.component';
import { BarChartConfig } from '../shared/charts/models/bar-chart-config.model';
import { AttritionAnalyticsComponent } from './attrition-analytics.component';
import { EmployeeAnalyticsComponent } from './employee-analytics/employee-analytics.component';
import { FeaturesDialogComponent } from './features-dialog/features-dialog.component';
import { FeaturesDialogModule } from './features-dialog/features-dialog.module';
import { EmployeeAnalyticsTranslations } from './models/employee-analytics-translations.model';
import { FeatureSelector } from './models/feature-selector.model';
import { initialState } from './store';
import {
  changeSelectedFeatures,
  initializeSelectedFeatures,
} from './store/actions/attrition-analytics.action';
import { getEmployeeAnalyticsLoading } from './store/selectors/attrition-analytics.selector';
import {
  createBarchartConfigForAge,
  createDummyBarChartSerie,
} from './store/selectors/attrition-analytics.selector.spec.factory';

describe('AttritionAnalyticsComponent', () => {
  let component: AttritionAnalyticsComponent;
  let store: MockStore;
  let spectator: Spectator<AttritionAnalyticsComponent>;

  const createComponent = createComponentFactory({
    component: AttritionAnalyticsComponent,
    imports: [
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
      FeaturesDialogModule,
      MatDialogModule,
      MatIconModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          attritionAnalytics: initialState,
        },
      }),
    ],
    declarations: [MockComponent(BarChartComponent)],
    entryComponents: [EmployeeAnalyticsComponent],
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
      'should set bat chart configs',
      marbles((m) => {
        const expected = m.cold('a', { config: [] as BarChartConfig[] });

        component.ngOnInit();

        m.expect(component.barChartConfigs$).toBeObservable(expected);
      })
    );

    test(
      'should set is loading',
      marbles((m) => {
        store.overrideSelector(getEmployeeAnalyticsLoading, true);

        m.expect(component.isLoading$).toBeObservable(m.cold('a', { a: true }));
      })
    );

    test('should set default features', () => {
      component.selectDefaultFeatures = jest.fn();

      component.ngOnInit();

      expect(component.selectDefaultFeatures).toHaveBeenCalled();
    });

    test('should add subscription', () => {
      component['subscription'].add = jest.fn();

      component.ngOnInit();

      expect(component['subscription'].add).toHaveBeenCalledTimes(1);
    });
  });

  describe('selectDefaultFeatures', () => {
    test('should select default features', () => {
      const expectedDefaultFeatures = {
        features: [
          component.EDUCATION_FEATURE_NAME,
          component.AGE_FEATURE_NAME,
          component.POSITION_FEATURE_NAME,
        ],
      };
      component.selectDefaultFeatures();

      expect(store.dispatch).toHaveBeenCalledWith(
        initializeSelectedFeatures(expectedDefaultFeatures)
      );
    });
  });

  describe('mapConfigsWithTranslations', () => {
    test('should return configs with translations', () => {
      const series = createDummyBarChartSerie('red');
      const barChart = createBarchartConfigForAge(series);
      const translations = new EmployeeAnalyticsTranslations(
        'below',
        'above',
        'attr rate',
        'num employees'
      );

      const result = component.mapConfigsWithTranslations(
        [barChart],
        translations
      );

      expect(result.length).toEqual(1);
      expect(result[0].belowAverageText).toEqual(translations.belowAverage);
      expect(result[0].aboveAverageText).toEqual(translations.aboveAverage);
      expect(result[0].series[0].names).toEqual(
        expect.arrayContaining([
          translations.attrRate,
          translations.numEmployees,
        ])
      );
    });
  });

  describe('onSelectedFeatures', () => {
    test('should dispatch selected features', () => {
      const featureSelectors = [
        { name: 'test 1', selected: true },
        { name: 'test 2', selected: true },
      ];

      component.onSelectedFeatures(featureSelectors);

      expect(store.dispatch).toHaveBeenCalledWith(
        changeSelectedFeatures({ features: ['test 1', 'test 2'] })
      );
    });
  });

  describe('anySelectedFeature', () => {
    test('should return true if any selected', () => {
      const featureSelectors = [
        { name: 'test 1', selected: true },
        { name: 'test 2', selected: true },
      ];

      const result = component.anySelectedFeature(featureSelectors);

      expect(result).toBeTruthy();
    });

    test('should return false if no selections', () => {
      const featureSelectors = [
        { name: 'test 1', selected: false },
        { name: 'test 2', selected: false },
      ];

      const result = component.anySelectedFeature(featureSelectors);

      expect(result).toBeFalsy();
    });
    test('should return false if undefined', () => {
      const features: FeatureSelector[] = undefined;
      const result = component.anySelectedFeature(features);

      expect(result).toBeFalsy();
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });

  describe('openFeaturesDialog', () => {
    test('should open dialog', () => {
      component.selectedFeatures = [];
      component['dialog'].open = jest.fn();
      component.dispatchResultOnClose = jest.fn();

      component.openFeaturesDialog();

      expect(component['dialog'].open).toHaveBeenCalledWith(
        FeaturesDialogComponent,
        expect.objectContaining({ data: [] })
      );
      expect(component.dispatchResultOnClose).toHaveBeenCalledWith(
        component['dialog'].open(FeaturesDialogComponent, {
          data: component.selectedFeatures,
        })
      );
    });
  });

  describe('dispatchResultOnClose', () => {
    test('should emit result on close', () => {
      component.onSelectedFeatures = jest.fn();
      component['subscription'].add = jest.fn();
      const result = [new FeatureSelector('Age', true)];
      const dialogRef = {
        afterClosed: () => of(result),
      } as MatDialogRef<FeaturesDialogComponent>;

      component.dispatchResultOnClose(dialogRef);

      expect(component['subscription'].add).toHaveBeenCalled();
      expect(component.onSelectedFeatures).toHaveBeenCalledWith(result);
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component['subscription'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toBeCalledTimes(1);
    });
  });
});
