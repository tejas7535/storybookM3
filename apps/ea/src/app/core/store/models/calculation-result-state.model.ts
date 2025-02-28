export interface BasicCalculationResultState {
  isLoading: boolean;
  calculationError?: string;
  calculationWarning?: string;
  versions?: { [key: string]: string };
}
