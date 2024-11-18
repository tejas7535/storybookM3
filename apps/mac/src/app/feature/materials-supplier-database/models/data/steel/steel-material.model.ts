import { BaseMaterial, ProductCategoryRule } from '@mac/msd/models';

export interface SteelMaterial extends BaseMaterial {
  materialNumbers?: string[];
  materialStandardWiamId?: string;
  materialStandardStoffId?: string;

  manufacturer: boolean;

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
  minRecyclingRate: number;
  maxRecyclingRate: number;

  co2Upstream?: number;
  co2Core?: number;
  co2ClassificationNew?: string;
  co2Standard?: string;
  productCategoryRule?: ProductCategoryRule;
  productCategoryRuleId?: number;
  productCategoryRuleTitle?: string;
  dataQualityRating?: number;
  primaryDataShare?: number;
  reportValidUntil?: number;
  co2UploadFile?: File;
  co2UploadFileId?: number;
  co2UploadFileFilename?: string;
  co2Comment?: string;
}
