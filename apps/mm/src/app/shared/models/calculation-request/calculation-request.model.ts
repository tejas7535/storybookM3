// todo enhance string values with constant selection where appropriate
export interface CalculationRequestPayload {
  IDCO_DESIGNATION: string;
  IDMM_BEARING_SEAT: string;
  IDMM_CLEARANCE_REDUCTION_INPUT: string;
  IDMM_HYDRAULIC_NUT_TYPE: string;
  IDMM_INNER_RING_EXPANSION: string | number;
  IDMM_INNER_SHAFT_DIAMETER: string | number;
  IDMM_MEASSURING_METHOD: string;
  IDMM_MODULUS_OF_ELASTICITY: string | number;
  IDMM_MOUNTING_METHOD: string;
  IDMM_NUMBER_OF_PREVIOUS_MOUNTINGS: string;
  IDMM_POISSON_RATIO: string | number;
  IDMM_RADIAL_CLEARANCE_REDUCTION: string | number;
  IDMM_SHAFT_MATERIAL: string;
  RSY_BEARING_SERIES: string;
  RSY_BEARING_TYPE: string | number;
}
