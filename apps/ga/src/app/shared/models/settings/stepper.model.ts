import { Step } from '.';

export interface Stepper {
  steps: Step[];
  currentStep: number;
  previousStep: number;
  nextStep: number;
}
