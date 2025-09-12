import { StepType } from '@mm/shared/constants/steps';
import { BearingOption } from '@mm/shared/models';
import { ListValue } from '@mm/shared/models/list-value.model';
import { Step } from '@mm/shared/models/step.model';

export interface CalculationSelectionState {
  bearingResultList: BearingOption[];
  bearing?: Bearing;
  bearingSeats?: StepSelectionValue;
  measurementMethods?: StepSelectionValue;
  mountingMethods?: StepSelectionValue;
  stepper: {
    currentStep: number;
    stepConfiguration?: StepConfiguration;
  };
  loading?: boolean;
}

export interface Bearing {
  bearingId: string;
  title: string;
  isThermal: boolean;
  isMechanical: boolean;
  isHydraulic: boolean;
}

export interface StepSelectionValue {
  values: ListValue[];
  selectedValueId?: string;
}

export interface StepConfiguration {
  steps: Step[];
  stepIndices: Record<StepType, number>;
  availableSteps: StepType[];
}
