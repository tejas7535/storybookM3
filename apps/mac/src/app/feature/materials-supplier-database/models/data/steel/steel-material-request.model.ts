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
}
