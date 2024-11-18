import {
  BaseMaterialResponse,
  ProductCategoryRule,
  SteelManufacturerSupplier,
  SteelMaterialStandard,
} from '@mac/msd/models';

export interface SteelMaterialResponse extends BaseMaterialResponse {
  materialStandard: SteelMaterialStandard;
  manufacturerSupplier: SteelManufacturerSupplier;
  selfCertified: boolean;
  blocked: boolean;
  productCategory: string;
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
  co2ClassificationDataQualityRating?: number;
  co2ClassificationPrimaryDataShare?: number;
  co2ClassificationStandard?: string;
  co2Comment?: string;
  co2Pcr?: ProductCategoryRule;
  co2UploadFile?: {
    id: number;
    type: string;
    filename: string;
    timestamp: number;
  };
}
