import { StringOption } from '@schaeffler/inputs';

export interface MaterialFormValue {
  manufacturerSupplierId: number;
  materialStandardId: number;
  productCategory: StringOption;
  referenceDoc: StringOption[];
  co2Scope1: number;
  co2Scope2: number;
  co2Scope3: number;
  co2PerTon: number;
  co2Classification: StringOption;
  releaseDateYear: number;
  releaseDateMonth: number;
  releaseRestrictions: string;
  blocked: boolean;
  castingMode: string;
  castingDiameter: StringOption;
  maxDimension: number;
  minDimension: number;
  steelMakingProcess: StringOption;
  productionProcess: StringOption;
  rating: StringOption;
  ratingRemark: string;
  ratingChangeComment: string;
  materialNumber: string;
  manufacturer: boolean;
  recyclingRate: number;

  standardDocument: StringOption;
  materialName: StringOption;
  supplier: StringOption;
  supplierPlant: StringOption;
  supplierCountry: StringOption;
  selfCertified: boolean;
}
