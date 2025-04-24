import { BearingOption } from '@mm/shared/models';
import { ListValue } from '@mm/shared/models/list-value.model';

export interface CalculationSelectionState {
  bearingResultList: BearingOption[];
  bearing?: Bearing;
  bearingSeats?: StepSelectionValue;
  measurementMethods?: StepSelectionValue;
  mountingMethods?: StepSelectionValue;
  stepper: {
    currentStep: number;
  };
  loading?: boolean;
}

export interface Bearing {
  bearingId: string;
  title: string;
}

export interface StepSelectionValue {
  values: ListValue[];
  selectedValueId?: string;
}
