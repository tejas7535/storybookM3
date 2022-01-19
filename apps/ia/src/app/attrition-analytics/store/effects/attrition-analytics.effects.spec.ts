import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { AttritionAnalyticsService } from '../../attrition-analytics.service';
import { EmployeeAnalytics } from '../../models/employee-analytics.model';
import { FeatureParams } from '../../models/feature-params.model';
import { AttritionAnalyticsState } from '..';
import {
  changeOrderOfFeatures,
  changeSelectedFeatures,
  initializeSelectedFeatures,
  loadAvailableFeatures,
  loadAvailableFeaturesFailure,
  loadAvailableFeaturesSuccess,
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
  loadFeatureImportance,
  loadFeatureImportanceFailure,
  loadFeatureImportanceSuccess,
} from '../actions/attrition-analytics.action';
import { AttritionAnalyticsEffects } from './attrition-analytics.effects';
import {
  FeatureImportanceGroup,
  FeatureImportanceType,
  Slice,
} from '../../models';

describe('Attrition Anayltics Effects', () => {
  let spectator: SpectatorService<AttritionAnalyticsEffects>;
  let actions$: any;
  let employeeAnalyticsService: AttritionAnalyticsService;
  let action: any;
  let effects: AttritionAnalyticsEffects;
  let store: MockStore;

  const ageFeature: FeatureParams = {
    feature: 'Age',
    region: 'Asia',
    year: 2021,
    month: 4,
  };
  const positionFeature: FeatureParams = {
    feature: 'Position',
    region: 'Europe',
    year: 2020,
    month: 11,
  };

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: AttritionAnalyticsEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: AttritionAnalyticsService,
        useValue: {
          getEmployeeAnalytics: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(AttritionAnalyticsEffects);
    employeeAnalyticsService = spectator.inject(AttritionAnalyticsService);
    store = spectator.inject(MockStore);
  });

  describe('loadAvailableFeatures$', () => {
    beforeEach(() => {
      action = loadAvailableFeatures();
    });

    test(
      'should return loadAvailableFeaturesSuccess when REST call is successful',
      marbles((m) => {
        const data: FeatureParams[] = [];
        const result = loadAvailableFeaturesSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        employeeAnalyticsService.getAvailableFeatures = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAvailableFeatures$).toBeObservable(expected);
        m.flush();
        expect(
          employeeAnalyticsService.getAvailableFeatures
        ).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return loadAvailableFeaturesFailure when REST call failed',
      marbles((m) => {
        const result = loadAvailableFeaturesFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        employeeAnalyticsService.getAvailableFeatures = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadAvailableFeatures$).toBeObservable(expected);
        m.flush();
        expect(
          employeeAnalyticsService.getAvailableFeatures
        ).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('loadEmployeeAnalytics$', () => {
    let request: FeatureParams[];

    beforeEach(() => {
      request = [];
      action = loadEmployeeAnalytics({ params: request });
    });

    test(
      'should return employeeAnalyticsSuccess when REST call is successful',
      marbles((m) => {
        const data: EmployeeAnalytics[] = [];
        const result = loadEmployeeAnalyticsSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        employeeAnalyticsService.getEmployeeAnalytics = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadEmployeeAnalytics$).toBeObservable(expected);
        m.flush();
        expect(
          employeeAnalyticsService.getEmployeeAnalytics
        ).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return employeeAnalyticsFailure when REST call failed',
      marbles((m) => {
        const result = loadEmployeeAnalyticsFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        employeeAnalyticsService.getEmployeeAnalytics = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadEmployeeAnalytics$).toBeObservable(expected);
        m.flush();
        expect(
          employeeAnalyticsService.getEmployeeAnalytics
        ).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('initializeSelectedFeatures$', () => {
    const features = [
      { feature: 'Age' } as FeatureParams,
      { feature: 'Position' } as FeatureParams,
    ];

    beforeEach(() => {
      action = initializeSelectedFeatures({
        features,
      });
    });

    test(
      'should initialize selected features when selected features undefined',
      marbles((m) => {
        const result = changeSelectedFeatures({
          features,
        });
        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: result });

        store.select = jest
          .fn()
          .mockReturnValue(of(undefined as FeatureParams[]));

        store.select = jest
          .fn()
          .mockReturnValue(of(undefined as FeatureParams[]));

        m.expect(effects.initializeSelectedFeatures$).toBeObservable(expected);
      })
    );
  });

  describe('changeSelectedFeatures$', () => {
    const featureParams = [ageFeature, positionFeature];

    beforeEach(() => {
      action = changeSelectedFeatures({ features: featureParams });
    });

    test(
      'should load Employee Analytics when selected different features',
      marbles((m) => {
        store.setState({
          attritionAnalytics: {
            employeeAnalytics: {
              features: { data: [ageFeature] },
            },
          } as AttritionAnalyticsState,
        });

        const result = loadEmployeeAnalytics({ params: featureParams });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.changeSelectedFeatures$).toBeObservable(expected);
        m.flush();
      })
    );

    test(
      'should change Order Of Features when selected same features in different order',
      marbles((m) => {
        store.setState({
          attritionAnalytics: {
            employeeAnalytics: {
              features: { data: featureParams.reverse() },
            },
          } as AttritionAnalyticsState,
        });
        const result = changeOrderOfFeatures({ features: featureParams });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.changeSelectedFeatures$).toBeObservable(expected);
      })
    );
  });

  describe('changeOrderOfFeatures$', () => {
    const selectedFeatures = [ageFeature, positionFeature];

    beforeEach(() => {
      action = changeOrderOfFeatures({ features: selectedFeatures });
    });

    test(
      'should load employee analytics with oreded features',
      marbles((m) => {
        store.setState({
          attritionAnalytics: {
            employeeAnalytics: {
              features: { data: [positionFeature, ageFeature] },
            },
          } as AttritionAnalyticsState,
        });

        const result = loadEmployeeAnalyticsSuccess({
          data: selectedFeatures as EmployeeAnalytics[],
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.changeOrderOfFeatures$).toBeObservable(expected);
      })
    );
  });

  describe('loadFeatureImportance$', () => {
    let region: string;
    let year: number;
    let month: number;
    let page: number;
    let size: number;

    beforeEach(() => {
      region = 'China';
      year = 2022;
      month = 9;
      page = 0;
      size = 5;
      action = loadFeatureImportance({ region, year, month, page, size });
    });

    test(
      'should return loadFeatureImportanceSuccess when REST call is successful',
      marbles((m) => {
        const data: Slice<FeatureImportanceGroup> = {
          hasNext: true,
          hasPrevious: false,
          pageable: {
            pageNumber: 0,
            pageSize: 10,
          },
          content: [
            {
              feature: 'Test',
              type: FeatureImportanceType.NUMERIC,
              dataPoints: [
                {
                  shapValue: 1,
                  value: 'test a',
                  yaxisPos: 18,
                  colorMap: 0.3,
                },
              ],
            },
          ],
        };
        const result = loadFeatureImportanceSuccess({
          data,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: data,
        });
        const expected = m.cold('--b', { b: result });

        employeeAnalyticsService.getFeatureImportance = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadFeatureImportance$).toBeObservable(expected);
        m.flush();
        expect(
          employeeAnalyticsService.getFeatureImportance
        ).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return loadFeatureImportanceFailure when REST call failed',
      marbles((m) => {
        const result = loadFeatureImportanceFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        employeeAnalyticsService.getFeatureImportance = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadFeatureImportance$).toBeObservable(expected);
        m.flush();
        expect(
          employeeAnalyticsService.getFeatureImportance
        ).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('ngrxOnInitEffects', () => {
    test('should dispatch loadAvailableFeatures action', () => {
      effects['store'].dispatch = jest.fn();

      effects.ngrxOnInitEffects();

      expect(effects['store'].dispatch).toHaveBeenCalledWith(
        loadAvailableFeatures()
      );

      expect(effects['store'].dispatch).toHaveBeenCalledWith(
        loadFeatureImportance({
          region: 'China',
          year: 2020,
          month: 8,
          page: 0,
          size: 3,
        })
      );
    });
  });
});
