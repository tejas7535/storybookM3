import { CatalogServiceProductClass } from '../services/catalog.service.interface';
import {
  CalculationParametersOperationConditions,
  CalculationType,
} from '../store/models';

export interface EAParametersLocalStorageItem {
  bearingKind: CatalogServiceProductClass;
  version: number;
  validUntil: number;
  operationConditions: Partial<CalculationParametersOperationConditions>;
  calculationTypes: Record<CalculationType, boolean>;
}
