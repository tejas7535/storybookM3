import { Bearing } from '@mm/core/store/models/calculation-selection-state.model';
import { StepType } from '@mm/shared/constants/steps';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { StepManagerService } from './step-manager.service';

describe('StepManagerService', () => {
  let spectator: SpectatorService<StepManagerService>;
  let service: StepManagerService;

  const createService = createServiceFactory({
    service: StepManagerService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAvailableSteps', () => {
    it('should include bearing seat step for non-thermal bearings', () => {
      const steps = service.getAvailableSteps(false, false);

      expect(steps).toEqual([
        StepType.BEARING,
        StepType.BEARING_SEAT,
        StepType.MEASURING_MOUNTING,
        StepType.RESULT,
      ]);
    });

    it('should skip bearing seat step for thermal bearings', () => {
      const steps = service.getAvailableSteps(true, false);

      expect(steps).toEqual([
        StepType.BEARING,
        StepType.MEASURING_MOUNTING,
        StepType.CALCULATION_OPTIONS,
        StepType.RESULT,
      ]);
    });

    it('should include calculation options for axial bearings', () => {
      const steps = service.getAvailableSteps(false, true);

      expect(steps).toEqual([
        StepType.BEARING,
        StepType.BEARING_SEAT,
        StepType.MEASURING_MOUNTING,
        StepType.CALCULATION_OPTIONS,
        StepType.RESULT,
      ]);
    });

    it('should include calculation options for thermal bearings', () => {
      const steps = service.getAvailableSteps(true, false);

      expect(steps).toContain(StepType.CALCULATION_OPTIONS);
    });
  });

  describe('calculateStepIndices', () => {
    it('should assign correct indices to available steps', () => {
      const availableSteps = [
        StepType.BEARING,
        StepType.BEARING_SEAT,
        StepType.MEASURING_MOUNTING,
        StepType.RESULT,
      ];

      const indices = service.calculateStepIndices(availableSteps);

      expect(indices[StepType.BEARING]).toBe(0);
      expect(indices[StepType.BEARING_SEAT]).toBe(1);
      expect(indices[StepType.MEASURING_MOUNTING]).toBe(2);
      expect(indices[StepType.RESULT]).toBe(3);
      expect(indices[StepType.CALCULATION_OPTIONS]).toBe(-1);
    });
  });

  describe('getStepConfiguration', () => {
    it('should return complete configuration for non-thermal bearing in standalone mode', () => {
      const bearing: Bearing = {
        bearingId: 'test-bearing',
        title: 'Test Bearing',
        isThermal: false,
        isMechanical: true,
        isHydraulic: false,
      };

      const completionState = {
        bearingSeatId: 'seat-1',
        mountingMethod: 'method-1',
        optionsCalculationPerformed: false,
        isResultAvailable: false,
      };

      const config = service.getStepConfiguration({
        bearing,
        isAxialBearing: false,
        isEmbedded: false,
        completionState,
      });

      expect(config.steps).toHaveLength(4); // BEARING, BEARING_SEAT, MEASURING_MOUNTING, RESULT
      expect(config.availableSteps).toContain(StepType.BEARING_SEAT);
      expect(config.stepIndices[StepType.BEARING]).toBe(0);
      expect(config.stepIndices[StepType.BEARING_SEAT]).toBe(1);
      expect(config.stepIndices[StepType.MEASURING_MOUNTING]).toBe(2);
      expect(config.stepIndices[StepType.RESULT]).toBe(3);
    });

    it('should return complete configuration for thermal bearing in standalone mode', () => {
      const bearing: Bearing = {
        bearingId: 'test-bearing',
        title: 'Test Bearing',
        isThermal: true,
        isMechanical: true,
        isHydraulic: false,
      };

      const config = service.getStepConfiguration({
        bearing,
        isAxialBearing: false,
        isEmbedded: false,
      });

      expect(config.steps).toHaveLength(4); // BEARING, MEASURING_MOUNTING, CALCULATION_OPTIONS, RESULT
      expect(config.availableSteps).not.toContain(StepType.BEARING_SEAT);
      expect(config.availableSteps).toContain(StepType.CALCULATION_OPTIONS);
      expect(config.stepIndices[StepType.BEARING]).toBe(0);
      expect(config.stepIndices[StepType.MEASURING_MOUNTING]).toBe(1);
      expect(config.stepIndices[StepType.CALCULATION_OPTIONS]).toBe(2);
      expect(config.stepIndices[StepType.RESULT]).toBe(3);
      expect(config.stepIndices[StepType.BEARING_SEAT]).toBe(-1);
    });

    it('should skip bearing step in embedded mode for non-thermal bearing', () => {
      const bearing: Bearing = {
        bearingId: 'test-bearing',
        title: 'Test Bearing',
        isThermal: false,
        isMechanical: true,
        isHydraulic: false,
      };

      const config = service.getStepConfiguration({
        bearing,
        isAxialBearing: false,
        isEmbedded: true,
      });

      expect(config.steps).toHaveLength(3); // BEARING_SEAT, MEASURING_MOUNTING, RESULT
      expect(config.availableSteps).toContain(StepType.BEARING_SEAT);
      expect(config.availableSteps).not.toContain(StepType.BEARING);
      expect(config.stepIndices[StepType.BEARING_SEAT]).toBe(0);
      expect(config.stepIndices[StepType.MEASURING_MOUNTING]).toBe(1);
      expect(config.stepIndices[StepType.RESULT]).toBe(2);
      expect(config.stepIndices[StepType.BEARING]).toBe(-1);
    });

    it('should skip bearing step in embedded mode for thermal bearing', () => {
      const bearing: Bearing = {
        bearingId: 'test-bearing',
        title: 'Test Bearing',
        isThermal: true,
        isMechanical: true,
        isHydraulic: false,
      };

      const config = service.getStepConfiguration({
        bearing,
        isAxialBearing: false,
        isEmbedded: true,
      });

      expect(config.steps).toHaveLength(3); // MEASURING_MOUNTING, CALCULATION_OPTIONS, RESULT
      expect(config.availableSteps).not.toContain(StepType.BEARING_SEAT);
      expect(config.availableSteps).not.toContain(StepType.BEARING);
      expect(config.availableSteps).toContain(StepType.CALCULATION_OPTIONS);
      expect(config.stepIndices[StepType.MEASURING_MOUNTING]).toBe(0);
      expect(config.stepIndices[StepType.CALCULATION_OPTIONS]).toBe(1);
      expect(config.stepIndices[StepType.RESULT]).toBe(2);
      expect(config.stepIndices[StepType.BEARING]).toBe(-1);
      expect(config.stepIndices[StepType.BEARING_SEAT]).toBe(-1);
    });
  });

  describe('private method edge cases', () => {
    it('should throw error for unknown step type in getStepConfig', () => {
      // Access private method through any casting for testing
      const privateService = spectator.service as any;
      const unknownStepType = 'UNKNOWN_STEP' as StepType;

      expect(() => privateService.getStepConfig(unknownStepType)).toThrow(
        'Unknown step type: UNKNOWN_STEP'
      );
    });

    it('should return false when completionState is not provided in isStepComplete', () => {
      // Access private method through any casting for testing
      const privateService = spectator.service as any;
      const bearing: Bearing = {
        bearingId: 'test',
        title: 'Test',
        isThermal: false,
        isMechanical: true,
        isHydraulic: false,
      };

      const result = privateService.isStepComplete(
        StepType.BEARING,
        undefined,
        bearing
      );
      expect(result).toBe(false);
    });

    it('should return false when completionState is null in isStepComplete', () => {
      // Access private method through any casting for testing
      const privateService = spectator.service as any;
      const bearing: Bearing = {
        bearingId: 'test',
        title: 'Test',
        isThermal: false,
        isMechanical: true,
        isHydraulic: false,
      };

      // eslint-disable-next-line unicorn/no-null
      const result = privateService.isStepComplete(
        StepType.BEARING,
        // eslint-disable-next-line unicorn/no-null
        null,
        bearing
      );
      expect(result).toBe(false);
    });

    it('should return false for unknown step type in isStepComplete', () => {
      // Access private method through any casting for testing
      const privateService = spectator.service as any;
      const unknownStepType = 'UNKNOWN_STEP' as StepType;
      const completionState = {
        bearingSeatId: 'test',
        mountingMethod: 'test',
        optionsCalculationPerformed: true,
        isResultAvailable: true,
      };

      const result = privateService.isStepComplete(
        unknownStepType,
        completionState
      );
      expect(result).toBe(false);
    });
  });

  describe('step completion logic', () => {
    it('should correctly determine step completion for all step types', () => {
      const privateService = spectator.service as any;
      const bearing: Bearing = {
        bearingId: 'test',
        title: 'Test',
        isThermal: false,
        isMechanical: true,
        isHydraulic: false,
      };

      const completionState = {
        bearingSeatId: 'seat-1',
        mountingMethod: 'method-1',
        optionsCalculationPerformed: true,
        isResultAvailable: true,
      };

      expect(
        privateService.isStepComplete(
          StepType.BEARING,
          completionState,
          bearing
        )
      ).toBe(true);
      expect(
        privateService.isStepComplete(StepType.BEARING_SEAT, completionState)
      ).toBe(true);
      expect(
        privateService.isStepComplete(
          StepType.MEASURING_MOUNTING,
          completionState
        )
      ).toBe(true);
      expect(
        privateService.isStepComplete(
          StepType.CALCULATION_OPTIONS,
          completionState
        )
      ).toBe(true);
      expect(
        privateService.isStepComplete(StepType.RESULT, completionState)
      ).toBe(true);
    });

    it('should return false for incomplete states', () => {
      const privateService = spectator.service as any;

      const incompleteState = {
        bearingSeatId: '',
        mountingMethod: '',
        optionsCalculationPerformed: false,
        isResultAvailable: false,
      };

      // Test with no bearing
      expect(
        privateService.isStepComplete(StepType.BEARING, incompleteState)
      ).toBe(false);
      expect(
        privateService.isStepComplete(StepType.BEARING_SEAT, incompleteState)
      ).toBe(false);
      expect(
        privateService.isStepComplete(
          StepType.MEASURING_MOUNTING,
          incompleteState
        )
      ).toBe(false);
      expect(
        privateService.isStepComplete(
          StepType.CALCULATION_OPTIONS,
          incompleteState
        )
      ).toBe(false);
      expect(
        privateService.isStepComplete(StepType.RESULT, incompleteState)
      ).toBe(false);
    });
  });
});
