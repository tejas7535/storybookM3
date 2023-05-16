import { BasicCalculationResultState } from './calculation-result-state.model';

export interface FrictionCalculationResultState
  extends BasicCalculationResultState {
  calculationResult?: FrictionCalculationResult;
  modelId?: string;
  calculationId?: string;
  isCalculationImpossible?: boolean;
}

export interface FrictionCalculationResult {
  co2_downstream?: {
    value: number;
    unit: string;
  };
  max_frictionalTorque?: {
    // M_R_max (Max Frictional torque)
    value: number;
    unit: string;
  };
  frictionalTorque?: {
    // M_R (Frictional torque)
    value: number;
    unit: string;
  };
  frictionalPowerloss?: {
    // N_R (Frictional power loss)
    value: number;
    unit: string;
  };
  frictionalPowerlossSealing?: {
    // N_Se (Frictional power loss sealing)
    value: number;
    unit: string;
  };
  frictionalPowerlossUnloadedZone?: {
    // N_N_UzSe (Frictional power loss unloaded zone)
    value: number;
    unit: string;
  };
  operatingViscosity?: {
    // ny (Operating viscosity)
    value: number;
    unit: string;
  };
}
