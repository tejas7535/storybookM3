import { BaseMaterial } from '@mac/msd/models';

export interface SteelMaterial extends BaseMaterial {
  materialNumbers?: string[];
  materialStandardWiamId?: string;
  materialStandardStoffId?: string;

  manufacturer: boolean;
  sapSupplierIds?: string[];

  selfCertified: boolean;
  blocked: boolean;
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
  minRecyclingRate: number;
  maxRecyclingRate: number;
}
