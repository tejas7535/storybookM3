import { StepType } from '@mm/shared/constants/steps';
import { AppDelivery } from '@mm/shared/models';
import { BearingOption } from '@mm/shared/models/bearing-search.model';
import { ListValue } from '@mm/shared/models/list-value.model';
import { Step } from '@mm/shared/models/step.model';
import { StepManagerService } from '@mm/shared/services/step-manager/step-manager.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { CalculationSelectionActions } from '../../actions/calculation-selection';
import {
  Bearing,
  StepSelectionValue,
} from '../../models/calculation-selection-state.model';
import { GlobalState } from '../../models/global-state.model';
import { initialState } from '../../reducers/calculation-selection/calculation-selection.reducer';
import { CalculationSelectionSelector } from '../../selectors';
import { CalculationSelectionFacade } from './calculation-selection.facade';

describe('CalculationSelectionFacade', () => {
  let spectator: SpectatorService<CalculationSelectionFacade>;
  let facade: CalculationSelectionFacade;
  let store: MockStore;
  let stepManagerService: jest.Mocked<StepManagerService>;

  const globalInitialState: GlobalState = {
    isStandalone: true,
    appDelivery: AppDelivery.Standalone,
    initialized: false,
    isInternalUser: false,
  };

  const createService = createServiceFactory({
    service: CalculationSelectionFacade,
    providers: [
      provideMockStore({
        initialState: {
          calculationSelection: initialState,
          calculationResult: undefined,
          calculationOptions: undefined,
          global: globalInitialState,
        },
      }),
      {
        provide: StepManagerService,
        useValue: {
          getStepConfiguration: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    store = spectator.inject(MockStore);
    stepManagerService = spectator.inject(
      StepManagerService
    ) as jest.Mocked<StepManagerService>;
  });

  it('should create the facade', () => {
    expect(facade).toBeTruthy();
  });

  it('should select step configuration', (done) => {
    const steps: Step[] = [{ name: 'step1' }, { name: 'step2' }] as Partial<
      Step[]
    > as Step[];
    const mockConfig = {
      steps,
      availableSteps: [StepType.BEARING, StepType.RESULT],
      stepIndices: {
        [StepType.BEARING]: 0,
        [StepType.BEARING_SEAT]: -1,
        [StepType.MEASURING_MOUNTING]: -1,
        [StepType.CALCULATION_OPTIONS]: -1,
        [StepType.RESULT]: 1,
      },
    };

    stepManagerService.getStepConfiguration.mockReturnValue(mockConfig);

    facade.getStepConfiguration$().subscribe((result) => {
      expect(result).toEqual(mockConfig);
      done();
    });
  });

  it('should select currentStep$', (done) => {
    const currentStep = 1;
    store.overrideSelector(
      CalculationSelectionSelector.getCurrentStep,
      currentStep
    );
    store.refreshState();

    facade.getCurrentStep$().subscribe((result) => {
      expect(result).toBe(currentStep);
      done();
    });
  });

  it('should select selectedBearingOption', () => {
    const bearing: Bearing = {
      bearingId: 'id1',
      title: 'Bearing 1',
      isThermal: true,
      isMechanical: false,
      isHydraulic: true,
    };
    store.overrideSelector(CalculationSelectionSelector.getBearing, bearing);
    store.refreshState();

    expect(facade.selectedBearingOption()).toEqual({
      id: bearing.bearingId,
      title: bearing.title,
      isThermal: bearing.isThermal,
      isMechanical: bearing.isMechanical,
      isHydraulic: bearing.isHydraulic,
    });
  });

  it('should select bearingResultList$', (done) => {
    const bearingResultList: BearingOption[] = [
      {
        id: 'bearing1',
        title: '1',
        isThermal: true,
        isMechanical: false,
        isHydraulic: false,
      },
      {
        id: 'bearing2',
        title: '2',
        isThermal: false,
        isMechanical: true,
        isHydraulic: true,
      },
    ];
    store.overrideSelector(
      CalculationSelectionSelector.getBearingsResultList,
      bearingResultList
    );
    store.refreshState();

    facade.bearingResultList$.subscribe((result) => {
      expect(result).toEqual(bearingResultList);
      done();
    });
  });

  it('should select isLoading$', (done) => {
    const isLoading = true;
    store.overrideSelector(
      CalculationSelectionSelector.getBearingSelectionLoading,
      isLoading
    );
    store.refreshState();

    facade.isLoading$().subscribe((result) => {
      expect(result).toBe(isLoading);
      done();
    });
  });

  it('should select bearingSeats$', (done) => {
    const values: ListValue[] = [{ id: 'seat1', text: '1' }];
    const bearingSeats: StepSelectionValue = {
      values,
    };

    store.overrideSelector(
      CalculationSelectionSelector.getBearingSeats,
      bearingSeats
    );
    store.refreshState();

    facade.bearingSeats$.subscribe((result) => {
      expect(result).toEqual(bearingSeats);
      done();
    });
  });

  it('should select measurementMethods$', (done) => {
    const values: ListValue[] = [
      { id: 'method1', text: '1' },
      { id: 'method2', text: '2' },
    ];
    const measurementMethods: StepSelectionValue = {
      values,
    };
    store.overrideSelector(
      CalculationSelectionSelector.getMeasurementMethods,
      measurementMethods
    );
    store.refreshState();

    facade.measurementMethods$.subscribe((result) => {
      expect(result).toEqual(measurementMethods);
      done();
    });
  });

  it('should select mountingMethods$', (done) => {
    const values = [
      { id: 'method1', text: '1' },
      { id: 'method2', text: '2' },
    ];

    const mountingMethods: StepSelectionValue = {
      values,
    };
    store.overrideSelector(
      CalculationSelectionSelector.getMountingMethods,
      mountingMethods
    );
    store.refreshState();

    facade.mountingMethods$.subscribe((result) => {
      expect(result).toEqual(mountingMethods);
      done();
    });
  });

  it('should get bearing$', (done) => {
    const bearing: Bearing = {
      bearingId: 'id1',
      title: 'Bearing 1',
    } as Bearing;
    store.overrideSelector(CalculationSelectionSelector.getBearing, bearing);
    store.refreshState();

    facade.getBearing$().subscribe((result) => {
      expect(result).toEqual(bearing);
      done();
    });
  });

  it('should select getBearingSeatId$', (done) => {
    const bearingSeatId = 'seat1';
    store.overrideSelector(
      CalculationSelectionSelector.getBearingSeatId,
      bearingSeatId
    );
    store.refreshState();

    facade.getBearingSeatId$().subscribe((result) => {
      expect(result).toBe(bearingSeatId);
      done();
    });
  });

  it('should select getMeasurementMethod$', (done) => {
    const measurementMethod = 'method1';
    store.overrideSelector(
      CalculationSelectionSelector.getMeasurementMethod,
      measurementMethod
    );
    store.refreshState();

    facade.getMeasurementMethod$().subscribe((result) => {
      expect(result).toBe(measurementMethod);
      done();
    });
  });

  it('should dispatch searchBearing action', () => {
    const query = 'bearing1';
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.searchBearing(query);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CalculationSelectionActions.searchBearingList({ query })
    );
  });

  it('should dispatch resetBearingSelection action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.resetBearingSelection();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CalculationSelectionActions.resetBearing()
    );
  });

  it('should dispatch fetchBearingData action', () => {
    const bearingId = 'bearing1';
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.fetchBearingData(bearingId);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CalculationSelectionActions.fetchBearingData({ bearingId })
    );
  });

  it('should dispatch setCurrentStep action', () => {
    const step = 2;
    const isBackNavigation = false;
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.setCurrentStep(step, isBackNavigation);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CalculationSelectionActions.setCurrentStep({ step, isBackNavigation })
    );
  });

  it('should dispatch fetchBearingSeats action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.fetchBearingSeats();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CalculationSelectionActions.fetchBearingSeats()
    );
  });

  it('should dispatch setBearingSeat action', () => {
    const bearingSeatId = 'seat1';
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.setBearingSeat(bearingSeatId);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CalculationSelectionActions.setBearingSeat({ bearingSeatId })
    );
  });

  it('should dispatch setMeasurementMethod action when measurementMethod is provided', () => {
    const measurementMethod = 'method1';
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.setMeasurementMethod(measurementMethod);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CalculationSelectionActions.setMeasurementMethod({ measurementMethod })
    );
  });

  it('should not dispatch setMeasurementMethod action when measurementMethod is not provided', () => {
    const measurementMethod = '';
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.setMeasurementMethod(measurementMethod);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch updateMountingMethodAndCurrentStep action', () => {
    const mountingMethod = 'method1';
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.updateMountingMethodAndCurrentStep(mountingMethod);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CalculationSelectionActions.updateMountingMethodAndCurrentStep({
        mountingMethod,
      })
    );
  });

  it('should select isAxialDisplacement$', (done) => {
    const isAxialDisplacement = true;
    store.overrideSelector(
      CalculationSelectionSelector.isAxialDisplacement,
      isAxialDisplacement
    );
    store.refreshState();

    facade.isAxialDisplacement$().subscribe((result) => {
      expect(result).toBe(isAxialDisplacement);
      done();
    });
  });

  it('should select getMountingMethod$', (done) => {
    const mountingMethod = 'mounting-method-1';
    store.overrideSelector(
      CalculationSelectionSelector.getMountingMethod,
      mountingMethod
    );
    store.refreshState();

    facade.getMountingMethod$().subscribe((result) => {
      expect(result).toBe(mountingMethod);
      done();
    });
  });
});
