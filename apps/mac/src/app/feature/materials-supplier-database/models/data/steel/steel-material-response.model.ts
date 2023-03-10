import {
  BaseMaterialResponse,
  SteelManufacturerSupplier,
  SteelMaterialStandard,
} from '@mac/msd/models';

export interface SteelMaterialResponse extends BaseMaterialResponse {
  materialStandard: SteelMaterialStandard;
  manufacturerSupplier: SteelManufacturerSupplier;
  selfCertified: boolean;
  blocked: boolean;
  productCategory: string;
  referenceDoc?: string;
  releaseDateYear?: number;
  releaseDateMonth?: number;
  castingMode: string;
  castingDiameter: string;
  minDimension?: number;
  maxDimension: number;
  steelMakingProcess?: string;
  rating?: string;
  ratingRemark?: string;
  ratingChangeComment?: string;
  minRecyclingRate?: number;
  maxRecyclingRate?: number;
}
