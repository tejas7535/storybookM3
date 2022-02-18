import { DimensionAndWeightDetails } from '@cdba/shared/models';

import { REFERENCE_TYPE_MOCK } from './reference-type.mock';

export const DIMENSION_AND_WEIGHT_DETAILS_MOCK = new DimensionAndWeightDetails(
  REFERENCE_TYPE_MOCK.height,
  REFERENCE_TYPE_MOCK.width,
  REFERENCE_TYPE_MOCK.length,
  REFERENCE_TYPE_MOCK.unitOfDimension,
  REFERENCE_TYPE_MOCK.volumeCubic,
  REFERENCE_TYPE_MOCK.volumeUnit,
  REFERENCE_TYPE_MOCK.weight,
  REFERENCE_TYPE_MOCK.weightUnit
);
