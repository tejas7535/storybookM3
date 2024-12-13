import { BaseMaterialRequest } from '@mac/msd/models';

export interface SteelMaterialRequest extends BaseMaterialRequest {
  selfCertified: boolean;
  blocked: boolean;
  referenceDoc?: string[];
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
  co2Upstream?: number;
  co2Core?: number;
  co2ClassificationNew?: string;
  co2Standard?: string;
  productCategoryRule?: string;
  dataQualityRating?: number;
  primaryDataShare?: number;
  co2ValidUntil?: number | string;
  co2Comment?: string;
}
