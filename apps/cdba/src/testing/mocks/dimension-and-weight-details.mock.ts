import { DimensionAndWeightDetails } from '../../app/detail/dimension-and-weight/model/dimension-and-weight-details.model';
import { REFRENCE_TYPE_MOCK } from './reference-type.mock';

export const DIMENSION_AND_WEIGHT_DETAILS_MOCK = new DimensionAndWeightDetails(
  REFRENCE_TYPE_MOCK.height,
  REFRENCE_TYPE_MOCK.width,
  REFRENCE_TYPE_MOCK.length,
  REFRENCE_TYPE_MOCK.unitOfDimension,
  REFRENCE_TYPE_MOCK.volumeCubic,
  REFRENCE_TYPE_MOCK.volumeUnit,
  REFRENCE_TYPE_MOCK.weight,
  REFRENCE_TYPE_MOCK.weightUnit
);
