import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import { ThermalCalculationOptionsFormData } from '@mm/steps/calculation-options-step/calculation-selection-step.interface';

export interface CalculationOptionsState {
  options: PreflightData;
  thermalOptions: ThermalCalculationOptionsFormData;
  calculationPerformed: boolean;
  toleranceClasses?: string[];
}
