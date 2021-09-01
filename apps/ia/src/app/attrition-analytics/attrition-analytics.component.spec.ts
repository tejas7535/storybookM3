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
import { EmployeeAnalyticsTranslations } from './models/employee-analytics-translations.model';
import { FeatureSelector } from './models/feature-selector.model';
import { initialState } from './store';
import {
  initializeSelectedFeatures,
  loadEmployeeAnalytics,
} from './store/actions/attrition-analytics.action';
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
      'should set possible features',
      marbles((m) => {
        const expected = m.cold('a', [
          new FeatureSelector('Position', false),
          new FeatureSelector('Age', true),
        ]);

        component.ngOnInit();

        m.expect(component.selectedFeatures$).toBeObservable(expected);
      })
    );

    test('should dispatch action loadEmployeeAnalytics', () => {
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(loadEmployeeAnalytics());
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
});
