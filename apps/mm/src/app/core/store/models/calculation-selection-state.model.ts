import { BearingOption } from '@mm/shared/models';
import { ListValue } from '@mm/shared/models/lazy-list-loader/mm-list-value.model';

export interface CalculationSelectionState {
  bearingResultList: BearingOption[];
  bearing?: Bearing;
  bearingSeats?: StepSelectionValue | undefined;
  measurementMethods?: StepSelectionValue | undefined;
  mountingMethods?: StepSelectionValue | undefined;
  stepper: {
    currentStep: number;
  };
  loading?: boolean;
}

export interface Bearing {
  bearingId: string;
  title: string;
  type?: {
    typeId: string;
    title: string;
  };
  series?: {
    seriesId: string;
    title: string;
  };
}

export interface StepSelectionValue {
  values: ListValue[];
  selectedValueId?: string;
}
