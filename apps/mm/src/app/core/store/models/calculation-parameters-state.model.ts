export interface CalculationParametersState {
  parameters?: CalculationParameters;
}

export interface CalculationParameters {
  RSY_BEARING_TYPE: number;
  RSY_BEARING_SERIES: string;
  IDCO_DESIGNATION: string;
  IDMM_BEARING_SEAT: string;
  IDMM_MEASSURING_METHOD: string;
  IDMM_MOUNTING_METHOD: string;
  IDMM_HYDRAULIC_NUT_TYPE: string;
  IDMM_NUMBER_OF_PREVIOUS_MOUNTINGS: string;
  IDMM_CLEARANCE_REDUCTION_INPUT: string;
  IDMM_INNER_RING_EXPANSION: number;
  IDMM_RADIAL_CLEARANCE_REDUCTION: number;
  IDMM_INNER_SHAFT_DIAMETER: number;
  IDMM_SHAFT_MATERIAL: string;
  IDMM_MODULUS_OF_ELASTICITY: number;
  IDMM_POISSON_RATIO: number;
}
