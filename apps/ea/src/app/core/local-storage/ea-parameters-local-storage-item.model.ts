import {
  CalculationParametersOperationConditions,
  CalculationType,
} from '../store/models';

export interface EAParametersLocalStorageItem {
  version: number;
  validUntil: number;
  operationConditions: Partial<CalculationParametersOperationConditions>;
  calculationTypes: Record<CalculationType, boolean>;
}
