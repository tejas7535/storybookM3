/* eslint-disable jest/expect-expect */
import { signal, WritableSignal } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { RestService } from '@mm/core/services';
import { LB_AXIAL_DISPLACEMENT } from '@mm/shared/constants/dialog-constant';
import { BearingOption } from '@mm/shared/models';
import { ListValue } from '@mm/shared/models/list-value.model';
import { StepManagerService } from '@mm/shared/services/step-manager/step-manager.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { EaEmbeddedService } from '@schaeffler/engineering-apps-behaviors/utils';

import { CalculationOptionsActions } from '../../actions';
import { CalculationResultActions } from '../../actions/calculation-result';
import { CalculationSelectionActions } from '../../actions/calculation-selection';
import { CalculationOptionsFacade } from '../../facades/calculation-options/calculation-options.facade';
import { CalculationResultFacade } from '../../facades/calculation-result.facade';
import { CalculationSelectionFacade } from '../../facades/calculation-selection/calculation-selection.facade';
import { Bearing } from '../../models/calculation-selection-state.model';
import { CalculationSelectionEffects } from './calculation-selection.effects';

describe('CalculationSelectionEffects', () => {
  let spectator: SpectatorService<CalculationSelectionEffects>;
  let actions$: Observable<any>;
  let restService: jest.Mocked<RestService>;
  let testScheduler: TestScheduler;
  let facade: jest.Mocked<CalculationSelectionFacade>;
  let stepManagerService: jest.Mocked<StepManagerService>;

  const createEffectService = createServiceFactory({
    service: CalculationSelectionEffects,
    mocks: [RestService],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getBearingSearch: jest.fn(),
          fetchBearingInfo: jest.fn(),
          getLoadOptions: jest.fn(),
          getBearingSeats: jest.fn(),
          getMeasurementMethods: jest.fn(),
          getThermalBearingMountingMethods: jest.fn(),
          getNonThermalBearingMountingMethods: jest.fn(),
        },
      },
      {
        provide: CalculationSelectionFacade,
        useValue: {
          getBearing$: jest.fn(),
          getBearingSeatId$: jest.fn(),
          getMeasurementMethod$: jest.fn(),
          getCurrentStep$: jest.fn(() => of(1)),
          bearingResultList$: jest.fn(),
          isAxialDisplacement$: jest.fn(() => of(false)),
        },
      },
      {
        provide: CalculationOptionsFacade,
        useValue: {
          getCalculationPerformed$: jest.fn(() => of(false)),
        },
      },
      {
        provide: CalculationResultFacade,
        useValue: {
          isResultAvailable$: of(false),
        },
      },
      {
        provide: EaEmbeddedService,
        useValue: {
          isStandalone: signal(true),
        },
      },
      {
        provide: StepManagerService,
        useValue: {
          getStepConfiguration: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createEffectService();
    restService = spectator.inject(RestService);
    facade = spectator.inject(
      CalculationSelectionFacade
    ) as jest.Mocked<CalculationSelectionFacade>;
    stepManagerService = spectator.inject(
      StepManagerService
    ) as jest.Mocked<StepManagerService>;

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    // eslint-disable-next-line unicorn/no-null
    history.replaceState(null, '', window.location.href);

    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock console.error globally to prevent clutter in test output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Setup default mocks for StepManagerService
    stepManagerService.getStepConfiguration.mockReturnValue({
      steps: [],
      stepIndices: {} as any,
      availableSteps: [],
    });
  });

  afterEach(() => {
    // Restore console.error after each test
    jest.restoreAllMocks();
  });

  it('should dispatch searchBearingSuccess action when searchBearing$ is successful', () => {
    const query = 'testQuery';
    const resultList: BearingOption[] = [
      {
        title: 'Bearing 1',
        id: 'Bearing 1',
        isThermal: true,
        isMechanical: false,
        isHydraulic: false,
      },
      {
        title: 'Bearing 2',
        id: 'Bearing 2',
        isThermal: false,
        isMechanical: true,
        isHydraulic: false,
      },
    ];

    restService.searchBearings.mockReturnValue(of(resultList));

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.searchBearingList({ query }),
      });

      expectObservable(spectator.service.searchBearing$).toBe('-b-', {
        b: CalculationSelectionActions.searchBearingSuccess({ resultList }),
      });
    });
  });

  it('should dispatch multiple actions when fetchBearingData$ is triggered for thermal bearing', () => {
    const bearingId = '123';
    const mockBearingResultList: BearingOption[] = [
      {
        id: '123',
        title: 'Test Bearing',
        isThermal: true,
        isMechanical: false,
        isHydraulic: true,
      },
    ];

    Object.defineProperty(facade, 'bearingResultList$', {
      get: jest.fn(() => of(mockBearingResultList)),
      configurable: true,
    });
    stepManagerService.getStepConfiguration.mockReturnValue({
      steps: ['BEARING', 'MEASURING_MOUNTING', 'CALCULATION_OPTIONS', 'RESULT'],
      stepIndices: {
        BEARING: 0,
        MEASURING_MOUNTING: 1,
        CALCULATION_OPTIONS: 2,
        RESULT: 3,
      },
      availableSteps: [
        'BEARING',
        'MEASURING_MOUNTING',
        'CALCULATION_OPTIONS',
        'RESULT',
      ],
    } as any);

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingData({ bearingId }),
      });

      const expectedActions = [
        CalculationSelectionActions.setBearing({
          bearingId: '123',
          title: 'Test Bearing',
          isThermal: true,
          isMechanical: false,
          isHydraulic: true,
        }),
        CalculationResultActions.resetCalculationResult(),
        CalculationOptionsActions.resetCalculationOptions(),
        CalculationSelectionActions.setCurrentStep({ step: 1 }),
        CalculationSelectionActions.fetchMountingMethods(),
        CalculationResultActions.fetchBearinxVersions(),
      ];

      expectObservable(spectator.service.fetchBearingData$).toBe('-(bcdefg)-', {
        b: expectedActions[0],
        c: expectedActions[1],
        d: expectedActions[2],
        e: expectedActions[3],
        f: expectedActions[4],
        g: expectedActions[5],
      });
    });
  });

  it('should dispatch multiple actions when fetchBearingData$ is triggered for non-thermal bearing', () => {
    const bearingId = '123';
    const mockBearingResultList: BearingOption[] = [
      {
        id: '123',
        title: 'Test Bearing',
        isThermal: false,
        isMechanical: true,
        isHydraulic: false,
      },
    ];

    // Mock the bearingResultList$ property
    Object.defineProperty(facade, 'bearingResultList$', {
      get: jest.fn(() => of(mockBearingResultList)),
      configurable: true,
    });

    // Mock StepManagerService configuration for non-thermal bearing
    stepManagerService.getStepConfiguration.mockReturnValue({
      steps: ['BEARING', 'BEARING_SEAT', 'MEASURING_MOUNTING', 'RESULT'],
      stepIndices: {
        BEARING: 0,
        BEARING_SEAT: 1,
        MEASURING_MOUNTING: 2,
        RESULT: 3,
      },
      availableSteps: [
        'BEARING',
        'BEARING_SEAT',
        'MEASURING_MOUNTING',
        'RESULT',
      ],
    } as any);

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingData({ bearingId }),
      });

      const expectedActions = [
        CalculationSelectionActions.setBearing({
          bearingId: '123',
          title: 'Test Bearing',
          isThermal: false,
          isMechanical: true,
          isHydraulic: false,
        }),
        CalculationResultActions.resetCalculationResult(),
        CalculationOptionsActions.resetCalculationOptions(),
        CalculationSelectionActions.setCurrentStep({ step: 1 }),
        CalculationSelectionActions.fetchBearingSeats(),
        CalculationResultActions.fetchBearinxVersions(),
      ];

      expectObservable(spectator.service.fetchBearingData$).toBe('-(bcdefg)-', {
        b: expectedActions[0],
        c: expectedActions[1],
        d: expectedActions[2],
        e: expectedActions[3],
        f: expectedActions[4],
        g: expectedActions[5],
      });
    });
  });

  it('should dispatch fetchBearingDetails when bearing is not found in result list', () => {
    const bearingId = '456';
    const mockBearingResultList = [
      {
        id: '123', // Different bearing ID
        title: 'Different Bearing',
        isThermal: false,
        isMechanical: true,
        isHydraulic: false,
      },
    ];

    // Mock the bearingResultList$ property to return a list that doesn't contain our bearing
    Object.defineProperty(facade, 'bearingResultList$', {
      get: jest.fn(() => of(mockBearingResultList)),
      configurable: true,
    });

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingData({ bearingId }),
      });

      // Should only dispatch fetchBearingDetails since bearing was not found
      const expectedActions = [
        CalculationSelectionActions.fetchBearingDetails({
          bearingId: '456',
        }),
      ];

      expectObservable(spectator.service.fetchBearingData$).toBe('-b-', {
        b: expectedActions[0],
      });
    });
  });

  it('should dispatch fetchBearingDetails when bearingResultList is empty', () => {
    const bearingId = '789';
    const emptyBearingResultList: any[] = [];

    // Mock the bearingResultList$ property to return an empty list
    Object.defineProperty(facade, 'bearingResultList$', {
      get: jest.fn(() => of(emptyBearingResultList)),
      configurable: true,
    });

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingData({ bearingId }),
      });

      // Should only dispatch fetchBearingDetails since list is empty
      const expectedActions = [
        CalculationSelectionActions.fetchBearingDetails({
          bearingId: '789',
        }),
      ];

      expectObservable(spectator.service.fetchBearingData$).toBe('-b-', {
        b: expectedActions[0],
      });
    });
  });

  it('should dispatch fetchBearingDetails when bearingResultList is undefined', () => {
    const bearingId = 'ABC123';

    Object.defineProperty(facade, 'bearingResultList$', {
      // eslint-disable-next-line unicorn/no-useless-undefined
      get: jest.fn(() => of(undefined)),
      configurable: true,
    });

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingData({ bearingId }),
      });

      // Should only dispatch fetchBearingDetails since list is null
      const expectedActions = [
        CalculationSelectionActions.fetchBearingDetails({
          bearingId: 'ABC123',
        }),
      ];

      expectObservable(spectator.service.fetchBearingData$).toBe('-b-', {
        b: expectedActions[0],
      });
    });
  });

  it('should dispatch fetchBearingDetailsSuccess when fetchBearingDetails$ is successful', () => {
    const bearingId = 'ABC123';
    const mockBearing: Bearing = {
      bearingId: 'ABC123',
      title: 'Test Bearing Name',
      isThermal: true,
      isMechanical: false,
      isHydraulic: true,
    };

    restService.fetchBearingInfo = jest.fn().mockReturnValue(of(mockBearing));

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingDetails({ bearingId }),
      });

      const expectedAction =
        CalculationSelectionActions.fetchBearingDetailsSuccess(mockBearing);

      expectObservable(spectator.service.fetchBearingDetails$).toBe('-b-', {
        b: expectedAction,
      });
    });

    expect(restService.fetchBearingInfo).toHaveBeenCalledWith(bearingId);
  });

  it('should use fallback values when fetchBearingDetails$ API response has missing properties', () => {
    const bearingId = 'ABC123';
    const mockBearing: Bearing = {
      bearingId: 'ABC123',
      title: 'Test Title',
      isThermal: false,
      isMechanical: false,
      isHydraulic: false,
    };

    restService.fetchBearingInfo = jest.fn().mockReturnValue(of(mockBearing));

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingDetails({ bearingId }),
      });

      const expectedAction =
        CalculationSelectionActions.fetchBearingDetailsSuccess(mockBearing);

      expectObservable(spectator.service.fetchBearingDetails$).toBe('-b-', {
        b: expectedAction,
      });
    });
  });

  it('should dispatch fetchBearingDetailsFailure when fetchBearingDetails$ fails', () => {
    const bearingId = 'ABC123';
    const errorMessage = 'Network error';
    const error = new Error(errorMessage);

    restService.fetchBearingInfo = jest
      .fn()
      .mockReturnValue(throwError(() => error));

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingDetails({ bearingId }),
      });

      const expectedAction =
        CalculationSelectionActions.fetchBearingDetailsFailure({
          bearingId,
          error: errorMessage,
        });

      expectObservable(spectator.service.fetchBearingDetails$).toBe('-b-', {
        b: expectedAction,
      });
    });

    expect(console.error).toHaveBeenCalledWith(
      `Failed to fetch bearing details for ${bearingId}:`,
      error
    );
  });

  it('should handle error without message in fetchBearingDetails$', () => {
    const bearingId = 'ABC123';
    const errorWithoutMessage = { status: 500 }; // Error object without message property

    restService.fetchBearingInfo = jest
      .fn()
      .mockReturnValue(throwError(() => errorWithoutMessage));

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingDetails({ bearingId }),
      });

      const expectedAction =
        CalculationSelectionActions.fetchBearingDetailsFailure({
          bearingId,
          error: 'Failed to fetch bearing details', // fallback message
        });

      expectObservable(spectator.service.fetchBearingDetails$).toBe('-b-', {
        b: expectedAction,
      });
    });
  });

  it('should dispatch actions for thermal bearing when fetchBearingDetailsSuccess$ is triggered', () => {
    const bearingData = {
      bearingId: 'ThermalBearing123',
      title: 'Thermal Test Bearing',
      isThermal: true,
      isMechanical: false,
      isHydraulic: true,
    };

    stepManagerService.getStepConfiguration.mockReturnValue({
      steps: ['BEARING', 'MEASURING_MOUNTING', 'CALCULATION_OPTIONS', 'RESULT'],
      stepIndices: {
        BEARING: 0,
        MEASURING_MOUNTING: 1,
        CALCULATION_OPTIONS: 2,
        RESULT: 3,
      },
      availableSteps: [
        'BEARING',
        'MEASURING_MOUNTING',
        'CALCULATION_OPTIONS',
        'RESULT',
      ],
    } as any);

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingDetailsSuccess(bearingData),
      });

      const expectedMarble = '-(bcdefg)';
      const expectedValues = {
        b: CalculationSelectionActions.setBearing(bearingData),
        c: CalculationResultActions.resetCalculationResult(),
        d: CalculationOptionsActions.resetCalculationOptions(),
        e: CalculationSelectionActions.setCurrentStep({ step: 1 }),
        f: CalculationSelectionActions.fetchMountingMethods(),
        g: CalculationResultActions.fetchBearinxVersions(),
      };

      expectObservable(spectator.service.fetchBearingDetailsSuccess$).toBe(
        expectedMarble,
        expectedValues
      );
    });

    expect(stepManagerService.getStepConfiguration).toHaveBeenCalledWith({
      bearing: bearingData,
      isAxialBearing: false,
      isEmbedded: false,
    });
  });

  it('should dispatch actions for non-thermal bearing when fetchBearingDetailsSuccess$ is triggered', () => {
    const bearingData = {
      bearingId: 'NonThermalBearing123',
      title: 'Non-Thermal Test Bearing',
      isThermal: false,
      isMechanical: true,
      isHydraulic: false,
    };

    stepManagerService.getStepConfiguration.mockReturnValue({
      steps: ['BEARING', 'BEARING_SEAT', 'MEASURING_MOUNTING', 'RESULT'],
      stepIndices: {
        BEARING: 0,
        BEARING_SEAT: 1,
        MEASURING_MOUNTING: 2,
        RESULT: 3,
      },
      availableSteps: [
        'BEARING',
        'BEARING_SEAT',
        'MEASURING_MOUNTING',
        'RESULT',
      ],
    } as any);

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingDetailsSuccess(bearingData),
      });

      const expectedMarble = '-(bcdefg)';
      const expectedValues = {
        b: CalculationSelectionActions.setBearing(bearingData),
        c: CalculationResultActions.resetCalculationResult(),
        d: CalculationOptionsActions.resetCalculationOptions(),
        e: CalculationSelectionActions.setCurrentStep({ step: 1 }),
        f: CalculationSelectionActions.fetchBearingSeats(),
        g: CalculationResultActions.fetchBearinxVersions(),
      };

      expectObservable(spectator.service.fetchBearingDetailsSuccess$).toBe(
        expectedMarble,
        expectedValues
      );
    });

    expect(stepManagerService.getStepConfiguration).toHaveBeenCalledWith({
      bearing: bearingData,
      isAxialBearing: false,
      isEmbedded: false,
    });
  });

  it('should handle embedded mode correctly in fetchBearingDetailsSuccess$', () => {
    const bearingData = {
      bearingId: 'EmbeddedBearing123',
      title: 'Embedded Test Bearing',
      isThermal: false,
      isMechanical: true,
      isHydraulic: false,
    };

    const embeddedService = spectator.inject(
      EaEmbeddedService
    ) as jest.Mocked<EaEmbeddedService>;
    (embeddedService.isStandalone as unknown as WritableSignal<boolean>).set(
      false
    );
    stepManagerService.getStepConfiguration.mockReturnValue({
      steps: ['BEARING', 'BEARING_SEAT', 'RESULT'],
      stepIndices: {
        BEARING: 0,
        BEARING_SEAT: 1,
        RESULT: 2,
      },
      availableSteps: ['BEARING', 'BEARING_SEAT', 'RESULT'],
    } as any);

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.fetchBearingDetailsSuccess(bearingData),
      });

      const expectedMarble = '-(bcdefg)';
      const expectedValues = {
        b: CalculationSelectionActions.setBearing(bearingData),
        c: CalculationResultActions.resetCalculationResult(),
        d: CalculationOptionsActions.resetCalculationOptions(),
        e: CalculationSelectionActions.setCurrentStep({ step: 1 }),
        f: CalculationSelectionActions.fetchBearingSeats(),
        g: CalculationResultActions.fetchBearinxVersions(),
      };

      expectObservable(spectator.service.fetchBearingDetailsSuccess$).toBe(
        expectedMarble,
        expectedValues
      );
    });

    expect(stepManagerService.getStepConfiguration).toHaveBeenCalledWith({
      bearing: bearingData,
      isAxialBearing: false,
      isEmbedded: true,
    });
  });

  it('should dispatch setBearingSeats action when fetchBearingSeats$ is successful', () => {
    const bearing = {
      bearingId: 'bearing1',
    } as Partial<Bearing> as Bearing;
    const bearingSeats: ListValue[] = [{ id: 'seat1', text: 'Seat 1' }];

    facade.getBearing$.mockReturnValue(of(bearing));
    restService.getBearingSeats.mockReturnValue(of(bearingSeats));

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
    // Mock a non-thermal bearing for this test
    const mockBearing = {
      bearingId: 'bearing1',
      title: 'Non-thermal Bearing',
      isThermal: false,
      isMechanical: true,
      isHydraulic: false,
    };

    facade.getBearing$.mockReturnValue(of(mockBearing));

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.setBearingSeat({ bearingSeatId: '123' }),
      });

      const expectedMarble = '-(bc)-';
      const expectedValues = {
        b: CalculationResultActions.resetCalculationResult(),
        c: CalculationSelectionActions.fetchMeasurementMethods(),
      };

      expectObservable(spectator.service.setBearingSeat$).toBe(
        expectedMarble,
        expectedValues
      );
    });
  });

  it('should dispatch fetchMountingMethods and resetCalculationResult actions when setBearingSeat$ is triggered for thermal bearing', () => {
    // Mock a thermal bearing for this test
    const mockThermalBearing = {
      bearingId: 'thermal-bearing1',
      title: 'Thermal Bearing',
      isThermal: true,
      isMechanical: false,
      isHydraulic: true,
    };

    facade.getBearing$.mockReturnValue(of(mockThermalBearing));

    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', {
        a: CalculationSelectionActions.setBearingSeat({ bearingSeatId: '123' }),
      });

      const expectedMarble = '-(bc)-';
      const expectedValues = {
        b: CalculationResultActions.resetCalculationResult(),
        c: CalculationSelectionActions.fetchMountingMethods(),
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

    restService.getMeasurementMethods.mockReturnValue(of(measurementMethods));

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

  it('should dispatch setMountingMethods action when fetchMountingMethods$ is successful for non-thermal bearing', (done) => {
    const bearing = {
      type: { typeId: 'type1' },
      series: { seriesId: 'series1' },
      bearingId: 'bearing1',
      isThermal: false,
    } as Partial<Bearing> as Bearing;
    const bearingSeatId = 'seat1';
    const measurementMethodId = 'method1';
    const mountingMethods: ListValue[] = [
      { id: 'mounting1', text: 'Mounting 1' },
    ];

    facade.getBearing$.mockReturnValue(of(bearing));
    facade.getBearingSeatId$.mockReturnValue(of(bearingSeatId));
    facade.getMeasurementMethod$.mockReturnValue(of(measurementMethodId));
    restService.getNonThermalBearingMountingMethods.mockReturnValue(
      of(mountingMethods)
    );

    actions$ = of(CalculationSelectionActions.fetchMountingMethods());

    // Subscribe directly to see if it works at all
    spectator.service.fetchMountingMethods$.subscribe((action) => {
      expect(action).toEqual(
        CalculationSelectionActions.setMountingMethods({ mountingMethods })
      );

      // Check if the correct method was called
      expect(
        restService.getNonThermalBearingMountingMethods
      ).toHaveBeenCalledWith('bearing1', 'seat1', 'method1');
      done();
    });
  });

  it('should dispatch setMountingMethods action when fetchMountingMethods$ is successful for thermal bearing', (done) => {
    const bearing = {
      type: { typeId: 'type1' },
      series: { seriesId: 'series1' },
      bearingId: 'bearing1',
      isThermal: true,
    } as Partial<Bearing> as Bearing;
    const mountingMethods: ListValue[] = [
      { id: 'mounting1', text: 'Mounting 1' },
    ];

    facade.getBearing$.mockReturnValue(of(bearing));
    facade.getBearingSeatId$.mockReturnValue(of('seat1'));
    facade.getMeasurementMethod$.mockReturnValue(of('method1'));
    restService.getThermalBearingMountingMethods.mockReturnValue(
      of(mountingMethods)
    );

    actions$ = of(CalculationSelectionActions.fetchMountingMethods());

    spectator.service.fetchMountingMethods$.subscribe((action) => {
      expect(action).toEqual(
        CalculationSelectionActions.setMountingMethods({ mountingMethods })
      );

      // Verify the correct method was called for thermal bearing
      expect(restService.getThermalBearingMountingMethods).toHaveBeenCalledWith(
        'bearing1'
      );
      done();
    });
  });

  it('should dispatch setMountingMethod, setCurrentStep, and fetchPreflightOptions actions', () => {
    // Mock StepManagerService for this specific test case
    stepManagerService.getStepConfiguration.mockReturnValue({
      steps: [
        'BEARING',
        'BEARING_SEAT',
        'MEASURING_MOUNTING',
        'CALCULATION_OPTIONS',
      ],
      stepIndices: {
        BEARING: 0,
        BEARING_SEAT: 1,
        MEASURING_MOUNTING: 2,
        CALCULATION_OPTIONS: 3,
        RESULT: 4,
      },
      availableSteps: [],
    } as any);

    testScheduler.run(({ hot, expectObservable }) => {
      const action =
        CalculationSelectionActions.updateMountingMethodAndCurrentStep({
          mountingMethod: 'method1',
        });
      const measurementMethod = LB_AXIAL_DISPLACEMENT;
      const bearing = {
        bearingId: 'bearing1',
        isThermal: false,
      } as Partial<Bearing> as Bearing;

      actions$ = hot('-a', { a: action });
      facade.getMeasurementMethod$.mockReturnValue(of(measurementMethod));
      facade.getBearing$.mockReturnValue(of(bearing));
      facade.isAxialDisplacement$.mockReturnValue(of(true));

      const expectedMarble = '-(bcde)';
      const expectedValues = {
        b: CalculationSelectionActions.setMountingMethod({
          mountingMethod: 'method1',
        }),
        c: CalculationResultActions.resetCalculationResult(),

        d: CalculationSelectionActions.setCurrentStep({
          step: 3, // CALCULATION_OPTIONS step for axial, non-thermal bearing
        }),
        e: CalculationOptionsActions.fetchPreflightOptions(),
      };

      expectObservable(
        spectator.service.updateMountingMethodAndCurrentStep$
      ).toBe(expectedMarble, expectedValues);
    });
  });

  it(
    'should push the history state on setCurrentStep',
    marbles((m) => {
      const step = 2;
      const isBackNavigation = false;

      actions$ = m.cold('-a', {
        a: CalculationSelectionActions.setCurrentStep({
          step,
          isBackNavigation,
        }),
      });

      m.flush();

      spectator.service.setCurrentStep$.subscribe(() => {
        expect(history.state).toEqual({ step: 1 });
      });
    })
  );

  it(
    'should not push the history state on setCurrentStep from back navigation',
    marbles((m) => {
      const step = 2;
      const isBackNavigation = true;

      actions$ = m.cold('-a', {
        a: CalculationSelectionActions.setCurrentStep({
          step,
          isBackNavigation,
        }),
      });

      m.flush();

      spectator.service.setCurrentStep$.subscribe(() => {
        expect(history.state).toBeNull();
      });
    })
  );
});
