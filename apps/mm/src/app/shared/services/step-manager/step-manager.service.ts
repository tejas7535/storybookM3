import { Injectable } from '@angular/core';

import { Bearing } from '@mm/core/store/models/calculation-selection-state.model';
import { STEP_CONFIG, StepType } from '@mm/shared/constants/steps';
import { Step } from '@mm/shared/models/step.model';

export interface StepConfigurationOptions {
  bearing?: Bearing;
  isAxialBearing?: boolean;
  completionState?: {
    bearingSeatId?: string;
    mountingMethod?: string;
    optionsCalculationPerformed?: boolean;
    isResultAvailable?: boolean;
  };
  isEmbedded?: boolean;
}

export interface StepConfiguration {
  steps: Step[];
  stepIndices: Record<StepType, number>;
  availableSteps: StepType[];
}

@Injectable({
  providedIn: 'root',
})
export class StepManagerService {
  getStepConfiguration(
    options: StepConfigurationOptions = {}
  ): StepConfiguration {
    const {
      bearing,
      isAxialBearing = false,
      completionState,
      isEmbedded = false,
    } = options;

    const isThermalBearing = bearing?.isThermal ?? false;
    const availableSteps = this.getAvailableSteps(
      isThermalBearing,
      isAxialBearing,
      isEmbedded
    );
    const stepIndices = this.calculateStepIndices(availableSteps);
    const steps = this.buildSteps(availableSteps, completionState, bearing);

    return {
      steps,
      stepIndices,
      availableSteps,
    };
  }

  getAvailableSteps(
    isThermalBearing: boolean,
    isAxialBearing: boolean,
    isEmbedded = false
  ): StepType[] {
    const steps: StepType[] = [];

    // In embedded mode, skip the bearing selection step since bearing is provided
    if (!isEmbedded) {
      steps.push(StepType.BEARING);
    }

    // Include bearing seat step only for non-thermal bearings
    if (!isThermalBearing) {
      steps.push(StepType.BEARING_SEAT);
    }

    // Always include measuring and mounting
    steps.push(StepType.MEASURING_MOUNTING);

    // Include calculation options for axial bearings or thermal bearings
    if (isAxialBearing || isThermalBearing) {
      steps.push(StepType.CALCULATION_OPTIONS);
    }

    // Always include result step
    steps.push(StepType.RESULT);

    return steps;
  }

  calculateStepIndices(availableSteps: StepType[]): Record<StepType, number> {
    const indices: Record<StepType, number> = {} as Record<StepType, number>;

    availableSteps.forEach((stepType, index) => {
      indices[stepType] = index;
    });

    Object.values(StepType).forEach((stepType) => {
      if (!availableSteps.includes(stepType)) {
        indices[stepType] = -1;
      }
    });

    return indices;
  }

  private buildSteps(
    availableSteps: StepType[],
    completionState?: {
      bearingSeatId?: string;
      mountingMethod?: string;
      optionsCalculationPerformed?: boolean;
      isResultAvailable?: boolean;
    },
    bearing?: Bearing
  ): Step[] {
    return availableSteps.map((stepType) => {
      const config = this.getStepConfig(stepType);
      const complete = this.isStepComplete(stepType, completionState, bearing);

      return {
        ...config,
        complete,
      };
    });
  }

  private getStepConfig(stepType: StepType) {
    switch (stepType) {
      case StepType.BEARING:
        return STEP_CONFIG.BEARING;
      case StepType.BEARING_SEAT:
        return STEP_CONFIG.BEARING_SEAT;
      case StepType.MEASURING_MOUNTING:
        return STEP_CONFIG.MEASURING_MOUNTING;
      case StepType.CALCULATION_OPTIONS:
        return STEP_CONFIG.CALCULATION_OPTIONS;
      case StepType.RESULT:
        return STEP_CONFIG.RESULT;
      default:
        throw new Error(`Unknown step type: ${stepType}`);
    }
  }

  private isStepComplete(
    stepType: StepType,
    completionState?: {
      bearingSeatId?: string;
      mountingMethod?: string;
      optionsCalculationPerformed?: boolean;
      isResultAvailable?: boolean;
    },
    bearing?: Bearing
  ): boolean {
    if (!completionState) {
      return false;
    }

    switch (stepType) {
      case StepType.BEARING:
        return !!bearing;
      case StepType.BEARING_SEAT:
        return !!completionState.bearingSeatId;
      case StepType.MEASURING_MOUNTING:
        return !!completionState.mountingMethod;
      case StepType.CALCULATION_OPTIONS:
        return !!completionState.optionsCalculationPerformed;
      case StepType.RESULT:
        return !!completionState.isResultAvailable;
      default:
        return false;
    }
  }
}
