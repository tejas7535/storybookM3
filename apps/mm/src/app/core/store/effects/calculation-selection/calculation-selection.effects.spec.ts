/* eslint-disable jest/expect-expect */
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { LazyListLoaderService, RestService } from '@mm/core/services';
import { LB_AXIAL_DISPLACEMENT } from '@mm/shared/constants/dialog-constant';
import { CALCULATION_OPTIONS_STEP } from '@mm/shared/constants/steps';
import { BearingOption, SearchResult } from '@mm/shared/models';
import { ListValue } from '@mm/shared/models/list-value.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CalculationOptionsActions } from '../../actions';
import { CalculationResultActions } from '../../actions/calculation-result';
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
        useValue: {
          loadOptions: jest.fn(),
          loadBearingSeatsOptions: jest.fn(),
        },
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
      data: ['Bearing 1', 'Bearing 2'],
    } as SearchResult;
    const resultList: BearingOption[] = [
      { title: 'Bearing 1', id: 'Bearing 1' },
      { title: 'Bearing 2', id: 'Bearing 2' },
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

  it('should dispatch multiple actions when fetchBearingData$ is triggered', () => {
    const bearingId = '123';

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingData({ bearingId }),
      });

      const expectedActions = [
        CalculationSelectionActions.setBearing({
          bearingId: '123',
          title: '123',
        }),
        CalculationSelectionActions.setCurrentStep({ step: 1 }),
        CalculationSelectionActions.fetchBearingSeats(),
        CalculationResultActions.fetchBearinxVersions(),
      ];

      expectObservable(spectator.service.fetchBearingData$).toBe('-(bcde)-', {
        b: expectedActions[0],
        c: expectedActions[1],
        d: expectedActions[2],
        e: expectedActions[3],
      });
    });
  });

  it('should dispatch setBearingSeats action when fetchBearingSeats$ is successful', () => {
    const bearing = {
      bearingId: 'bearing1',
    } as Partial<Bearing> as Bearing;
    const bearingSeats: ListValue[] = [{ id: 'seat1', text: 'Seat 1' }];

    facade.getBearing$.mockReturnValue(of(bearing));
    lazyListLoader.loadBearingSeatsOptions.mockReturnValue(of(bearingSeats));

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingSeats(),
      });

      expectObservable(spectator.service.fetchBearingSeats$).toBe('-b-', {
        b: CalculationSelectionActions.setBearingSeats({ bearingSeats }),
      });
    });
  });

  it('should dispatch fetchMeasurementMethods and resetCalculationResult actions when setBearingSeat$ is triggered', () => {
    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.setBearingSeat({ bearingSeatId: '123' }),
      });

      const expectedMarble = '-(bc)-';
      const expectedValues = {
        b: CalculationSelectionActions.fetchMeasurementMethods(),
        c: CalculationResultActions.resetCalculationResult(),
      };

      expectObservable(spectator.service.setBearingSeat$).toBe(
        expectedMarble,
        expectedValues
      );
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

  it('should return empty observable when setMeasurementMethods$ receives multiple measurement methods', () => {
    testScheduler.run(({ hot, expectObservable }) => {
      const measurementMethods: ListValue[] = [
        { id: 'method1', text: 'Method 1' },
        { id: 'method2', text: 'Method 2' },
      ];

      actions$ = hot('-a', {
        a: CalculationSelectionActions.setMeasurementMethods({
          measurementMethods,
        }),
      });

      expectObservable(spectator.service.setMeasurementMethods$).toBe('');
    });
  });

  it('should return empty observable when setMeasurementMethods$ receives empty measurement methods array', () => {
    testScheduler.run(({ hot, expectObservable }) => {
      const measurementMethods: ListValue[] = [];

      actions$ = hot('-a', {
        a: CalculationSelectionActions.setMeasurementMethods({
          measurementMethods,
        }),
      });

      expectObservable(spectator.service.setMeasurementMethods$).toBe('');
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
      const measurementMethod = LB_AXIAL_DISPLACEMENT;

      actions$ = hot('-a', { a: action });
      facade.getMeasurementMethod$.mockReturnValue(of(measurementMethod));

      const expectedMarble = '-(bcde)';
      const expectedValues = {
        b: CalculationSelectionActions.setMountingMethod({
          mountingMethod: 'method1',
        }),
        c: CalculationResultActions.resetCalculationResult(),

        d: CalculationSelectionActions.setCurrentStep({
          step: CALCULATION_OPTIONS_STEP,
        }),
        e: CalculationOptionsActions.fetchPreflightOptions(),
      };

      expectObservable(
        spectator.service.updateMountingMethodAndCurrentStep$
      ).toBe(expectedMarble, expectedValues);
    });
  });
});
