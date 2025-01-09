/* eslint-disable jest/expect-expect */
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { LazyListLoaderService, RestService } from '@mm/core/services';
import { BearingOption, SearchResult } from '@mm/shared/models';
import { ListValue } from '@mm/shared/models/lazy-list-loader/mm-list-value.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CalculationOptionsActions } from '../../actions';
import { CalculationSelectionActions } from '../../actions/calculation-selection';
import { CalculationSelectionFacade } from '../../facades/calculation-selection/calculation-selection.facade';
import { Bearing } from '../../models/calculation-selection-state.model';
import { CalculationSelectionEffects } from './calculation-selection.effects';

describe('CalculationSelectionEffects', () => {
  let spectator: SpectatorService<CalculationSelectionEffects>;
  let actions$: Observable<any>;
  let restService: jest.Mocked<RestService>;
  let testScheduler: TestScheduler;
  let facade: jest.Mocked<CalculationSelectionFacade>;
  let lazyListLoader: jest.Mocked<LazyListLoaderService>;

  const createEffectService = createServiceFactory({
    service: CalculationSelectionEffects,
    mocks: [RestService],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: { getBearingSearch: jest.fn() },
      },
      {
        provide: CalculationSelectionFacade,
        useValue: {
          getBearing$: jest.fn(),
          getBearingSeatId$: jest.fn(),
          getMeasurementMethod$: jest.fn(),
        },
      },
      {
        provide: LazyListLoaderService,
        useValue: { loadOptions: jest.fn() },
      },
    ],
  });

  beforeEach(() => {
    spectator = createEffectService();
    restService = spectator.inject(RestService);
    lazyListLoader = spectator.inject(LazyListLoaderService);
    facade = spectator.inject(
      CalculationSelectionFacade
    ) as jest.Mocked<CalculationSelectionFacade>;
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should dispatch searchBearingSuccess action when searchBearing$ is successful', () => {
    const query = 'testQuery';
    const response = {
      data: [
        { data: { title: 'Bearing 1', id: '1' } },
        { data: { title: 'Bearing 2', id: '2' } },
      ],
    } as SearchResult;
    const resultList: BearingOption[] = [
      { title: 'Bearing 1', id: '1' },
      { title: 'Bearing 2', id: '2' },
    ];

    restService.getBearingSearch.mockReturnValue(of(response));

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.searchBearingList({ query }),
      });

      expectObservable(spectator.service.searchBearing$).toBe('-b-', {
        b: CalculationSelectionActions.searchBearingSuccess({ resultList }),
      });
    });
  });

  it('should dispatch multiple actions when fetchBearingData$ is successful', () => {
    const bearingId = '1';
    const result = {
      data: {
        bearing: { data: { id: '1', title: 'Bearing 1' } },
        series: { data: { id: '2', title: 'Series 1' } },
        type: { data: { id: '3', title: 'Type 1' } },
      },
    };

    restService.getBearingRelations.mockReturnValue(of(result));

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingData({ bearingId }),
      });

      expectObservable(spectator.service.fetchBearingData$).toBe('-(bcdef)-', {
        b: CalculationSelectionActions.setBearing({
          bearingId: '1',
          title: 'Bearing 1',
        }),
        c: CalculationSelectionActions.setBearingType({
          typeId: '3',
          title: 'Type 1',
        }),
        d: CalculationSelectionActions.setBearingSeries({
          seriesId: '2',
          title: 'Series 1',
        }),
        e: CalculationSelectionActions.setCurrentStep({ step: 1 }),
        f: CalculationSelectionActions.fetchBearingSeats(),
      });
    });
  });

  it('should dispatch setBearingSeats action when fetchBearingSeats$ is successful', () => {
    const bearing = {
      type: { typeId: 'type1' },
      series: { seriesId: 'series1' },
      bearingId: 'bearing1',
    } as Partial<Bearing> as Bearing;
    const bearingSeats: ListValue[] = [{ id: 'seat1', text: 'Seat 1' }];

    facade.getBearing$.mockReturnValue(of(bearing));
    lazyListLoader.loadOptions.mockReturnValue(of(bearingSeats));

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingSeats(),
      });

      expectObservable(spectator.service.fetchBearingSeats$).toBe('-b-', {
        b: CalculationSelectionActions.setBearingSeats({ bearingSeats }),
      });
    });
  });

  it('should dispatch fetchMeasurementMethods action when setBearingSeat$ is triggered', () => {
    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.setBearingSeat({ bearingSeatId: '123' }),
      });

      expectObservable(spectator.service.setBearingSeat$).toBe('-b-', {
        b: CalculationSelectionActions.fetchMeasurementMethods(),
      });
    });
  });

  it('should dispatch setMeasurementMethods action when fetchMeasurementMethods$ is successful', () => {
    const bearing = {
      type: { typeId: 'type1' },
      series: { seriesId: 'series1' },
      bearingId: 'bearing1',
    } as Partial<Bearing> as Bearing;
    const bearingSeatId = 'seat1';
    const measurementMethods: ListValue[] = [
      { id: 'method1', text: 'Method 1' },
    ];

    facade.getBearing$.mockReturnValue(of(bearing));
    facade.getBearingSeatId$.mockReturnValue(of(bearingSeatId));

    lazyListLoader.loadOptions.mockReturnValue(of(measurementMethods));

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchMeasurementMethods(),
      });

      expectObservable(spectator.service.fetchMeasurementMethods$).toBe('-b-', {
        b: CalculationSelectionActions.setMeasurementMethods({
          measurementMethods,
        }),
      });
    });
  });

  it('should dispatch setMeasurementMethod and fetchMountingMethods actions when setMeasurementMethods$ is successful', () => {
    testScheduler.run(({ hot, expectObservable }) => {
      const measurementMethods: ListValue[] = [
        { id: 'method1', text: 'Method 1' },
      ];
      actions$ = hot('-a', {
        a: CalculationSelectionActions.setMeasurementMethods({
          measurementMethods,
        }),
      });

      const expectedMarble = '-(bc)';
      const expectedValues = {
        b: CalculationSelectionActions.setMeasurementMethod({
          measurementMethod: 'method1',
        }),
        c: CalculationSelectionActions.fetchMountingMethods(),
      };

      expectObservable(spectator.service.setMeasurementMethods$).toBe(
        expectedMarble,
        expectedValues
      );
    });
  });

  it('should dispatch fetchMountingMethods action when setMeasurementMethod$ is successful', () => {
    actions$ = of(
      CalculationSelectionActions.setMeasurementMethod({
        measurementMethod: 'method1',
      })
    );

    spectator.service.setMeasurementMethod$.subscribe((action) => {
      expect(action).toEqual(
        CalculationSelectionActions.fetchMountingMethods()
      );
    });
  });

  it('should dispatch setMountingMethods action when fetchMountingMethods$ is successful', () => {
    testScheduler.run(({ hot, expectObservable }) => {
      const bearing = {
        type: { typeId: 'type1' },
        series: { seriesId: 'series1' },
        bearingId: 'bearing1',
      } as Partial<Bearing> as Bearing;
      const bearingSeatId = 'seat1';
      const measurementMethodId = 'method1';
      const mountingMethods: ListValue[] = [
        { id: 'mounting1', text: 'Mounting 1' },
      ];

      facade.getBearing$.mockReturnValue(of(bearing));
      facade.getBearingSeatId$.mockReturnValue(of(bearingSeatId));

      facade.getMeasurementMethod$.mockReturnValue(of(measurementMethodId));
      lazyListLoader.loadOptions.mockReturnValue(of(mountingMethods));

      actions$ = hot('-a', {
        a: CalculationSelectionActions.fetchMountingMethods(),
      });

      const expectedMarble = '-b';
      const expectedValues = {
        b: CalculationSelectionActions.setMountingMethods({ mountingMethods }),
      };

      expectObservable(spectator.service.fetchMountingMethods$).toBe(
        expectedMarble,
        expectedValues
      );
    });
  });

  it('should dispatch setMountingMethod, setCurrentStep, and fetchPreflightOptions actions', () => {
    testScheduler.run(({ hot, expectObservable }) => {
      const action =
        CalculationSelectionActions.updateMountingMethodAndCurrentStep({
          mountingMethod: 'method1',
        });
      const measurementMethod = 'LB_AXIAL_DISPLACEMENT';

      actions$ = hot('-a', { a: action });
      facade.getMeasurementMethod$.mockReturnValue(of(measurementMethod));

      const expectedMarble = '-(bcd)';
      const expectedValues = {
        b: CalculationSelectionActions.setMountingMethod({
          mountingMethod: 'method1',
        }),
        c: CalculationSelectionActions.setCurrentStep({ step: 3 }),
        d: CalculationOptionsActions.fetchPreflightOptions(),
      };

      expectObservable(
        spectator.service.updateMountingMethodAndCurrentStep$
      ).toBe(expectedMarble, expectedValues);
    });
  });

  it('should dispatch setMountingMethod, setCurrentStep, and fetchPreflightOptions actions with different step', () => {
    testScheduler.run(({ hot, expectObservable }) => {
      const action =
        CalculationSelectionActions.updateMountingMethodAndCurrentStep({
          mountingMethod: 'method2',
        });
      const measurementMethod = 'OTHER_METHOD';

      actions$ = hot('-a', { a: action });
      facade.getMeasurementMethod$.mockReturnValue(of(measurementMethod));

      const expectedMarble = '-(bcd)';
      const expectedValues = {
        b: CalculationSelectionActions.setMountingMethod({
          mountingMethod: 'method2',
        }),
        c: CalculationSelectionActions.setCurrentStep({ step: 4 }),
        d: CalculationOptionsActions.fetchPreflightOptions(),
      };

      expectObservable(
        spectator.service.updateMountingMethodAndCurrentStep$
      ).toBe(expectedMarble, expectedValues);
    });
  });
});
